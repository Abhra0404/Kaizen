interface SpinnerProps {
  className?: string;
}

export default function Spinner({ className = '' }: SpinnerProps) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 dark:border-dark-border dark:border-t-white rounded-full animate-spin" />
    </div>
  );
}
