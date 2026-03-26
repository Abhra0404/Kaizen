type TopicEntry = {
  topic: string;
  count: number;
};

type TopicHeatmapProps = {
  topics: TopicEntry[];
};

const BAR_COLORS = [
  'bg-emerald-500',
  'bg-emerald-400',
  'bg-teal-500',
  'bg-teal-400',
  'bg-cyan-500',
  'bg-cyan-400',
  'bg-sky-500',
  'bg-sky-400',
];

export default function TopicHeatmap({ topics }: TopicHeatmapProps) {
  const sorted = [...topics].sort((a, b) => b.count - a.count).slice(0, 8);
  const maxCount = sorted.length > 0 ? Math.max(...sorted.map(t => t.count), 1) : 1;

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-dark-accent transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-primary mb-6">Topic Distribution</h3>

      {sorted.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-sm text-gray-500 dark:text-dark-muted">Solve problems to see topic distribution</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((entry, i) => (
            <div key={entry.topic} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 dark:text-dark-muted w-20 truncate text-right shrink-0">
                {entry.topic || 'Other'}
              </span>
              <div className="flex-1 bg-gray-100 dark:bg-dark-input rounded-full h-5 relative overflow-hidden">
                <div
                  className={`h-5 rounded-full transition-all duration-500 ${BAR_COLORS[i % BAR_COLORS.length]}`}
                  style={{ width: `${Math.max((entry.count / maxCount) * 100, 6)}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-dark-primary w-8 text-right shrink-0">
                {entry.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
