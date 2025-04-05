import { create } from "zustand";
import { fine } from "@/lib/fine";
import type { User } from "@/lib/db-types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await fine.auth.signIn.email({
        email,
        password,
      });
      
      if (error) throw new Error(error.message);
      
      if (data?.user) {
        const user: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          image: data.user.image,
          createdAt: new Date(data.user.createdAt).toISOString(),
          updatedAt: new Date(data.user.updatedAt).toISOString(),
        };
        set({ user, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    try {
      await fine.auth.signOut();
      set({ user: null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const { data } = fine.auth.useSession();
      if (data?.user) {
        const user: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          image: data.user.image || null,
          createdAt: new Date(data.user.createdAt).toISOString(),
          updatedAt: new Date(data.user.updatedAt).toISOString(),
        };
        set({ user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error: any) {
      set({ user: null, error: error.message, isLoading: false });
    }
  },
}));