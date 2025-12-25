type ProgressCircleProps = {
  percentage?: number;
  activeSummary?: string;
  monthDelta?: string;
  title?: string;
};

export default function ProgressCircle({
  percentage = 73,
  activeSummary = '8 / 11',
  monthDelta = '+12%',
  title = 'Goals Completion',
}: ProgressCircleProps) {
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors hover:shadow-lg duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{title}</h3>

      <div className="flex flex-col items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="70"
              className="stroke-gray-100 dark:stroke-gray-700 transition-colors"
              strokeWidth="16"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="url(#gradient)"
              strokeWidth="16"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'all 1s ease' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{percentage}%</span>
            <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">Complete</span>
          </div>
        </div>

        <div className="mt-6 w-full">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Active Goals</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{activeSummary}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
            <span className="text-sm font-semibold text-green-500">{monthDelta}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
