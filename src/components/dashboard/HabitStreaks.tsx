import { useNavigate } from 'react-router-dom';
import type { Frequency } from '@/types';

type HabitItem = {
  name: string;
  streak: number;
  frequency: Frequency;
};

type HabitStreaksProps = {
  habits: HabitItem[];
};

export default function HabitStreaks({ habits }: HabitStreaksProps) {
  const navigate = useNavigate();
  const sorted = [...habits].sort((a, b) => b.streak - a.streak);
  const maxStreak = sorted.length > 0 ? Math.max(...sorted.map(h => h.streak), 1) : 1;

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-dark-accent transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-primary">Habit Streaks</h3>
        <button
          onClick={() => navigate('/habits')}
          className="text-sm text-gray-700 dark:text-dark-secondary bg-transparent border-none cursor-pointer font-medium hover:text-gray-900 dark:hover:text-dark-primary transition-colors"
        >
          View All
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-sm text-gray-500 dark:text-dark-muted">Start tracking habits to see streaks</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((habit) => (
            <div key={habit.name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium text-gray-900 dark:text-dark-primary truncate">{habit.name}</span>
                  <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    habit.frequency === 'Daily'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                  }`}>
                    {habit.frequency}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-dark-primary shrink-0 ml-2">
                  {habit.streak}d
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-dark-input rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.max((habit.streak / maxStreak) * 100, 4)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
