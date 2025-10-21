// src/services/ai-service.ts
import { Server as SocketServer } from "socket.io";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { db } from "./prisma-service";
import { getAIUser } from "../helpers/getAIUser";
import ChatServices from "../modules/chat/services";

type StreamAIOptions = {
  io: SocketServer;
  chatId: number;
  prompt: string;
  tempId: string; // client-side temp id to associate streaming chunks
  model?: string;
  isCreateChatTitle?: boolean;
};

/**
 * Stream an AI response using and emit chunks to the socket.io room.
 * After the stream finishes, save the final message to DB and emit 'ai:done'.
 */
export async function streamAndSaveAIReply(opts: StreamAIOptions) {
  const { io, chatId, prompt, tempId } = opts;

  const model = opts.model === "gpt-4o" ? "gpt-4o" : "gemini-2.5-pro";
  const aiUser = await getAIUser();
  try {

    let modelInstance = null

    if(model === "gpt-4o"){
      modelInstance = openai(model);
    } else {
      modelInstance = google(model);
    }


    // generate title for chat based on first user message
    let chatTitle : string | null = "";
    if(opts.isCreateChatTitle) {
      const titlePrompt = `Generate a short title for this chat based on the user message: "${prompt}" 
       Make sure the title is no more than 50 characters long.
      `;
      const titleStream = streamText({
        model: modelInstance,
        prompt: titlePrompt,
      });
      
      for await (const chunk of titleStream.textStream) {
        chatTitle += chunk;
      }
  
      if(chatTitle.trim().length > 0){
        await db.chat.update({
          where: {
            id: chatId,
          },
          data: {
            title: chatTitle,
          },
        });
      }
    }

    // create a readable async iterable of chunks using AI SDK helper
    const {textStream} = streamText({
      model: modelInstance,
      prompt,
    });

    let finalText = "";

    // For each chunk, forward to clients in the chat room
    for await (const chunk of textStream) {
      // chunk is a string part of the response
      finalText += chunk;

      // emit incremental token/chunk to clients
      io.to(String(chatId)).emit("ai:chunk", {
        chatId,
        chunk,
        tempId,
      });
    }

        // Check if the response is empty
    if (!finalText.trim()) {
      const errorMsg = "AI returned an empty response.";
      io.to(String(chatId)).emit("ai:error", {
        chatId,
        error: errorMsg,
        tempId,
      });
      throw new Error(errorMsg);
    }


    // Stream finished — persist final AI message to DB
    const messageData = {
      content: finalText,
      chat_id: chatId,
      sender_id: aiUser.id,
      type: "ai",
    };

    const saved = await db.message.create({
      data: messageData,
      select: {
        id: true,
      },
    });
    const newMessageData =  await ChatServices.getMessageByID(saved.id);

    // you may want to enrich with sender info (username) before emitting;
    // for minimal approach, emit saved DB row as final message
    io.to(String(chatId)).emit("ai:done", {
      chatId,
      finalMessage: newMessageData,
      tempId,
    });

    return {data: newMessageData, title : chatTitle};
  } catch (err) {
    console.error("AI stream error:", err);

    // Notify clients stream errored (optional)
    io.to(String(chatId)).emit("ai:error", {
      chatId,
      error: "Error while streaming AI response.",
      tempId,
    });
    throw err;
  }
}
