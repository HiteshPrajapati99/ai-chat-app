type ModalProps = {
  open: boolean;
  onClose: () => void;
};

interface User {
  id: number;
  username: string;
  created_at: Date;
  updated_at: Date;
}
interface Chat {
  id: number;
  title: string | null;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  users: ChatUser[];
  last_message?: {
    id: number;
    content: string;
  };
}

interface ChatUser {
  id: number;
  chat_id: number;
  user_id: number;
  role: "admin" | "member";
  joined_at: Date;
  user: {
    id: number;
    username: string;
  };
}

interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  type: "user" | "ai";
  createdAt: Date;
  sender: {
    id: number;
    username: string;
  };
}
