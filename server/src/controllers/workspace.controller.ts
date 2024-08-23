import { v4 as uuid } from "uuid";
import { RequestHandler } from "express";
import { MemberRole } from "@prisma/client";

import { AWS_URL_PREFIX } from "../lib/config";
import { WorkspaceSchema } from "../lib/schemas";
import S3Service from "../services/s3.service";
import UserService from "../services/user.service";
import WorkspaceService from "../services/workspace.service";

class WorkspaceController {
  private s3Service = new S3Service();
  private userService = new UserService();
  private workspaceService = new WorkspaceService();

  public getWorkspaces: RequestHandler = async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const take = parseInt(req.query.take as string) || 10;
      const skip = (page - 1) * take;
      const search = req.query.search as string;

      let where = {};

      if (search) {
        where = {
          OR: [{ name: { contains: search } }, { description: { contains: search } }],
        };
      }

      const count = await this.workspaceService.getWorkspaceCount(where);
      const workspaces = await this.workspaceService.getWorkspaces(where, {}, take, skip);

      const isNext = count > page * take;

      return res
        .status(200)
        .json({ message: "Workspaces fetched successfully", workspaces, count, isNext });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public getWorkspaceById: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Workspace ID is required" });
      }

      const workspace = await this.workspaceService.getUniqueWorkspace({ id });
      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      return res.status(200).json({ message: "Workspace fetched successfully", workspace });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public getWorkspacesByUser: RequestHandler = async (req, res) => {
    try {
      const userId = req.params.id;
      const isAdmin = req.query.isAdmin === "true";
      const includeMembers = req.query.includeMembers === "true";
      const includeUsers = req.query.includeUsers === "true";
      let where = {};
      let include = {};

      if (isAdmin) {
        where = { members: { some: { userId, role: "ADMIN" } } };
      } else {
        where = { members: { some: { userId } } };
      }

      if (includeMembers) {
        include = { members: true };
      }
      if (includeUsers) {
        include = { ...include, members: { include: { user: true } } };
      }

      const workspaces = await this.workspaceService.getWorkspaces(where, include);

      return res.status(200).json({ message: "Workspaces fetched successfully", workspaces });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public createWorkspace: RequestHandler = async (req, res) => {
    try {
      const file = req.file;
      const schema = WorkspaceSchema.safeParse(req.body);

      if (!schema.success) {
        return res.status(400).json({ message: schema.error.errors[0].message });
      }

      const { name, description, adminId } = schema.data;

      const workspace = await this.workspaceService.createWorkspace({
        name,
        description,
        members: { create: { userId: adminId, role: "ADMIN" } },
      });

      if (!file) {
        return res.status(200).json({ message: "Workspace created successfully", workspace });
      }

      const key = `workspace/${workspace.id}/${uuid()}-${file.originalname.replace(/ /g, "-")}`;
      await this.s3Service.uploadToS3(key, file.buffer, file.mimetype.split("/")[1]);

      const updatedWorkspace = await this.workspaceService.updateWorkspace(workspace.id, {
        image: AWS_URL_PREFIX + key,
      });

      return res
        .status(200)
        .json({ message: "Workspace created successfully", workspace: updatedWorkspace });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public updateWorkspace: RequestHandler = async (req, res) => {
    try {
      const file = req.file;
      const id = req.params.id;
      const schema = WorkspaceSchema.safeParse(req.body);

      if (!id) {
        return res.status(400).json({ message: "Workspace ID is required" });
      }

      if (!schema.success) {
        return res.status(400).json({ message: schema.error.errors[0].message });
      }

      const { name, description, adminId } = schema.data;

      const workspace = await this.workspaceService.getUniqueWorkspace({ id });
      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      const isAdmin = workspace?.members.find(
        (member) => member.userId === adminId && member.role === MemberRole.ADMIN
      );
      if (!isAdmin) {
        return res.status(403).json({ message: "You are not authorized to update this workspace" });
      }

      if (!file) {
        const updatedWorkspace = await this.workspaceService.updateWorkspace(id, {
          name,
          description,
        });
        return res.status(200).json({
          message: "Workspace updated successfully",
          workspace: updatedWorkspace,
        });
      }

      const key = `workspace/${id}/${uuid()}-${file.originalname.replace(/ /g, "-")}`;
      await this.s3Service.uploadToS3(key, file.buffer, file.mimetype.split("/")[1]);

      if (workspace.image) {
        await this.s3Service.deleteFromS3(workspace.image.replace(AWS_URL_PREFIX!, ""));
      }

      const updatedWorkspace = await this.workspaceService.updateWorkspace(id, {
        name,
        description,
        image: AWS_URL_PREFIX + key,
      });

      return res
        .status(200)
        .json({ message: "Workspace updated successfully", workspace: updatedWorkspace });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public deleteWorkspace: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id;
      const adminId = req.body.adminId;

      if (!id) {
        return res.status(400).json({ message: "Workspace ID is required" });
      }

      if (!adminId) {
        return res.status(400).json({ message: "Admin ID is required" });
      }

      const workspace = await this.workspaceService.getUniqueWorkspace({ id });
      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      const admin = workspace?.members.find(
        (member) => member.userId === adminId && member.role === MemberRole.ADMIN
      );
      if (!admin) {
        return res.status(403).json({ message: "You are not authorized to delete this workspace" });
      }

      const user = await this.userService.getUser({ id: admin.userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userWorkspaces = await this.workspaceService.getWorkspaces({
        members: { some: { userId: user.id } },
      });
      if (userWorkspaces.length === 1) {
        return res.status(400).json({ message: "You can't delete your last workspace" });
      }

      if (workspace.image) {
        await this.s3Service.deleteFromS3(workspace.image.replace(AWS_URL_PREFIX!, ""));
      }

      await this.workspaceService.deleteWorkspace(id);

      return res.status(200).json({ message: "Workspace deleted successfully" });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default WorkspaceController;
