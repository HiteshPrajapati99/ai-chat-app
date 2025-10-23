"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../helpers");
const messages_1 = require("../../lang/messages");
const services_1 = __importDefault(require("./services"));
const schema_1 = require("./schema");
class ChatController {
    constructor() {
        // Create a new chat
        this.createChat = (0, helpers_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            const data = {
                title: req.body.title,
                user_ids: req.body.user_ids,
                created_by: userId,
            };
            const chat = yield services_1.default.createChat(data);
            return helpers_1.resHandler.success(res, {
                m: messages_1.successMessages.chatCreated,
                r: chat,
            });
        }));
        // Get all chats for the authenticated user
        this.getChats = (0, helpers_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            const chats = yield services_1.default.getUserChats(userId);
            return helpers_1.resHandler.success(res, {
                m: messages_1.successMessages.chatList,
                r: chats,
            });
        }));
        // Get a specific chat by ID
        this.getChatById = (0, helpers_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const chatId = parseInt(req.params.chat_id);
            if (isNaN(chatId)) {
                return helpers_1.resHandler.error(res, {
                    errorType: "validationError",
                    m: messages_1.errorMessages.invalidChatId,
                });
            }
            const chat = yield services_1.default.getChatById(chatId);
            return helpers_1.resHandler.success(res, {
                m: messages_1.successMessages.chatDetails,
                r: chat,
            });
        }));
        // Invite user to chat
        this.inviteUser = (0, helpers_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            const chatId = parseInt(req.params.chat_id);
            if (isNaN(chatId)) {
                return helpers_1.resHandler.error(res, {
                    errorType: "validationError",
                    m: messages_1.errorMessages.invalidChatId,
                });
            }
            const chat = yield services_1.default.inviteUserToChat(chatId, userId, req.body);
            return helpers_1.resHandler.success(res, {
                m: "User invited successfully",
                r: chat,
            });
        }));
        // Get messages for a chat
        this.getMessages = (0, helpers_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            const chatId = req.query.chat_id;
            if (chatId && isNaN(Number(chatId))) {
                return helpers_1.resHandler.error(res, {
                    errorType: "validationError",
                    m: messages_1.errorMessages.invalidChatId,
                });
            }
            const validatedParams = schema_1.getMessagesSchema.parse(req.query);
            const messages = yield services_1.default.getChatMessages(Number(chatId), userId, validatedParams);
            return helpers_1.resHandler.success(res, {
                m: messages_1.successMessages.messageList,
                r: messages,
            });
        }));
        // Remove user from chat
        this.removeUser = (0, helpers_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            const chatId = parseInt(req.params.chat_id);
            const targetUserId = parseInt(req.params.user_id);
            if (isNaN(chatId) || isNaN(targetUserId)) {
                return helpers_1.resHandler.error(res, {
                    errorType: "validationError",
                    m: messages_1.errorMessages.invalidChatId,
                });
            }
            yield services_1.default.removeUserFromChat(chatId, targetUserId, userId);
            return helpers_1.resHandler.success(res, {
                m: messages_1.successMessages.userRemoved,
            });
        }));
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
}
exports.default = new ChatController();
