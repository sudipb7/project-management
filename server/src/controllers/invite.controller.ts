import { v4 as uuid } from "uuid";
import { addDays } from "date-fns";
import { RequestHandler } from "express";
import { InviteStatus } from "@prisma/client";

import { InviteSchema } from "../lib/schemas";
import UserService from "../services/user.service";
import InviteService from "../services/invite.service";
import WorkspaceService from "../services/workspace.service";

class InviteController {
  private userService = new UserService();
  private inviteService = new InviteService();
  private workspaceService = new WorkspaceService();

  public getInvites: RequestHandler = async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const take = parseInt(req.query.take as string) || 10;
      const skip = (page - 1) * take;
      const userId = req.query.userId as string;
      const status = req.query.status as string;
      const workspaceId = req.query.workspaceId as string;

      let where = {};

      if (workspaceId) {
        where = { ...where, workspaceId };
      }

      if (userId) {
        where = { ...where, userId };
      }

      if (status) {
        where = { ...where, status };
      }

      const count = await this.inviteService.getInviteCount(where);
      const invites = await this.inviteService.getInvites(take, skip, where);

      const isNext = count > page * take;

      return res
        .status(200)
        .json({ message: "Invites fetched successfully", invites, count, isNext });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public createInviteLink: RequestHandler = async (req, res) => {
    try {
      const schema = InviteSchema.safeParse(req.body);
      if (!schema.success) {
        return res.status(400).json({ message: schema.error.errors[0].message });
      }

      const { workspaceId, email, adminId } = schema.data;

      const workspace = await this.workspaceService.getUniqueWorkspace({ id: workspaceId });
      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      const isAdmin = workspace.members.some(
        (member) => member.userId === adminId && member.role === "ADMIN"
      );
      if (!isAdmin) {
        return res.status(403).json({ message: "You are not authorized to invite members" });
      }

      const user = await this.userService.getUniqueUser({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isAlreadyMember = workspace.members.find((member) => member.userId === user.id);
      if (!isAlreadyMember) {
        return res.status(409).json({ message: "User is already a member of this workspace" });
      }

      const existingInvite = await this.inviteService.getInvite({ workspaceId, userId: user.id });
      if (existingInvite && existingInvite.expiresAt > new Date()) {
        return res.status(409).json({ message: "Invite already exists" });
      }

      const invite = await this.inviteService.createInvite({
        code: uuid(),
        status: InviteStatus.PENDING,
        expiresAt: addDays(new Date(), 7),
        user: { connect: { id: user.id } },
        workspace: { connect: { id: workspaceId } },
      });

      return res.status(201).json({ message: "Invite created successfully", invite });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public joinWorkspaceByInviteLink: RequestHandler = async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ message: "Invite code is required" });
      }

      const invite = await this.inviteService.getInvite({ code });
      if (!invite) {
        return res.status(400).json({ message: "Invalid invite code" });
      }

      if (invite.expiresAt < new Date()) {
        return res.status(400).json({ message: "Invite has expired" });
      }

      if (invite.status === InviteStatus.ACCEPTED) {
        return res.status(400).json({ message: "Invite has already been accepted" });
      }

      if (invite.status === InviteStatus.REJECTED) {
        return res.status(400).json({ message: "Invite has been rejected" });
      }

      await this.workspaceService.updateWorkspace(invite.workspaceId, {
        members: { create: { userId: invite.userId } },
      });
      await this.inviteService.updateInvite({ id: invite.id }, { status: InviteStatus.ACCEPTED });

      return res.status(200).json({ message: "Invite accepted successfully" });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public rejectWorkspaceInvite: RequestHandler = async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ message: "Invite code is required" });
      }

      const invite = await this.inviteService.getInvite({ code });
      if (!invite) {
        return res.status(400).json({ message: "Invalid invite code" });
      }

      if (invite.expiresAt < new Date()) {
        return res.status(400).json({ message: "Invite has expired" });
      }

      if (invite.status === InviteStatus.ACCEPTED) {
        return res.status(400).json({ message: "Invite has already been accepted" });
      }

      if (invite.status === InviteStatus.REJECTED) {
        return res.status(400).json({ message: "Invite has been rejected" });
      }

      await this.inviteService.updateInvite({ id: invite.id }, { status: InviteStatus.REJECTED });

      return res.status(200).json({ message: "Invite rejected successfully" });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public deleteInviteLink: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id;
      const adminId = req.query.adminId as string | undefined;
      if (!id) {
        return res.status(400).json({ message: "Invite ID is required" });
      }

      if (!adminId) {
        return res.status(400).json({ message: "Admin ID is required" });
      }

      const invite = await this.inviteService.getUniqueInvite({ id });
      if (!invite) {
        return res.status(404).json({ message: "Invite not found" });
      }

      const workspace = await this.workspaceService.getUniqueWorkspace({ id: invite.workspaceId });
      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      const isAdmin = workspace.members.some(
        (member) => member.userId === adminId && member.role === "ADMIN"
      );
      if (!isAdmin) {
        return res.status(403).json({ message: "You are not authorized to delete this invite" });
      }

      await this.inviteService.deleteInvite(id);

      return res.status(200).json({ message: "Invite deleted successfully" });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default InviteController;
