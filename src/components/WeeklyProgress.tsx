import { TrendingUp } from 'lucide-react';

export default function WeeklyProgress() {
  const weeklyData = [
    { week: 'Week 1', value: 45 },
    { week: 'Week 2', value: 58 },
    { week: 'Week 3', value: 52 },
    { week: 'Week 4', value: 73 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors hover:shadow-lg duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">DSA Progress</h3>

      <div className="flex flex-col gap-6">
        <div style={{ position: 'relative', height: '128px' }}>
          <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 400 120">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            <path
              d="M 20 90 L 120 65 L 220 75 L 380 25"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {[20, 120, 220, 380].map((x, i) => (
              <circle
                key={i}
                cx={x}
                cy={[90, 65, 75, 25][i]}
                r="5"
                className="fill-white dark:fill-gray-800"
                stroke="url(#lineGradient)"
                strokeWidth="3"
              />
            ))}
          </svg>
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
