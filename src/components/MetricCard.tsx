import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  iconBgColor: string;
  iconColor: string;
  primary?: boolean;
}

export default function MetricCard({ icon: Icon, value, label, iconBgColor, iconColor, primary = false }: MetricCardProps) {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent dark:from-gray-700/30 rounded-xl opacity-50 -z-0"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${iconBgColor} group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={24} className={iconColor} strokeWidth={2} />
          </div>
          {primary && (
            <span className="px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full">
              Primary
            </span>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</p>
        </div>
        
        {/* Trend indicator */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex items-center text-xs font-medium text-green-600 dark:text-green-400">
            <span>↑ 12%</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-500">vs last week</span>
        </div>
      </div>
    </div>
  );
}
