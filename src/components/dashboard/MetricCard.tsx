import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  iconBgColor: string;
  iconColor: string;
  primary?: boolean;
  trend?: { value: string; direction: 'up' | 'down' | 'neutral' };
}

export default function MetricCard({ icon: Icon, value, label, iconBgColor, iconColor, primary = false, trend }: MetricCardProps) {
  return (
    <div className="relative bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-dark-accent transition-all duration-300 group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent dark:from-dark-input/30 rounded-xl opacity-50 -z-0"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${iconBgColor} group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={24} className={iconColor} strokeWidth={2} />
          </div>
          {primary && (
            <span className="px-2 py-1 text-xs font-semibold text-gray-700 dark:text-dark-secondary bg-gray-100 dark:bg-dark-input rounded-full">
              Primary
            </span>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600 dark:text-dark-muted">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-dark-primary tracking-tight">{value}</p>
        </div>
        
        {/* Trend indicator */}
        <div className="mt-4 flex items-center gap-2">
          {trend ? (
            <>
              <div className={`flex items-center text-xs font-medium ${
                trend.direction === 'up' ? 'text-green-600 dark:text-green-400' :
                trend.direction === 'down' ? 'text-red-500 dark:text-red-400' :
                'text-gray-500 dark:text-dark-muted'
              }`}>
                <span>{trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '—'} {trend.value}</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-dark-muted">vs last week</span>
            </>
          ) : (
            <span className="text-xs text-gray-400 dark:text-dark-border">No trend data</span>
          )}
        </div>
      </div>
    </div>
  );
}
