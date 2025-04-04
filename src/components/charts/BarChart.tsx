import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: Array<{
    name: string;
    profit: number;
  }>;
  options?: ChartOptions<'bar'>;
}

export const BarChart = ({ data, options }: BarChartProps) => {
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        label: 'الربح',
        data: data.map(item => item.profit),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  };

  const defaultOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value} ريال`
        }
      }
    }
  };

  return <Bar data={chartData} options={{ ...defaultOptions, ...options }} />;
}; 