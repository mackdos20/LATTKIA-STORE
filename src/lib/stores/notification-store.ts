import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type NotificationState = {
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    timestamp: string;
  }>;
  loading: boolean;
  error: string | null;
  addNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      loading: false,
      error: null,
      addNotification: (message, type) => {
        const notification = {
          id: Date.now().toString(),
          message,
          type,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          notifications: [...state.notifications, notification],
        }));
      },
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },
      clearNotifications: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: 'notification-storage',
    }
  )
);
 