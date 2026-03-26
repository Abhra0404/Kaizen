import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

type GoalItem = {
  id: string;
  title: string;
  progress: number;
  deadline: string;
  category: string;
  completed: boolean;
};

type GoalsProgressProps = {
  goals: GoalItem[];
};

function progressColor(pct: number): string {
  if (pct >= 60) return 'bg-green-500';
  if (pct >= 30) return 'bg-amber-500';
  return 'bg-red-500';
}

function categoryBadge(): string {
  return 'bg-gray-100 text-gray-700 dark:bg-dark-input dark:text-dark-secondary';
}

export default function GoalsProgress({ goals }: GoalsProgressProps) {
  const navigate = useNavigate();
  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);
  const display = [...activeGoals, ...completedGoals].slice(0, 5);

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-dark-accent transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-primary">Goals Progress</h3>
        <button
          onClick={() => navigate('/goals')}
          className="text-sm text-gray-700 dark:text-dark-secondary bg-transparent border-none cursor-pointer font-medium hover:text-gray-900 dark:hover:text-dark-primary transition-colors"
        >
          View All
        </button>
      </div>

      {display.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-sm text-gray-500 dark:text-dark-muted">Set goals to track progress</p>
        </div>
      ) : (
        <div className="space-y-4">
          {display.map((goal) => (
            <div
              key={goal.id}
              className={`${goal.completed ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  {goal.completed && <CheckCircle2 size={14} className="text-green-500 shrink-0" />}
                  <span className={`text-sm font-medium truncate ${
                    goal.completed
                      ? 'line-through text-gray-400 dark:text-dark-muted'
                      : 'text-gray-900 dark:text-dark-primary'
                  }`}>
                    {goal.title}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-dark-primary shrink-0 ml-2">
                  {goal.progress}%
                </span>
              </div>

              <div className="w-full bg-gray-100 dark:bg-dark-input rounded-full h-2 mb-1.5">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    goal.completed ? 'bg-green-500' : progressColor(goal.progress)
                  }`}
                  style={{ width: `${Math.max(goal.progress, 2)}%` }}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${categoryBadge()}`}>
                  {goal.category}
                </span>
                {goal.deadline && goal.deadline !== 'No deadline' && (
                  <span className="text-[10px] text-gray-500 dark:text-dark-muted">
                    Due {goal.deadline}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
