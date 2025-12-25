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
    <div
      className={`${
        primary
          ? 'bg-white dark:bg-gray-800 rounded-2xl p-7 shadow-md border border-gray-100 dark:border-gray-700'
          : 'bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700'
      } hover:shadow-lg transition-all duration-300 group`}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
        iconBgColor.includes('blue') ? 'bg-blue-100 dark:bg-blue-900/40' : 
        iconBgColor.includes('green') ? 'bg-green-100 dark:bg-green-900/40' :
        iconBgColor.includes('orange') ? 'bg-orange-100 dark:bg-orange-900/40' : 'bg-teal-100 dark:bg-teal-900/40'
      }`}>
        <Icon size={24} color={iconColor.includes('blue') ? '#3b82f6' :
                               iconColor.includes('green') ? '#10b981' :
                               iconColor.includes('orange') ? '#f97316' : '#14b8a6'} />
      </div>
      <h3 className={`${primary ? 'text-4xl' : 'text-3xl'} font-bold text-gray-900 dark:text-white mb-1`}>{value}</h3>
      <p className={`${primary ? 'text-sm text-gray-600 dark:text-gray-400' : 'text-sm text-gray-600 dark:text-gray-400'}`}>{label}</p>
    </div>
  );
}
