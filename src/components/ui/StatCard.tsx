import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  children?: ReactNode;
}

export default function StatCard({ label, value, subtext, children }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-border transition-colors">
      {children ? (
        children
      ) : (
        <>
          <p className="text-gray-600 dark:text-dark-muted text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-dark-primary">{value}</p>
          {subtext && <p className="text-xs text-gray-600 dark:text-dark-muted mt-2">{subtext}</p>}
        </>
      )}
    </div>
  );
}
