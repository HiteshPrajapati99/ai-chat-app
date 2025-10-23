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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamAndSaveAIReply = streamAndSaveAIReply;
const ai_1 = require("ai");
const openai_1 = require("@ai-sdk/openai");
const google_1 = require("@ai-sdk/google");
const prisma_service_1 = require("./prisma-service");
const getAIUser_1 = require("../helpers/getAIUser");
const services_1 = __importDefault(require("../modules/chat/services"));
/**
 * Stream an AI response using and emit chunks to the socket.io room.
 * After the stream finishes, save the final message to DB and emit 'ai:done'.
 */
function streamAndSaveAIReply(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c, _d, e_2, _e, _f;
        const { io, chatId, prompt, tempId } = opts;
        const model = opts.model === "gpt-4o" ? "gpt-4o" : "gemini-2.5-pro";
        const aiUser = yield (0, getAIUser_1.getAIUser)();
        try {
            let modelInstance = null;
            if (model === "gpt-4o") {
                modelInstance = (0, openai_1.openai)(model);
            }
            else {
                modelInstance = (0, google_1.google)(model);
            }
            // generate title for chat based on first user message
            let chatTitle = "";
            if (opts.isCreateChatTitle) {
                const titlePrompt = `Generate a short title for this chat based on the user message: "${prompt}" 
       Make sure the title is no more than 50 characters long.
      `;
                const titleStream = (0, ai_1.streamText)({
                    model: modelInstance,
                    prompt: titlePrompt,
                });
                try {
                    for (var _g = true, _h = __asyncValues(titleStream.textStream), _j; _j = yield _h.next(), _a = _j.done, !_a; _g = true) {
                        _c = _j.value;
                        _g = false;
                        const chunk = _c;
                        chatTitle += chunk;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_g && !_a && (_b = _h.return)) yield _b.call(_h);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (chatTitle.trim().length > 0) {
                    yield prisma_service_1.db.chat.update({
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
            const { textStream } = (0, ai_1.streamText)({
                model: modelInstance,
                prompt,
            });
            let finalText = "";
            try {
                // For each chunk, forward to clients in the chat room
                for (var _k = true, textStream_1 = __asyncValues(textStream), textStream_1_1; textStream_1_1 = yield textStream_1.next(), _d = textStream_1_1.done, !_d; _k = true) {
                    _f = textStream_1_1.value;
                    _k = false;
                    const chunk = _f;
                    // chunk is a string part of the response
                    finalText += chunk;
                    // emit incremental token/chunk to clients
                    io.to(String(chatId)).emit("ai:chunk", {
                        chatId,
                        chunk,
                        tempId,
                    });
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_k && !_d && (_e = textStream_1.return)) yield _e.call(textStream_1);
                }
                finally { if (e_2) throw e_2.error; }
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
            const saved = yield prisma_service_1.db.message.create({
                data: messageData,
                select: {
                    id: true,
                },
            });
            const newMessageData = yield services_1.default.getMessageByID(saved.id);
            // you may want to enrich with sender info (username) before emitting;
            // for minimal approach, emit saved DB row as final message
            io.to(String(chatId)).emit("ai:done", {
                chatId,
                finalMessage: newMessageData,
                tempId,
            });
            return { data: newMessageData, title: chatTitle };
        }
        catch (err) {
            console.error("AI stream error:", err);
            // Notify clients stream errored (optional)
            io.to(String(chatId)).emit("ai:error", {
                chatId,
                error: "Error while streaming AI response.",
                tempId,
            });
            throw err;
        }
    });
}
