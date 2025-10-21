import { SERVER_URL } from "@/config";
import Axios, { AxiosError } from "axios";

export const baseUrl = SERVER_URL + "/api";

export const API_URL = {
  // auth
  login: "/login",
  register: "/register",
  logout: "/logout",

  // user update
  getUser: "/user",
  getAllUsers: "/user/get-all",

  // chat
  createChat: "/chat",
  getAllChats: "/chat",
  chatInvite: "/chat/:chat_id/invite",

  // Message
  getMessages : '/chat/:chat_id/messages',
};

const axios = Axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

// axios.interceptors.request.use((req) => {
//   const token = "";

//   req.headers.token = token;
//   return req;
// });

export type API_RES<T> = Promise<{
  s: number;
  m: string;
  r: T extends undefined ? unknown : T;
  c?: number;
}>;

export const API_POST = async function ({
  url,
  data,
  params,
}: {
  url: string;
  data?: Record<string, unknown> | FormData;
  params?: Record<string, unknown>;
}) {
  try {
    const res = await axios.post(url, data, { params });

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError)
      return {
        s: error.response?.data.s,
        m: error.response?.data.m,
      };
  }
};

interface CustomHeaders {
  [key: string]: string;
}

export const API_GET = async function ({
  url,
  headers,
  params,
}: {
  url: string;
  params?: Record<string, unknown>;
  headers?: CustomHeaders;
}) {
  try {
    const { data } = await axios.get(url, {
      params,
      headers: {
        ...headers,
      },
    });

    return data;
  } catch (error) {
    if (error instanceof AxiosError)
      return {
        s: error.response?.data.s,
        m: error.response?.data.m,
      };
  }
};

export const API_DELETE = async function ({
  url,
  body,
}: {
  url: string;
  body: Record<string, unknown>;
}) {
  try {
    const { data } = await axios.delete(url, { data: body });

    return data;
  } catch (error) {
    if (error instanceof AxiosError)
      return {
        s: error.response?.data.s,
        m: error.response?.data.m,
      };
  }
};
