import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: Array<{
    date: string;
    profit: number;
  }>;
  options?: ChartOptions<'line'>;
}

export const LineChart = ({ data, options }: LineChartProps) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'الربح',
        data: data.map(item => item.profit),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const defaultOptions: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value} ريال`
        }
      }
    }
  };

  return <Line data={chartData} options={{ ...defaultOptions, ...options }} />;
}; 