interface EmptyStateProps {
  message: string;
  className?: string;
}

export default function EmptyState({ message, className = '' }: EmptyStateProps) {
  return (
    <div className={`bg-white dark:bg-dark-card border border-dashed border-gray-300 dark:border-dark-border rounded-xl p-6 text-center text-gray-600 dark:text-dark-muted ${className}`}>
      {message}
    </div>
  );
}
