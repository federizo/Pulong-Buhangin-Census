import { User } from "@supabase/supabase-js";
import { create } from "zustand";

interface UserState {
  user: User | null;
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
}));

export function getCookie(name: string) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null; // Return null if the cookie is not found
}
