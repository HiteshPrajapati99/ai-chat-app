import { API_GET, API_POST, API_URL, type API_RES } from "./config";

export const createChat =  (data: { title?: string, user_ids?: number[] }): API_RES<Chat> => {
  return API_POST({ url: API_URL.createChat, data });
};


export const getChatList = (): API_RES<Chat[]> => {
  return API_GET({ url: API_URL.getAllChats });
};

export const inviteForChat = ({ chat_id, user_ids }: { chat_id: number, user_ids: number[] }): API_RES<Chat> => {
  const URL = API_URL.chatInvite.replace(":chat_id", chat_id.toString());
  return API_POST({ url: URL, data: { user_ids } });
};

export const getChatMessages = ({ chat_id }: { chat_id: number }): API_RES<Message[]> => {
  return API_GET({ url: API_URL.getMessages, params: { chat_id } });
};