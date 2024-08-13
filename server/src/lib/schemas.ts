import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
});

export const WorkspaceSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.optional(z.string()),
  adminId: z.string().min(1, { message: "Admin ID is required" }),
});

export const InviteSchema = z.object({
  workspaceId: z.string().min(1, { message: "Workspace ID is required" }),
  email: z.string().email({ message: "Invalid email" }),
  adminId: z.string().min(1, { message: "Admin ID is required" }),
});
