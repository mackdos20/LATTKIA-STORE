import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TelegramBotState = {
  botToken: string;
  chatId: string;
  loading: boolean;
  error: string | null;
  setBotToken: (token: string) => void;
  setChatId: (chatId: string) => void;
  sendMessage: (message: string) => Promise<void>;
};

export const useTelegramBotStore = create<TelegramBotState>()(
  persist(
    (set) => ({
      botToken: '',
      chatId: '',
      loading: false,
      error: null,
      setBotToken: (token) => set({ botToken: token }),
      setChatId: (chatId) => set({ chatId: chatId }),
      sendMessage: async (message) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/telegram/send-message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Failed to send message');
          }
          set({ loading: false });
        } catch (error) {
          set({ error: 'Failed to send message', loading: false });
        }
      },
    }),
    {
      name: 'telegram-bot-storage',
    }
  )
); 