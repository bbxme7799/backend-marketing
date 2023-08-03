import * as z from "zod";

export const SignupSchema = z.object({
  username: z.string().trim().min(1),
  email: z.string().email(),
  password: z.string().trim().min(1),
});
export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().trim().min(1),
});
