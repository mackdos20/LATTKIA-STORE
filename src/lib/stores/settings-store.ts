import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SettingsState = {
  settings: {
    currency: string;
    timezone: string;
    dateFormat: string;
    notifications: {
      email: boolean;
      sms: boolean;
      telegram: boolean;
    };
  };
  loading: boolean;
  error: string | null;
  updateSettings: (settings: Partial<SettingsState['settings']>) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        currency: 'USD',
        timezone: 'UTC',
        dateFormat: 'YYYY-MM-DD',
        notifications: {
          email: true,
          sms: false,
          telegram: false,
        },
      },
      loading: false,
      error: null,
      updateSettings: (settings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...settings,
          },
        }));
      },
    }),
    {
      name: 'settings-storage',
    }
  )
); 