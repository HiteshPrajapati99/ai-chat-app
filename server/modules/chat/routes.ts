import { Router } from "express";
import validateReq from "../../middlewares/validateReq";
import chatController from "./controller";
import {
  createChatSchema,
  inviteUserSchema,
  getMessagesSchema,
  sendMessageSchema,
} from "./schema";

const router = Router();

// Chat Management Routes
router.post("/", validateReq(createChatSchema), chatController.createChat);
router.get("/", chatController.getChats);
router.get("/:chat_id", chatController.getChatById);

// Chat Member Management
router.post(
  "/:chat_id/invite",
  validateReq(inviteUserSchema),
  chatController.inviteUser
);
router.delete("/:chat_id/users/:user_id", chatController.removeUser);

// Message Routes
router.get(
  "/:chat_id/messages",
  validateReq(getMessagesSchema, "query"),
  chatController.getMessages
);

export default router;
