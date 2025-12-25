import { ChevronDown } from 'lucide-react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type ChartPoint = { day: string; value: number };

type ChartCardProps = {
  title?: string;
  subtitle?: string;
  points?: ChartPoint[];
  totalLabel?: string;
};

export default function ChartCard({
  title = 'Weekly Activity',
  subtitle = 'Problems solved over time',
  points = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 78 },
    { day: 'Wed', value: 45 },
    { day: 'Thu', value: 88 },
    { day: 'Fri', value: 92 },
    { day: 'Sat', value: 58 },
    { day: 'Sun', value: 72 },
  ],
  totalLabel = 'Total: 498 problems',
}: ChartCardProps) {

  const chartData = {
    labels: points.map(d => d.day),
    datasets: [
      {
        label: 'Problems',
        data: points.map(d => d.value),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 12,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(5, 150, 105, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.parsed.y} problems`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#6b7280',
        },
      },
      y: {
        grid: { color: 'rgba(107,114,128,0.15)' },
        ticks: {
          color: '#6b7280',
          precision: 0,
        },
      },
    },
  } as const;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
            7D
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all">
            30D
          </button>
        </div>
      </div>

      <div className="h-72">
        <Bar data={chartData} options={options} />
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Completed</span>
          </div>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">{totalLabel}</span>
      </div>
    </div>
  );
}
