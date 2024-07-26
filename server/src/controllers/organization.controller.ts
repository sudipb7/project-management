import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { MemberRole } from "@prisma/client";

import S3Service from "../services/s3.service";
import OrganizationService from "../services/organization.service";
import { OrganizationSchema } from "../lib/schemas";

class OrganizationController {
  private s3Service = new S3Service();
  private OrganizationService = new OrganizationService();

  public getOrganizations: RequestHandler = async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const take = parseInt(req.query.take as string) || 10;
      const skip = (page - 1) * take;
      const search = req.query.search as string;

      let where = {};

      if (search) {
        where = {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
            { slug: { contains: search } },
          ],
        };
      }

      const count = await this.OrganizationService.getOrganizationCount(where);
      const organizations = await this.OrganizationService.getOrganizations(take, skip, where);

      const isNext = count > page * take;

      return res
        .status(200)
        .json({ message: "Organizations fetched successfully", organizations, count, isNext });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public getOrganizationById: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Organization ID is required" });
      }

      const organization = await this.OrganizationService.getUniqueOrganization({ id });
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }

      return res.status(200).json({ message: "Organization fetched successfully", organization });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public getOrganizationsByUser: RequestHandler = async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const take = parseInt(req.query.take as string) || 10;
      const skip = (page - 1) * take;
      const userId = req.params.id;
      const isAdmin = req.query.isAdmin === "true";
      let where = {};

      if (isAdmin) {
        where = { members: { some: { userId, role: "ADMIN" } } };
      } else {
        where = { members: { some: { userId } } };
      }

      const count = await this.OrganizationService.getOrganizationCount(where);
      const organizations = await this.OrganizationService.getOrganizations(take, skip, where);

      const isNext = count > page * take;

      return res
        .status(200)
        .json({ message: "Organizations fetched successfully", organizations, count, isNext });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public createOrganization: RequestHandler = async (req, res) => {
    try {
      const file = req.file;
      const adminId = req.params.id;
      const schema = OrganizationSchema.safeParse(req.body);

      if (!adminId) {
        return res.status(400).json({ message: "Admin ID is required" });
      }

      if (!schema.success) {
        return res.status(400).json({ message: schema.error.errors[0].message });
      }

      const { name, description, slug } = schema.data;

      const organization = await this.OrganizationService.createOrganization({
        name,
        description,
        slug,
        members: { create: { userId: adminId, role: "ADMIN" } },
        inviteCode: uuidv4(),
      });

      if (!file) {
        return res.status(200).json({ message: "Organization created successfully", organization });
      }

      const key = `organization/${organization.id}/${file.originalname}`;
      await this.s3Service.uploadToS3(key, file.buffer, file.mimetype);

      const updatedOrganization = await this.OrganizationService.updateOrganization(
        organization.id,
        { image: key }
      );

      return res
        .status(200)
        .json({ message: "Organization created successfully", organization: updatedOrganization });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public updateOrganization: RequestHandler = async (req, res) => {
    try {
      const file = req.file;
      const id = req.params.id;
      const adminId = req.body.adminId;
      const schema = OrganizationSchema.safeParse(req.body);

      if (!id) {
        return res.status(400).json({ message: "Organization ID is required" });
      }

      if (!schema.success) {
        return res.status(400).json({ message: schema.error.errors[0].message });
      }

      const { name, description, slug } = schema.data;

      const organization = await this.OrganizationService.getUniqueOrganization({ id });
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }

      const isAdmin = organization?.members.find(
        (member) => member.userId === adminId && member.role === MemberRole.ADMIN
      );
      if (!isAdmin) {
        return res
          .status(403)
          .json({ message: "You are not authorized to update this organization" });
      }

      if (!file) {
        const updatedOrganization = await this.OrganizationService.updateOrganization(id, {
          name,
          description,
          slug,
        });
        return res.status(200).json({
          message: "Organization updated successfully",
          organization: updatedOrganization,
        });
      }

      const key = `organization/${id}/${file.originalname}`;
      await this.s3Service.uploadToS3(key, file.buffer, file.mimetype);

      if (organization.image) {
        await this.s3Service.deleteFromS3(organization.image);
      }

      const updatedOrganization = await this.OrganizationService.updateOrganization(id, {
        name,
        description,
        slug,
        image: key,
      });

      return res
        .status(200)
        .json({ message: "Organization updated successfully", organization: updatedOrganization });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public updateInviteCode: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id;
      const adminId = req.body.adminId;

      if (!id) {
        return res.status(400).json({ message: "Organization ID is required" });
      }

      const organization = await this.OrganizationService.getUniqueOrganization({ id });
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }

      const isAdmin = organization?.members.find(
        (member) => member.userId === adminId && member.role === MemberRole.ADMIN
      );
      if (!isAdmin) {
        return res
          .status(403)
          .json({ message: "You are not authorized to update this organization" });
      }

      const updatedOrganization = await this.OrganizationService.updateOrganization(id, {
        inviteCode: uuidv4(),
      });

      return res
        .status(200)
        .json({ message: "Invite code updated successfully", organization: updatedOrganization });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public joinOrganizationByInviteCode: RequestHandler = async (req, res) => {
    try {
      const userId = req.body.id;
      const inviteCode = req.body.inviteCode;

      if (!inviteCode) {
        return res.status(400).json({ message: "Invite code is required" });
      }

      const organization = await this.OrganizationService.getOrganization({ inviteCode });
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }

      const isMember = organization.members.find((member) => member.userId === userId);
      if (isMember) {
        return res.status(400).json({ message: "You are already a member of this organization" });
      }

      await this.OrganizationService.updateOrganization(organization.id, {
        members: { create: { userId, role: MemberRole.MEMBER } },
      });

      return res.status(200).json({ message: "You have joined the organization successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default OrganizationController;
