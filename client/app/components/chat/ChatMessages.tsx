import { getChatMessages } from "@/api/chat";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useSocket from "@/hooks/useSocket";
import { useUser } from "@/hooks/useUser";
import { formatDate, formatTime } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MaxWidth from "../common/max-width";
import { Shimmer } from "../ai-elements/shimmer";
import { Response as ResponseComponent } from "@/components/ai-elements/response";

type StreamingMessage = {
  tempId: string;
  content: string;
  chatId: string | number;
  isLoading: boolean;
  error?: string;
};

export default function ChatMessages({ chat_id }: { chat_id: string | null }) {
  const { user } = useUser();
  const socket = useSocket();
  const client = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [streamingMessages, setStreamingMessages] = useState<
    StreamingMessage[]
  >([]);

  const { data: messages = [] } = useQuery({
    queryKey: ["chat-messages", chat_id],
    queryFn: () => getChatMessages({ chat_id: Number(chat_id || 0) }),
    select: (response) => response.r || [],
    enabled: Boolean(chat_id),
    refetchOnWindowFocus: false,
  });

  // Scroll to bottom when messages change or streaming updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, streamingMessages.length]);

  const handleNewMessage = (data: Message) => {
    if (data) {
      client.setQueryData(["chat-messages", chat_id], (set: any) => {
        const isExist = set.r.find((item: any) => item.id === data.id);

        if (isExist) {
          return set;
        }

        return {
          ...set,
          r: [...set.r, data],
        };
      });
    }
  };

  // Handle AI streaming events
  useEffect(() => {
    if (!socket) return;

    // AI started generating
    socket.on("ai:started", ({ tempId, chatId }) => {
      setStreamingMessages((prev) => [
        ...prev,
        {
          tempId,
          chatId,
          content: "",
          isLoading: true,
        },
      ]);
    });

    // AI chunk received
    socket.on("ai:chunk", ({ tempId, chunk }) => {
      setStreamingMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === tempId
            ? { ...msg, content: msg.content + chunk, isLoading: false }
            : msg
        )
      );
    });

    // AI response completed
    socket.on("ai:done", ({ tempId, finalMessage }) => {
      handleNewMessage(finalMessage);
      setStreamingMessages((prev) =>
        prev.filter((msg) => msg.tempId !== tempId)
      );
    });

    // AI error occurred
    socket.on("ai:error", ({ tempId, error }) => {
      setStreamingMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === tempId ? { ...msg, isLoading: false, error } : msg
        )
      );

      // Remove error message after 10 seconds
      setTimeout(() => {
        setStreamingMessages((prev) =>
          prev.filter((msg) => msg.tempId !== tempId)
        );
      }, 10000);
    });

    // Regular message handling
    socket.on("message:received", handleNewMessage);

    return () => {
      socket.off("ai:started");
      socket.off("ai:chunk");
      socket.off("ai:done");
      socket.off("ai:error");
      socket.off("message:received");
    };
  }, [socket, chat_id]);

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};
  messages.forEach((message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return (
    <MaxWidth className="flex flex-col h-full">
      {/* Empty State */}
      {messages.length === 0 && streamingMessages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Send className="h-8 w-8 text-primary" />
          </div>

          <h3 className="text-2xl font-semibold mb-2">
            Start a New Conversation
          </h3>
          <ul className="text-sm text-muted-foreground list-disc list-inside mb-6">
            <li>Ask a question to get instant answers</li>
            <li>Get help with a topic you're exploring</li>
            <li>Start a casual conversation or brainstorm ideas</li>
          </ul>
        </div>
      )}
      {/* Messages */}
      {(messages.length > 0 || streamingMessages.length > 0) && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              <div className="flex justify-center">
                <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                  {formatDate(dateMessages[0].createdAt)}
                </div>
              </div>

              {dateMessages.map((msg, index) => {
                const isOwn = msg.sender.id === user?.id;
                const showAvatar =
                  !isOwn &&
                  (index === 0 ||
                    dateMessages[index - 1]?.sender.id !== msg.sender.id);

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex ${isOwn ? "flex-row-reverse" : "flex-row"} max-w-[80%] items-end gap-2`}
                    >
                      {/* this for show avatar */}
                      {!isOwn && (
                        <div className="flex-shrink-0 w-8">
                          {showAvatar ? (
                            <Avatar className="h-8 w-8">
                              <div className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center text-xs font-medium">
                                {msg.type === "ai" ? (
                                  <AvatarImage src="/ai-logo.png" />
                                ) : (
                                  msg.sender.username.charAt(0).toUpperCase()
                                )}
                              </div>
                            </Avatar>
                          ) : (
                            <div className="w-8" />
                          )}
                        </div>
                      )}

                      {/* Message Content */}
                      <div
                        className={`
                        rounded-2xl px-4 py-2 
                        ${isOwn ? "rounded-br-sm" : "rounded-bl-sm"}
                        ${msg.type !== "ai" && "bg-muted"}
                      `}
                      >
                        <div>
                          {msg.type === "ai" ? (
                            <MaxWidth className="max-w-5xl!">
                              <ResponseComponent key={`${msg.id}`}>
                                {msg.content}
                              </ResponseComponent>
                            </MaxWidth>
                          ) : (
                            msg.content
                          )}
                        </div>
                        {msg.type !== "ai" && !isOwn && (
                          <div
                            className={`capitalize text-xs mt-1 flex justify-end items-center gap-1 
                          ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}
                        `}
                          >
                            Send By {msg.sender.username}
                            <span>{formatTime(msg.createdAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Streaming Messages */}
          {streamingMessages.map((msg) => (
            <div key={msg.tempId} className="flex justify-start">
              <div className="flex flex-row max-w-[80%] items-end gap-2">
                <div className="flex-shrink-0 w-8">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/ai-logo.png" />
                  </Avatar>
                </div>

                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2">
                  <div className="whitespace-pre-wrap break-words">
                    {msg.error ? (
                      <span className="text-destructive">
                        Error: {msg.error}
                      </span>
                    ) : (
                      <>
                        <ResponseComponent key={`${msg.tempId}`}>
                          {msg.content}
                        </ResponseComponent>

                        {msg.isLoading && (
                          <div className="flex items-center gap-2 mt-2">
                            <Shimmer>Generating your response...</Shimmer>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      )}
    </MaxWidth>
  );
}
