import { z } from "zod";

export const userSchema = z.object({
  name: z.string().optional(),
});

export type UserUpdate = z.infer<typeof userSchema>;
