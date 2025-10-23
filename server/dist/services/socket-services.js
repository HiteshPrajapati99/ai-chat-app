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
const socket_io_1 = __importDefault(require("socket.io"));
const redis_adapter_1 = require("@socket.io/redis-adapter");
const ioredis_1 = __importDefault(require("ioredis"));
const prisma_service_1 = require("./prisma-service");
const services_1 = __importDefault(require("../modules/chat/services"));
const ai_service_1 = require("./ai-service");
const config_1 = require("../config");
let connectedUsers = {}; // key user id and value is socket id
class SocketService {
    constructor(server) {
        this.io = new socket_io_1.default.Server(server, {
            pingTimeout: 60000, // 60s
            cors: { origin: "*" },
        });
        this.initialize();
    }
    initialize() {
        console.log("Socket service initialized");
        // use redis adapter
        const pub = new ioredis_1.default({
            host: config_1.config.REDIS_HOST,
            port: Number(config_1.config.REDIS_PORT),
            username: config_1.config.REDIS_USERNAME,
            password: config_1.config.REDIS_PASSWORD,
            maxRetriesPerRequest: 3,
        });
        const sub = pub.duplicate();
        pub.on("connect", () => {
            console.log("Redis connected");
        });
        pub.on("error", (err) => {
            console.error("Redis error:", err);
        });
        this.io.adapter((0, redis_adapter_1.createAdapter)(pub, sub));
        this.io.on("connection", this.handleConnection.bind(this));
    }
    handleConnection(socket) {
        var _a;
        const user_id = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!user_id) {
            console.error("user not found");
            return;
        }
        this.handleUserConnected({ socket, user_id: String(user_id) });
        // join to the room
        socket.on("join-chat", (chat_id) => {
            this.joinChat({ socket, chat_id });
        });
        socket.on("leave-chat", (chat_id) => {
            this.leaveChat({ socket, chat_id });
        });
        // Message
        socket.on("message:sent", (data) => {
            this.sendMessage({ socket, message: data, user_id });
        });
        // disconnect
        socket.on("disconnect", () => {
            this.handleUserDisconnected({ socket });
        });
    }
    handleUserConnected(data) {
        // Store user status in memory (or Redis, if needed)
        connectedUsers[data.user_id] = data.socket.id;
    }
    handleUserDisconnected(data) {
        const userId = Object.keys(connectedUsers).find((id) => connectedUsers[id] === data.socket.id);
        if (!userId)
            return;
        // Remove user from the connected users list
        delete connectedUsers[userId];
    }
    // Chat
    joinChat(data) {
        data.socket.join(String(data.chat_id));
    }
    leaveChat(data) {
        data.socket.leave(String(data.chat_id));
    }
    // send and receive messages
    sendMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { message: receiveMessage, socket, user_id } = data;
            let chat_id = null;
            try {
                if (user_id === undefined || data === undefined)
                    return;
                //  create chat if not exist
                let chat = null;
                let isCreateChatTitle = false;
                if (receiveMessage.chat_id) {
                    chat_id = typeof receiveMessage.chat_id === "string" ? Number(receiveMessage.chat_id) : receiveMessage.chat_id;
                    const currChat = yield prisma_service_1.db.chat.findFirst({
                        where: {
                            id: chat_id
                        },
                        select: {
                            id: true,
                            title: true,
                        }
                    });
                    isCreateChatTitle = (currChat === null || currChat === void 0 ? void 0 : currChat.title) === null;
                }
                else {
                    try {
                        chat = yield services_1.default.createChat({
                            created_by: user_id,
                        });
                        chat_id = chat.id;
                        // inform client that chat is created
                        socket.emit("chat:creating", { chat_id: chat_id });
                    }
                    catch (error) {
                        console.log("Error creating chat:" + error);
                    }
                }
                if (!chat_id)
                    return;
                let messageData = {
                    content: receiveMessage.content,
                    chat_id: chat_id,
                    sender_id: user_id,
                    type: "user",
                };
                const newMessage = yield prisma_service_1.db.message.create({
                    data: messageData,
                    select: { id: true }
                });
                const newMessageData = yield services_1.default.getMessageByID(newMessage.id);
                this.io
                    .to(String(messageData.chat_id))
                    .emit("message:received", newMessageData);
                // Generate a temp id for client to attach streaming chunks to a placeholder message
                const tempId = `ai-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
                this.io.to(String(messageData.chat_id)).emit("ai:started", {
                    chatId: messageData.chat_id,
                    tempId,
                    senderName: "AI",
                });
                //  Fire the streaming worker
                try {
                    const { title: chatTitle } = yield (0, ai_service_1.streamAndSaveAIReply)({
                        io: this.io,
                        chatId: Number(messageData.chat_id),
                        prompt: receiveMessage.content, // as user message
                        tempId,
                        isCreateChatTitle: chat !== null || isCreateChatTitle,
                        model: receiveMessage.ai_model
                    });
                    if (chat) {
                        socket.emit("chat:created", Object.assign(Object.assign({}, chat), { title: chatTitle }));
                    }
                    if (isCreateChatTitle) {
                        socket.emit("chat:updated", { chat_id, title: chatTitle });
                    }
                }
                catch (error) {
                    if (chat) {
                        socket.emit("chat:created", chat);
                    }
                    console.log("Error streaming AI reply:" + error);
                }
            }
            catch (error) {
                console.log("Error sending message to chat " + chat_id + ":" + error);
                socket.emit("message:error", {
                    chatId: chat_id,
                    error: "Error sending message to chat " + error,
                });
            }
        });
    }
}
exports.default = SocketService;
