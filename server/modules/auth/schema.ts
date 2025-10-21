import * as z from "zod";

export const userSchema = z.object({
  username: z.string({ error: "Email is required..." }).trim(),
  password: z.string({ error: "Password is required..." }).trim(),
});

export type User = z.infer<typeof userSchema>;
