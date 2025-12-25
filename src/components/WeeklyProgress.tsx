import { TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function WeeklyProgress() {
  const weeklyData = [
    { week: 'Week 1', value: 45 },
    { week: 'Week 2', value: 58 },
    { week: 'Week 3', value: 52 },
    { week: 'Week 4', value: 73 },
  ];

  const data = {
    labels: weeklyData.map(d => d.week),
    datasets: [
      {
        label: 'Problems solved',
        data: weeklyData.map(d => d.value),
        fill: true,
        borderColor: 'rgba(59,130,246,1)',
        backgroundColor: 'rgba(59,130,246,0.15)',
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: '#fff',
        pointBorderColor: 'rgba(59,130,246,1)',
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
        ticks: { color: '#6b7280' },
      },
      y: {
        grid: { color: 'rgba(107,114,128,0.15)' },
        ticks: { color: '#6b7280', precision: 0 },
        beginAtZero: true,
      },
    },
  } as const;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors hover:shadow-lg duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">DSA Progress</h3>

      <div className="flex flex-col gap-6">
        <div className="h-36">
          <Line data={data} options={options} />
        </div>

        <div className="grid grid-cols-4 gap-4 text-center">
          {weeklyData.map((item, index) => (
            <div key={index}>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{item.week}</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-500">
            <TrendingUp size={18} />
            <span className="text-sm font-semibold">+28% this month</span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">290 problems solved</span>
        </div>
      </div>
    </div>
  );
}
