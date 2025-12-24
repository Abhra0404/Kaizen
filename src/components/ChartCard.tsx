import { ChevronDown } from 'lucide-react';

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

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors hover:shadow-lg duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Activity</h3>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 border-none transition-colors">
          Last 7 days
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="flex items-end justify-between gap-4 h-64">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-3">
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-lg relative h-full transition-colors">
              <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg absolute bottom-0" style={{ height: `${(item.value / maxValue) * 100}%` }}></div>
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
