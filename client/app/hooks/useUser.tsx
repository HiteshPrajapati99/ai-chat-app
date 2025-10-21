import { getUser } from "@/api/common";
import { LOCAL_USER } from "@/config/constant";
import { Storage } from "@/lib/storage";
import { create } from "zustand";

type Store = {
  user: User | null;
  getUserData: () => void;
  setUser: (user: User | null) => void;
};

export const useUser = create<Store>()((set) => ({
  user: null,
  getUserData: async () => {
    const user = await getUser();
    Storage.set(LOCAL_USER, JSON.stringify(user?.r || "{}"));

    set({ user: user.r || null });
  },
  setUser: (user) => {
    if (user === null) {
      Storage.remove(LOCAL_USER);
    }
    set({ user });
  },
}));
