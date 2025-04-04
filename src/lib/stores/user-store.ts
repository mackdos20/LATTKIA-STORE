import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/db/models';

type UserState = {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      users: [],
      loading: false,
      error: null,
      fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/users');
          const data = await response.json();
          set({ users: data, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch users', loading: false });
        }
      },
    }),
    {
      name: 'user-storage',
    }
  )
); 