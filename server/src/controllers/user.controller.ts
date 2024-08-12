import { RequestHandler } from "express";
import { MemberRole } from "@prisma/client";

import { UserSchema } from "../lib/schemas";
import S3Service from "../services/s3.service";
import UserService from "../services/user.service";

class UserController {
  private s3Service = new S3Service();
  private userService = new UserService();

  public getUsers: RequestHandler = async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const take = parseInt(req.query.take as string) || 10;
      const skip = (page - 1) * take;
      const search = req.query.search as string;

      let where = {};

      if (search) {
        where = { OR: [{ name: { contains: search } }, { email: { contains: search } }] };
      }

      const count = await this.userService.getUserCount(where);
      const users = await this.userService.getUsers(take, skip, where);

      const isNext = count > page * take;

      return res.status(200).json({ message: "Users fetched successfully", users, count, isNext });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public getUserByEmail: RequestHandler = async (req, res) => {
    try {
      const email = req.params.email;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await this.userService.getUniqueUser({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User fetched successfully", user });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public getUserById: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const user = await this.userService.getUniqueUser({ id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User fetched successfully", user });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public getUsersByWorkspace: RequestHandler = async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const take = parseInt(req.query.take as string) || 10;
      const skip = (page - 1) * take;
      const workspaceId = req.params.id;
      const isAdmin = req.query.isAdmin === "true";
      let where = {};

      if (workspaceId) {
        where = { members: { some: { workspaceId } } };
      }

      if (isAdmin) {
        where = { members: { some: { workspaceId }, role: MemberRole.ADMIN } };
      }

      const count = await this.userService.getUserCount(where);
      const users = await this.userService.getUsers(take, skip, where);

      const isNext = count > page * take;

      return res.status(200).json({ message: "Users fetched successfully", users, count, isNext });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public createUser: RequestHandler = async (req, res) => {
    try {
      const file = req.file;
      const schema = UserSchema.safeParse(req.body);

      if (!schema.success) {
        return res.status(400).json({ message: schema.error.errors[0].message });
      }

      const { name, email } = schema.data;

      const existingUser = await this.userService.getUniqueUser({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      if (!file) {
        const user = await this.userService.createUser({ name, email });
        return res.status(200).json({ message: "User created successfully", user });
      }

      const key = `user/${email}/${file.originalname}`;
      await this.s3Service.uploadToS3(key, file.buffer, file.mimetype);

      const user = await this.userService.createUser({
        name,
        email,
        image: key,
      });

      return res.status(200).json({ message: "User created successfully", user });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public updateUser: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id;
      const file = req.file;

      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const schema = UserSchema.safeParse(req.body);
      if (!schema.success) {
        return res.status(400).json({ message: schema.error.errors[0].message });
      }

      const { name, email } = schema.data;

      const user = await this.userService.getUniqueUser({ id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!file) {
        const updatedUser = await this.userService.updateUser({ id }, { name, email });
        return res.status(200).json({ message: "User updated successfully", user: updatedUser });
      }

      if (user.image) {
        await this.s3Service.deleteFromS3(user.image);
      }

      const key = `user/${id}/${file.originalname}`;
      await this.s3Service.uploadToS3(key, file.buffer, file.mimetype);

      const updatedUser = await this.userService.updateUser({ id }, { name, email, image: key });

      return res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public deleteUserImage: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const user = await this.userService.getUniqueUser({ id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.image) {
        return res.status(404).json({ message: "User image not found" });
      }

      await this.s3Service.deleteFromS3(user.image);

      const updatedUser = await this.userService.updateUser({ id }, { image: null });

      return res.status(200).json({ message: "Image deleted successfully", user: updatedUser });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default UserController;
