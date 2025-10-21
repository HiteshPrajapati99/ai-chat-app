import * as z from "zod";

// Chat Schemas
export const createChatSchema = z.object({
  title: z.string().optional(),
  user_ids: z.array(z.number()).optional(),
});

export const inviteUserSchema = z.object({
  user_ids: z.array(z.number()).min(1, "At least one member is required"),
});

export const getMessagesSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 20)),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, "Message content is required"),
  reply_id: z.number().optional(),
});

// Types
export type CreateChatInput = z.infer<typeof createChatSchema>;
export type InviteUserInput = z.infer<typeof inviteUserSchema>;
export type GetMessagesInput = z.infer<typeof getMessagesSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;

// Response Types
export interface ChatResponse {
  id: number;
  title?: string | null;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  users: {
    id: number;
    user_id: number;
    role: string;
    joined_at: Date;
    user: {
      id: number;
      name?: string;
      username: string;
    };
  }[];
  last_message?: {
    id: number;
    content: string;
  };
}

export interface MessageResponse {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  type: string;
  createdAt: Date;
  sender: {
    id: number;
    username: string;
  };
}
