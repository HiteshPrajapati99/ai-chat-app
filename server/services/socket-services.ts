import { Server } from "http";
import socketIO, {
  Socket as SocketType,
  Server as SocketServer,
} from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import { db } from "./prisma-service";
import ChatServices from "../modules/chat/services";
import { streamAndSaveAIReply } from "./ai-service";
import { config } from "../config";

type SendMessageType = {
  chat_id: number;
  content: string;
  ai_model?: string;
};


let connectedUsers: Record<string, string> = {}; // key user id and value is socket id

class SocketService {
  io: SocketServer;

  constructor(server: Server) {
    this.io = new socketIO.Server(server, {
      pingTimeout: 60000, // 60s
      cors: { origin: "*" },
    });

    this.initialize();
  }

  private  initialize() {
    console.log("Socket service initialized");
    // use redis adapter
    const pub = new Redis({
      host : config.REDIS_HOST,
      port  : Number(config.REDIS_PORT),
      username : config.REDIS_USERNAME,
      password : config.REDIS_PASSWORD,
      maxRetriesPerRequest : 3,
    });
    const sub = pub.duplicate();

    pub.on("connect" , () => {
      console.log("Redis connected");
    })
    pub.on("error", (err) => {
      console.error("Redis error:", err);
    })
    this.io.adapter(createAdapter(pub, sub));

    this.io.on("connection", this.handleConnection.bind(this));
  }

  private handleConnection(socket: SocketType) {
    const user_id: number = socket.handshake.auth?.user_id;

    if (!user_id) {
      console.error("user not found");
      return;
    }

    this.handleUserConnected({ socket, user_id: String(user_id) });

    // join to the room
    socket.on("join-chat", (chat_id: number) => {
      this.joinChat({ socket, chat_id });
    });

    socket.on("leave-chat", (chat_id: number) => {
      this.leaveChat({ socket, chat_id });
    });

    // Message
    socket.on("message:sent", (data: SendMessageType) => {
      this.sendMessage({ socket, message: data, user_id });
    });

    // disconnect
    socket.on("disconnect", () => {
      this.handleUserDisconnected({ socket });
    });
  }

  private handleUserConnected(data: { socket: SocketType; user_id: string }) {
    // Store user status in memory (or Redis, if needed)
    connectedUsers[data.user_id] = data.socket.id;
  }

  private handleUserDisconnected(data: { socket: SocketType }) {
    const userId = Object.keys(connectedUsers).find(
      (id) => connectedUsers[id] === data.socket.id
    );
    if (!userId) return;
    // Remove user from the connected users list
    delete connectedUsers[userId];
  }

  // Chat
  private joinChat(data: { socket: SocketType; chat_id: number }) {
    data.socket.join(String(data.chat_id));
  }

  private leaveChat(data: { socket: SocketType; chat_id: number }) {
    data.socket.leave(String(data.chat_id));
  }

  // send and receive messages
  private async sendMessage(data: {
    socket: SocketType;
    message: SendMessageType;
    user_id: number;
  }) {
    const { message: receiveMessage, socket, user_id } = data;
    let chat_id = null;
    try {

      if (user_id === undefined || data === undefined) return;
      //  create chat if not exist
      let chat = null;
      let isCreateChatTitle = false;
   
      if (receiveMessage.chat_id) {
        chat_id = typeof receiveMessage.chat_id === "string" ? Number(receiveMessage.chat_id) : receiveMessage.chat_id;
        const currChat = await db.chat.findFirst({
          where : {
            id : chat_id
          },
          select : {
            id : true,
            title : true,
          }
        });
        isCreateChatTitle = currChat?.title === null;
      } else {
        try {
           chat = await ChatServices.createChat({
           created_by: user_id,
          });
          chat_id = chat.id;
          // inform client that chat is created
          socket.emit("chat:creating", { chat_id : chat_id });
        } catch (error) {
           console.log("Error creating chat:" + error);
        }
      }

      if(!chat_id) return;
      let messageData = {
        content: receiveMessage.content,
        chat_id: chat_id,
        sender_id: user_id,
        type: "user",
      };

      const newMessage  = await db.message.create({
        data: messageData,
        select : {id : true}
      });

      const newMessageData =  await ChatServices.getMessageByID(newMessage.id);

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
         const {title : chatTitle} = await streamAndSaveAIReply({
           io: this.io,
           chatId: Number(messageData.chat_id),
           prompt: receiveMessage.content, // as user message
           tempId,
           isCreateChatTitle : chat !== null || isCreateChatTitle,
           model : receiveMessage.ai_model
         })
         if(chat){
          socket.emit("chat:created", {...chat, title : chatTitle });
        }
        if(isCreateChatTitle){
          socket.emit("chat:updated", { chat_id, title : chatTitle });
        }
       } catch (error) {
         if(chat){
          socket.emit("chat:created",chat);
        }
         console.log("Error streaming AI reply:" + error);
       }

    
    } catch (error) {
      console.log("Error sending message to chat " + chat_id + ":" + error);
      socket.emit("message:error", {
        chatId: chat_id,
        error: "Error sending message to chat "+ error,
      });
    }
  }

 
}

export default SocketService;
