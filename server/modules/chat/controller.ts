import { resHandler, asyncHandler } from "../../helpers";
import { errorMessages, successMessages } from "../../lang/messages";
import chatService from "./services";
import { getMessagesSchema } from "./schema";

class ChatController {
  // Create a new chat
  createChat = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const data = {
      title: req.body.title,
      user_ids: req.body.user_ids,
      created_by: userId,
    };
    const chat = await chatService.createChat(data);

    return resHandler.success(res, {
      m: successMessages.chatCreated,
      r: chat,
    });
  });

  // Get all chats for the authenticated user
  getChats = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const chats = await chatService.getUserChats(userId);
    return resHandler.success(res, {
      m: successMessages.chatList,
      r: chats,
    });
  });

  // Get a specific chat by ID
  getChatById = asyncHandler(async (req, res) => {
    const chatId = parseInt(req.params.chat_id);

    if (isNaN(chatId)) {
      return resHandler.error(res, {
        errorType: "validationError",
        m: errorMessages.invalidChatId,
      });
    }

    const chat = await chatService.getChatById(chatId);
    return resHandler.success(res, {
      m: successMessages.chatDetails,
      r: chat,
    });
  });

  // Invite user to chat
  inviteUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const chatId = parseInt(req.params.chat_id);
    if (isNaN(chatId)) {
      return resHandler.error(res, {
        errorType: "validationError",
        m: errorMessages.invalidChatId,
      });
    }

    const chat = await chatService.inviteUserToChat(chatId, userId, req.body);

    return resHandler.success(res, {
      m: "User invited successfully",
      r: chat,
    });
  });

  // Get messages for a chat
  getMessages = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const chatId = req.query.chat_id;
    if (chatId && isNaN(Number(chatId))) {
      return resHandler.error(res, {
        errorType: "validationError",
        m: errorMessages.invalidChatId,
      });
    }

    const validatedParams = getMessagesSchema.parse(req.query);
    const messages = await chatService.getChatMessages(
      Number(chatId),
      userId,
      validatedParams
    );

    return resHandler.success(res, {
      m: successMessages.messageList,
      r: messages,
    });
  });

  // Remove user from chat
  removeUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const chatId = parseInt(req.params.chat_id);
    const targetUserId = parseInt(req.params.user_id);

    if (isNaN(chatId) || isNaN(targetUserId)) {
      return resHandler.error(res, {
        errorType: "validationError",
        m: errorMessages.invalidChatId,
      });
    }

    await chatService.removeUserFromChat(chatId, targetUserId, userId);
    return resHandler.success(res, {
      m: successMessages.userRemoved,
    });
  });

  // Update chat title
  // updateChatTitle = asyncHandler(async (req: Request, res: Response) => {
  //   const userId = req.user?.id;
  //   if (!userId) {
  //     return resHandler(res, 401, errorMessages.UNAUTHORIZED);
  //   }

  //   const chatId = parseInt(req.params.chat_id);
  //   if (isNaN(chatId)) {
  //     return resHandler(res, 400, "Invalid chat ID");
  //   }

  //   const { title } = req.body;
  //   if (!title || typeof title !== "string") {
  //     return resHandler(res, 400, "Title is required and must be a string");
  //   }

  //   const chat = await chatService.updateChatTitle(chatId, title, userId);
  //   return resHandler(res, 200, "Chat title updated successfully", chat);
  // });

  // Leave chat (remove self from chat)
  // leaveChat = asyncHandler(async (req: Request, res: Response) => {
  //   const userId = req.user?.id;
  //   if (!userId) {
  //     return resHandler(res, 401, errorMessages.UNAUTHORIZED);
  //   }

  //   const chatId = parseInt(req.params.chat_id);
  //   if (isNaN(chatId)) {
  //     return resHandler(res, 400, "Invalid chat ID");
  //   }

  //   await chatService.removeUserFromChat(chatId, userId, userId);
  //   return resHandler(res, 200, "Left chat successfully");
  // });
}

export default new ChatController();
