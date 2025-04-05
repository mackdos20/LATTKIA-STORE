import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fine } from "@/lib/fine";
import type { User } from "@/lib/db-types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      login: async (email: string, password: string) => {
        try {
          const { data, error } = await fine.auth.signIn.email({
            email,
            password,
          });
          
          if (error) throw new Error(error.message);
          
          if (data?.user) {
            set({
              user: data.user,
              token: data.session.token,
              isAuthenticated: true,
              isAdmin: data.user.email.endsWith("@admin.com"), // Simple admin check
            });
          }
        } catch (error) {
          console.error("Login error:", error);
          throw error;
        }
      },
      logout: async () => {
        try {
          await fine.auth.signOut();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({ user: null, token: null, isAuthenticated: false, isAdmin: false });
        }
      },
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          isAdmin: user?.email.endsWith("@admin.com") || false,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

// Export the User type
export type { User };