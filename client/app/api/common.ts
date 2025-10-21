import { API_GET, API_POST, API_URL,  type API_RES } from "./config";

type UserAuth = {
  username: string;
  password: string;
};

export const register = (data: UserAuth): API_RES<{ token: string }> => {
  return API_POST({ url: API_URL.register, data });
};

export const login = (data: UserAuth): API_RES<{ token: string }> => {
  return API_POST({ url: API_URL.login, data });
};

export const logout = () => {
  return API_POST({ url: API_URL.logout });
};

export const getUser = (): API_RES<User> => {
  return API_GET({ url: API_URL.getUser });
};

export const getUsers = (): API_RES<User[]> => {
  return API_GET({ url: API_URL.getAllUsers });
};
