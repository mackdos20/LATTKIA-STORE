import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ChartState = {
  loading: boolean;
  error: string | null;
  profitTrend: Array<{
    date: string;
    profit: number;
  }>;
  categoryDistribution: Array<{
    name: string;
    value: number;
  }>;
  fetchProfitTrend: () => Promise<void>;
  fetchCategoryDistribution: () => Promise<void>;
};

export const useChartStore = create<ChartState>()(
  persist(
    (set) => ({
      loading: false,
      error: null,
      profitTrend: [],
      categoryDistribution: [],
      fetchProfitTrend: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/charts/profit-trend');
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch profit trend');
          }
          set({ profitTrend: data, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch profit trend', loading: false });
        }
      },
      fetchCategoryDistribution: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/charts/category-distribution');
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch category distribution');
          }
          set({ categoryDistribution: data, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch category distribution', loading: false });
        }
      },
    }),
    {
      name: 'chart-storage',
    }
  )
); 