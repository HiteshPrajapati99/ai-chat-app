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
Object.defineProperty(exports, "__esModule", { value: true });
const getAIUser_1 = require("../../helpers/getAIUser");
const prisma_service_1 = require("../../services/prisma-service");
class ChatServices {
    // Create a new chat
    createChat(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, user_ids, created_by } = data;
            // Create chat with members in a transaction to ensure data consistency
            const chat = yield prisma_service_1.db.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                if (user_ids && user_ids.length) {
                    // validate all user ids in db level
                    const users = yield tx.user.findMany({
                        where: {
                            id: {
                                in: user_ids,
                            },
                        },
                    });
                    if (users.length !== user_ids.length) {
                        throw new Error("Invalid user ids");
                    }
                }
                // Create the chat
                const newChat = yield tx.chat.create({
                    data: {
                        title: title || null,
                        created_by,
                    },
                });
                const chatUsers = [
                    {
                        chat_id: newChat.id,
                        user_id: created_by,
                        role: "admin",
                    },
                ];
                // Add other users
                if (user_ids && user_ids.length) {
                    user_ids.forEach((user_id) => {
                        if (user_id !== created_by) {
                            chatUsers.push({
                                chat_id: newChat.id,
                                user_id,
                                role: "user",
                            });
                        }
                    });
                }
                const aiUser = yield (0, getAIUser_1.getAIUser)();
                chatUsers.push({
                    chat_id: newChat.id,
                    user_id: aiUser.id,
                    role: "ai",
                });
                yield tx.chatUsers.createMany({
                    data: chatUsers,
                });
                return newChat;
            }));
            return this.getChatById(chat.id);
        });
    }
    // Get chat by ID with members and last message
    getChatById(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const chat = yield prisma_service_1.db.chat.findUnique({
                where: { id: chatId },
                include: {
                    users: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                },
                            },
                        },
                    },
                    messages: {
                        // as last message by user
                        take: 1,
                        orderBy: { created_at: "desc" },
                        select: {
                            content: true,
                            id: true,
                        },
                    },
                },
            });
            if (!chat) {
                throw new Error("Chat not found");
            }
            return {
                id: chat.id,
                title: chat.title,
                created_by: chat.created_by,
                created_at: chat.created_at,
                updated_at: chat.updated_at,
                users: chat.users,
                last_message: ((_a = chat.messages) === null || _a === void 0 ? void 0 : _a[0])
                    ? {
                        id: chat.messages[0].id,
                        content: chat.messages[0].content,
                    }
                    : undefined,
            };
        });
    }
    // Get all chats for a user
    getUserChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userChats = yield prisma_service_1.db.chatUsers.findMany({
                where: { user_id: userId },
                include: {
                    chat: {
                        include: {
                            users: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            username: true,
                                        },
                                    },
                                },
                            },
                            messages: {
                                take: 1,
                                orderBy: { created_at: "desc" },
                            },
                        },
                    },
                },
                orderBy: {
                    chat: {
                        updated_at: "desc",
                    },
                },
            });
            return userChats.map((userChat) => {
                var _a;
                return ({
                    id: userChat.chat.id,
                    title: userChat.chat.title,
                    created_by: userChat.chat.created_by,
                    created_at: userChat.chat.created_at,
                    updated_at: userChat.chat.updated_at,
                    users: userChat.chat.users,
                    last_message: ((_a = userChat.chat.messages) === null || _a === void 0 ? void 0 : _a[0])
                        ? {
                            id: userChat.chat.messages[0].id,
                            content: userChat.chat.messages[0].content,
                        }
                        : undefined,
                });
            });
        });
    }
    // Invite user to chat
    inviteUserToChat(chatId, userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_ids } = data;
            // find current user all chats
            const chat = yield prisma_service_1.db.chat.findMany({
                where: {
                    created_by: userId,
                },
                select: { id: true },
            });
            if (chat.length === 0) {
                throw new Error("No chat found");
            }
            const chatIds = chat.map((item) => item.id);
            if (!chatIds.includes(chatId))
                throw new Error("You are not the creator of this chat");
            // Check if user is already in chat
            const existingMember = yield prisma_service_1.db.chatUsers.findMany({
                where: {
                    chat_id: chatId,
                    user_id: {
                        in: user_ids,
                    },
                },
                select: {
                    user_id: true,
                },
            });
            const existingUsers = existingMember.map((item) => item.user_id);
            const newUsers = user_ids.filter((item) => !existingUsers.includes(item));
            // Add user to chat
            yield prisma_service_1.db.chatUsers.createMany({
                data: newUsers.map((item) => ({
                    chat_id: chatId,
                    user_id: item,
                    role: "user",
                })),
            });
            return this.getChatById(chatId);
        });
    }
    // Get messages for a chat
    getChatMessages(chatId, userId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 20 } = params;
            const skip = (page - 1) * limit;
            // Check if user is member of chat
            const membership = yield prisma_service_1.db.chatUsers.findFirst({
                where: {
                    chat_id: chatId,
                    user_id: userId,
                },
            });
            if (!membership) {
                throw new Error("You are not a member of this chat");
            }
            const messages = yield prisma_service_1.db.message.findMany({
                where: { chat_id: chatId },
                include: {
                    sender: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                },
                orderBy: { created_at: "asc" },
                skip,
                take: limit,
            });
            return messages.map((message) => ({
                id: message.id,
                chat_id: message.chat_id,
                sender_id: message.sender_id,
                content: message.content,
                type: message.type,
                createdAt: message.created_at,
                sender: message.sender,
            }));
        });
    }
    getMessageByID(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield prisma_service_1.db.message.findFirst({
                where: {
                    id: messageId,
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                },
            });
            if (!message) {
                throw new Error("Message not found");
            }
            return ({
                id: message.id,
                chat_id: message.chat_id,
                sender_id: message.sender_id,
                content: message.content,
                type: message.type,
                createdAt: message.created_at,
                sender: message.sender,
            });
        });
    }
    // // Send message
    // async sendMessage(
    //   chatId: number,
    //   senderId: number,
    //   data: SendMessageInput
    // ): Promise<MessageResponse> {
    //   const { content, type, reply_id } = data;
    //   // Check if user is member of chat
    //   const membership = await db.chatUsers.findFirst({
    //     where: {
    //       chat_id: chatId,
    //       user_id: senderId,
    //     },
    //   });
    //   if (!membership) {
    //     throw new Error("You are not a member of this chat");
    //   }
    //   // Create message
    //   const message = await db.message.create({
    //     data: {
    //       chat_id: chatId,
    //       sender_id: senderId,
    //       content,
    //       type,
    //       reply_id,
    //     },
    //     include: {
    //       sender: {
    //         select: {
    //           id: true,
    //           name: true,
    //           username: true,
    //         },
    //       },
    //       reply: {
    //         include: {
    //           sender: {
    //             select: {
    //               id: true,
    //               name: true,
    //               username: true,
    //             },
    //           },
    //         },
    //       },
    //     },
    //   });
    //   // Update chat's updated_at timestamp
    //   await db.chat.update({
    //     where: { id: chatId },
    //     data: { updated_at: new Date() },
    //   });
    //   return {
    //     id: message.id,
    //     chat_id: message.chat_id,
    //     sender_id: message.sender_id,
    //     content: message.content,
    //     type: message.type,
    //     reply_id: message.reply_id,
    //     createdAt: message.createdAt,
    //     sender: message.sender,
    //     reply: message.reply
    //       ? {
    //           id: message.reply.id,
    //           content: message.reply.content,
    //           sender: message.reply.sender,
    //         }
    //       : undefined,
    //   };
    // }
    // Remove user from chat
    removeUserFromChat(chatId, userId, removedBy) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if remover is admin or the user themselves
            const removerMembership = yield prisma_service_1.db.chatUsers.findFirst({
                where: {
                    chat_id: chatId,
                    user_id: removedBy,
                },
            });
            if (!removerMembership) {
                throw new Error("You are not a member of this chat");
            }
            if (removerMembership.role !== "admin" && removedBy !== userId) {
                throw new Error("Only admins can remove other users");
            }
            // Remove user from chat
            yield prisma_service_1.db.chatUsers.deleteMany({
                where: {
                    chat_id: chatId,
                    user_id: userId,
                },
            });
        });
    }
    // Update chat title
    updateChatTitle(chatId, title, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if user is admin
            const membership = yield prisma_service_1.db.chatUsers.findFirst({
                where: {
                    chat_id: chatId,
                    user_id: userId,
                    role: "admin",
                },
            });
            if (!membership) {
                throw new Error("Only admins can update chat title");
            }
            yield prisma_service_1.db.chat.update({
                where: { id: chatId },
                data: { title },
            });
            return this.getChatById(chatId);
        });
    }
}
exports.default = new ChatServices();
