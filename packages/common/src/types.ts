import { z } from "zod";

export const UserSchema = z.object({
  email: z.string(),
  password: z.string(),
  name: z.string(),
  picture:z.string().optional()
});

export const SigninSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const RoomSchema = z.object({
  name: z.string(),
});
