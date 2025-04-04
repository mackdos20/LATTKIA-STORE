import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ProfitDashboardState = {
  timeRange: 'day' | 'week' | 'month' | 'year';
  loading: boolean;
  error: string | null;
  totalSales: number;
  totalProfit: number;
  averageMargin: number;
  topProducts: Array<{
    id: string;
    name: string;
    profit: number;
  }>;
  categoryProfits: Array<{
    id: string;
    name: string;
    profit: number;
  }>;
  setTimeRange: (range: 'day' | 'week' | 'month' | 'year') => void;
  fetchData: () => Promise<void>;
};

export const useProfitDashboardStore = create<ProfitDashboardState>()(
  persist(
    (set) => ({
      timeRange: 'month',
      loading: false,
      error: null,
      totalSales: 0,
      totalProfit: 0,
      averageMargin: 0,
      topProducts: [],
      categoryProfits: [],
      setTimeRange: (range) => set({ timeRange: range }),
      fetchData: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/profit-dashboard');
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch data');
          }
          set({
            totalSales: data.totalSales,
            totalProfit: data.totalProfit,
            averageMargin: data.averageMargin,
            topProducts: data.topProducts,
            categoryProfits: data.categoryProfits,
            loading: false,
          });
        } catch (error) {
          set({ error: 'Failed to fetch data', loading: false });
        }
      },
    }),
    {
      name: 'profit-dashboard-storage',
    }
  )
); 