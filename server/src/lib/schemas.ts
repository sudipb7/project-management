import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  image: z.optional(z.string()),
});

export const OrganizationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  image: z.optional(z.string()),
  description: z.optional(z.string()),
  slug: z.string().min(1, { message: "Slug is required" }),
});
