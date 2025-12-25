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

export default function ChartCard() {
  const data = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 78 },
    { day: 'Wed', value: 45 },
    { day: 'Thu', value: 88 },
    { day: 'Fri', value: 92 },
    { day: 'Sat', value: 58 },
    { day: 'Sun', value: 72 },
  ];

  const chartData = {
    labels: data.map(d => d.day),
    datasets: [
      {
        label: 'Problems',
        data: data.map(d => d.value),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderRadius: 10,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(59, 130, 246, 0.9)',
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
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors hover:shadow-lg duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Activity</h3>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 border-none transition-colors">
          Last 7 days
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
