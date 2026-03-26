import { Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Difficulty } from '@/types';

type ActivityItem = {
  id: string;
  title: string;
  difficulty: Difficulty;
  date: string;
  created_at?: string;
};

type RecentActivityProps = {
  items: ActivityItem[];
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  const diffWeek = Math.floor(diffDay / 7);
  return `${diffWeek}w ago`;
}

const DIFF_BADGE: Record<Difficulty, string> = {
  Easy: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  Medium: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  Hard: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

export default function RecentActivity({ items }: RecentActivityProps) {
  const navigate = useNavigate();
  const display = items.slice(0, 5);
  const hasMore = items.length > 5;

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-dark-accent transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-primary mb-6">Recent Activity</h3>

      {display.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-sm text-gray-500 dark:text-dark-muted">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {display.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 py-2 border-b border-gray-50 dark:border-dark-border last:border-0"
            >
              <div className="mt-0.5 p-1.5 rounded-lg bg-gray-100 dark:bg-dark-input shrink-0">
                <Code2 size={14} className="text-gray-600 dark:text-dark-muted" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-900 dark:text-dark-primary truncate">
                    {item.title}
                  </span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${DIFF_BADGE[item.difficulty]}`}>
                    {item.difficulty}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-dark-muted">
                  {timeAgo(item.created_at ?? item.date)}
                </span>
              </div>
            </div>
          ))}

          {hasMore && (
            <button
              onClick={() => navigate('/dsa')}
              className="w-full text-sm font-medium text-gray-700 dark:text-dark-secondary hover:text-gray-900 dark:hover:text-dark-primary bg-transparent border-none cursor-pointer pt-2 transition-colors"
            >
              Read more
            </button>
          )}
        </div>
      )}
    </div>
  );
}
