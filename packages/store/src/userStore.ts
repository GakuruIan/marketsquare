import { create } from "zustand";

type AccountStatus =
  | "PENDING_VERIFICATION"
  | "ACTIVE"
  | "SUSPENDED"
  | "DEACTIVATED";

export type User = {
  id: string;
  email: string;
  username: string;
  verified: boolean;
  status: AccountStatus;
};

type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  updateUser: (data: Partial<User>) => void;
};


export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
  clearUser: () => set({ user: null }),
  updateUser: (data: Partial<User>) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),
}));
