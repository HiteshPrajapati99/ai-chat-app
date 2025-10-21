import { getChatList } from "@/api/chat";
import { logout } from "@/api/common";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useSocket from "@/hooks/useSocket";
import { useUser } from "@/hooks/useUser";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, MessageCircle, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Modal from "../common/Modal";

export default function ChatSidebar() {
  const { user, setUser } = useUser();
  const socket = useSocket();
  const client = useQueryClient();

  const [searchParams, setSearchParams] = useSearchParams();
  const [isLogOutModal, setIsLogOutModal] = useState(false);

  const activeChatId = searchParams.get("chat_id")
    ? Number(searchParams.get("chat_id"))
    : 0;

  const { data: chatList = [] } = useQuery({
    queryKey: ["chat-list"],
    queryFn: () => getChatList(),
    select: (response) => response.r || [],
  });

  const handleNewChatList = (data: Chat) => {
    if (data) {
      client.setQueryData(["chat-list"], (set: any) => {
        const isExist = set.r.find((item: any) => item.id === data.id);

        if (isExist) {
          return set;
        }

        return {
          ...set,
          r: [data, ...set.r],
        };
      });
    }
  };

  const handleJoinChat = (chat_id: number) => {
    if (socket) {
      socket.emit("join-chat", chat_id);
    }
  };

  const handleLeaveChat = (chat_id: number) => {
    if (socket) {
      socket.emit("leave-chat", chat_id);
    }
  };

  const handleUpdateChat = (data: { chat_id: number; title: string }) => {
    if (data) {
      client.setQueryData(["chat-list"], (set: any) => {
        return {
          ...set,
          r: set.r.map((item: any) =>
            item.id === data.chat_id ? { ...item, title: data.title } : item
          ),
        };
      });
    }
  };

  const handleInitChat = (data: { chat_id: number }) => {
    if (data.chat_id) {
      setSearchParams({ chat_id: data.chat_id.toString() });
      handleJoinChat(data.chat_id);
    }
  };

  const handleLogOut = async () => {
    await logout();
    setUser(null);
  };

  useEffect(() => {
    if (socket) {
      socket.on("chat:created", handleNewChatList);
      socket.on("chat:updated", handleUpdateChat);
      socket.on("chat:creating", handleInitChat);
    }

    if (activeChatId) {
      handleJoinChat(activeChatId);
    }

    return () => {
      if (socket) {
        socket.off("chat:created", handleNewChatList);
        socket.off("chat:updated", handleUpdateChat);
        socket.off("chat:creating", handleInitChat);
      }
      if (activeChatId) {
        handleLeaveChat(activeChatId);
      }
    };
  }, [socket, activeChatId]);

  return (
    <div className="flex flex-col h-full">
      {/* LOGO */}
      <div className="flex items-center gap-3 p-6">
        <div className="flex items-center gap-2 cursor-pointer">
          <MessageCircle className="h-6 w-6" />
          <h1 className="font-semibold">AI Chat</h1>
        </div>
      </div>

      <div className="my-2 px-2">
        <Button
          variant={"ghost"}
          className="w-full flex justify-start rounded-2xl"
          onClick={() => {
            handleLeaveChat(activeChatId);
            setSearchParams();
          }}
        >
          <SquarePen />
          Create New Chat
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chatList.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No chats found
          </div>
        ) : (
          <div className="px-2 space-y-1">
            {chatList.map((chat) => {
              const chatName = chat.title || "no title";
              return (
                <div
                  key={chat.id}
                  className={`p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-2xl ${
                    chat.id === activeChatId
                      ? "bg-gray-100 dark:bg-gray-800"
                      : ""
                  }`}
                  onClick={() => {
                    handleJoinChat(chat.id);
                    setSearchParams({ chat_id: chat.id.toString() });
                  }}
                >
                  <div className="flex items-center space-x-3 h-5 line-clamp-1">
                    <p className="font-medium truncate">{chatName}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="p-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
          <Avatar className="size-10">
            <div className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center font-medium">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate capitalize">
              {user?.username || "User"}
            </p>
          </div>
          <div>
            <Button variant={"outline"} onClick={() => setIsLogOutModal(true)}>
              <LogOut />
            </Button>
          </div>
        </div>
      </div>

      <Modal open={isLogOutModal} onClose={() => setIsLogOutModal(false)}>
        <div className="">
          <p className="text-xl font-semibold">
            Are you sure want to logout ?{" "}
          </p>

          <p className="opacity-50 mt-3">
            Logging out will end your current session. You can log back in
            anytime to access your account and data.
          </p>
        </div>
        <div className="flex justify-end gap-3 items-center pt-3">
          <Button
            onClick={() => setIsLogOutModal(false)}
            variant="secondary"
            className="px-10"
          >
            Cancel
          </Button>
          <Button onClick={handleLogOut} className="px-10">
            Logout
          </Button>
        </div>
      </Modal>
    </div>
  );
}
