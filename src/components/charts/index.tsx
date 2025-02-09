import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const defaultOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
};

interface ChartProps {
  data: {
    labels: string[];
    datasets: any[];
  };
  options?: any;
}

export function LineChart({ data, options = {} }: ChartProps) {
  return <Line options={{ ...defaultOptions, ...options }} data={data} />;
}

export function DoughnutChart({ data, options = {} }: ChartProps) {
  return <Doughnut options={{ ...defaultOptions, ...options }} data={data} />;
}

export function BarChart({ data, options = {} }: ChartProps) {
  return <Bar options={{ ...defaultOptions, ...options }} data={data} />;
}