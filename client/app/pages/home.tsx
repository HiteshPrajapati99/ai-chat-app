import { useSearchParams } from "react-router";
import {
  PromptInput,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputFooter,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSpeechButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import NavBar from "@/components/chat/ChatNav";
import MaxWidth from "@/components/common/max-width";
import useSocket from "@/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import ChatMessages from "../components/chat/ChatMessages";
import { cn } from "@/lib/utils";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { toast } from "sonner";

const AI_MODELS = [
  {
    value: "gpt-4o",
    label: "GPT-4o",
  },
  {
    value: "gemini-2.5-pro",
    label: "Gemini 2.5 Pro",
  },
];

export default function ChatsHome() {
  const [inputMessage, setInputMessage] = useState("");
  const [aiModel, setAiModel] = useState<string>("gemini-2.5-pro");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [searchParams] = useSearchParams();
  const chat_id = searchParams.get("chat_id") || null;
  const socket = useSocket();

  const handleSendMessage = (data: PromptInputMessage) => {
    if (inputMessage.trim() === "") return;
    const messageData: Record<string, any> = {
      content: data.text,
      ai_model: aiModel,
    };
    if (chat_id) messageData.chat_id = chat_id;

    socket?.emit("message:sent", messageData);
    setInputMessage("");
  };

  useEffect(() => {
    if (socket) {
      socket.on("message:error", (data) => {
        console.log("message:error", data);
        toast.error(data.error || "Error sending message plz try again");
      });
    }
  }, [socket]);

  return (
    <div className="flex flex-col h-screen">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-10">
        <NavBar chat_id={chat_id} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden px-4">
        {/* Scrollable Chat Messages */}
        {chat_id && (
          <div className="flex-1 overflow-y-auto">
            <ChatMessages chat_id={chat_id} />
          </div>
        )}

        {/* Sticky Chat Input */}
        <div
          className={cn({
            "flex justify-center items-center w-full h-full flex-col": !chat_id,
          })}
        >
          {/* Showing for new chat */}
          {!chat_id && (
            <div className="w-full flex justify-center py-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700">
                <svg
                  className="w-5 h-5 text-blue-500 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8 10h.01M12 14h.01M16 10h.01M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z"
                  />
                </svg>

                <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
                  <Shimmer>What’s on your mind?</Shimmer>
                </h2>
              </div>
            </div>
          )}
          <div className="sticky bottom-0 z-10 p-4 w-full">
            <MaxWidth>
              <PromptInput
                onSubmit={handleSendMessage}
                className="mt-4 relative"
              >
                <PromptInputBody>
                  <PromptInputAttachments>
                    {(attachment) => (
                      <PromptInputAttachment data={attachment} />
                    )}
                  </PromptInputAttachments>
                  <PromptInputTextarea
                    ref={textareaRef}
                    onChange={(e) => {
                      setInputMessage(e.target.value);
                    }}
                    value={inputMessage}
                  />
                </PromptInputBody>
                <PromptInputFooter>
                  <PromptInputTools>
                    <PromptInputSpeechButton
                      textareaRef={textareaRef}
                      onTranscriptionChange={setInputMessage}
                    />

                    <PromptInputModelSelect
                      onValueChange={(value) => {
                        setAiModel(value);
                      }}
                      value={aiModel}
                    >
                      <PromptInputModelSelectTrigger>
                        <PromptInputModelSelectValue />
                      </PromptInputModelSelectTrigger>
                      <PromptInputModelSelectContent>
                        {AI_MODELS.map((model) => (
                          <PromptInputModelSelectItem
                            key={model.value}
                            value={model.value}
                          >
                            {model.label}
                          </PromptInputModelSelectItem>
                        ))}
                      </PromptInputModelSelectContent>
                    </PromptInputModelSelect>
                  </PromptInputTools>
                  <PromptInputSubmit disabled={false} status={"ready"} />
                </PromptInputFooter>
              </PromptInput>
            </MaxWidth>
          </div>
        </div>
      </div>
    </div>
  );
}
