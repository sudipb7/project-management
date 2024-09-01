import { z } from "zod";

export const ProfileSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  image: z.optional(z.string()),
});

export const WorkspaceSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(32, { message: "Name must be at most 32 characters long" }),
  image: z.optional(z.string()),
  description: z
    .string()
    .min(100, "Description must be at least 100 characters long")
    .max(300, { message: "Description must be at most 300 characters long" }),
  isPublic: z.boolean().default(true),
});
