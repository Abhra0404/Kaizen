import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

type DifficultyBreakdownProps = {
  easy: number;
  medium: number;
  hard: number;
};

export default function DifficultyBreakdown({ easy, medium, hard }: DifficultyBreakdownProps) {
  const total = easy + medium + hard;
  const isDark = document.documentElement.classList.contains('dark');

  const data = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        data: [easy, medium, hard],
        backgroundColor: [
          'rgba(34, 197, 94, 0.85)',
          'rgba(245, 158, 11, 0.85)',
          'rgba(239, 68, 68, 0.85)',
        ],
        borderWidth: 0,
        hoverBorderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { label: string; parsed: number }) => {
            const pct = total > 0 ? Math.round((ctx.parsed / total) * 100) : 0;
            return `${ctx.label}: ${ctx.parsed} (${pct}%)`;
          },
        },
      },
    },
  } as const;

  const breakdown = [
    { label: 'Easy', count: easy, color: 'bg-green-500' },
    { label: 'Medium', count: medium, color: 'bg-amber-500' },
    { label: 'Hard', count: hard, color: 'bg-red-500' },
  ];

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-dark-accent transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-primary mb-6">Difficulty Breakdown</h3>

      {total === 0 ? (
        <div className="flex items-center justify-center h-52">
          <p className="text-sm text-gray-500 dark:text-dark-muted">Solve problems to see breakdown</p>
        </div>
      ) : (
        <>
          <div className="relative h-52 flex items-center justify-center">
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-gray-900 dark:text-dark-primary">{total}</span>
              <span className="text-xs text-gray-500 dark:text-dark-muted">Solved</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-2">
            {breakdown.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-xs text-gray-600 dark:text-dark-muted">
                  {item.label}
                  <span className="ml-1 font-semibold text-gray-900 dark:text-dark-primary">
                    {item.count}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
