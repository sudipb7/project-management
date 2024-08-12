import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { MemberRole } from "@prisma/client";

import { WorkspaceSchema } from "../lib/schemas";
import S3Service from "../services/s3.service";
import WorkspaceService from "../services/workspace.service";

class WorkspaceController {
  private s3Service = new S3Service();
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
      const workspaces = await this.workspaceService.getWorkspaces(where, take, skip);

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
      let where = {};

      if (isAdmin) {
        where = { members: { some: { userId, role: "ADMIN" } } };
      } else {
        where = { members: { some: { userId } } };
      }

      const workspaces = await this.workspaceService.getWorkspaces(where);

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
        inviteCode: uuidv4(),
      });

      if (!file) {
        return res.status(200).json({ message: "Workspace created successfully", workspace });
      }

      const key = `workspace/${workspace.id}/${file.originalname}`;
      await this.s3Service.uploadToS3(key, file.buffer, file.mimetype);

      const updatedWorkspace = await this.workspaceService.updateWorkspace(workspace.id, {
        image: key,
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

      const key = `workspace/${id}/${file.originalname}`;
      await this.s3Service.uploadToS3(key, file.buffer, file.mimetype);

      if (workspace.image) {
        await this.s3Service.deleteFromS3(workspace.image);
      }

      const updatedWorkspace = await this.workspaceService.updateWorkspace(id, {
        name,
        description,
        image: key,
      });

      return res
        .status(200)
        .json({ message: "Workspace updated successfully", workspace: updatedWorkspace });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public updateInviteCode: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id;
      const adminId = req.body.adminId;

      if (!adminId) {
        return res.status(400).json({ message: "Admin ID is required" });
      }

      if (!id) {
        return res.status(400).json({ message: "Workspace ID is required" });
      }

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

      const updatedWorkspace = await this.workspaceService.updateWorkspace(id, {
        inviteCode: uuidv4(),
      });

      return res
        .status(200)
        .json({ message: "Invite code updated successfully", workspace: updatedWorkspace });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public joinWorkspaceByInviteCode: RequestHandler = async (req, res) => {
    try {
      const userId = req.body.id;
      const inviteCode = req.body.inviteCode;

      if (!inviteCode) {
        return res.status(400).json({ message: "Invite code is required" });
      }

      const workspace = await this.workspaceService.getWorkspace({ inviteCode });
      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      const isMember = workspace.members.find((member) => member.userId === userId);
      if (isMember) {
        return res.status(400).json({ message: "You are already a member of this workspace" });
      }

      await this.workspaceService.updateWorkspace(workspace.id, {
        members: { create: { userId, role: MemberRole.MEMBER } },
      });

      return res.status(200).json({ message: "You have joined the workspace successfully" });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default WorkspaceController;
