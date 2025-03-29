import { z } from "zod";

export const UserSchema = z.object({
   username: z.string(),
   password: z.string(),
   
});

export const SigninSchema = z.object({
   username: z.string(),
   password: z.string(),
  
});

export const RoomSchema = z.object({
   name: z.string(),
});