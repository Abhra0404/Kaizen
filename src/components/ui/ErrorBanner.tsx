import { AlertCircle, X } from 'lucide-react';

interface ErrorBannerProps {
  message: string | null;
  onDismiss?: () => void;
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
      <AlertCircle size={18} className="shrink-0" />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
          aria-label="Dismiss error"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
