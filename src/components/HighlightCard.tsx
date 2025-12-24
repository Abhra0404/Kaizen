import { Award } from 'lucide-react';

export default function HighlightCard() {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-green-500 dark:from-blue-600 dark:to-green-600 rounded-xl p-6 shadow-sm text-white transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <Award size={24} color="white" />
        </div>
        <span className="text-xs bg-white/20 px-3 py-1 rounded-full text-white">
          This Week
        </span>
      </div>

      <h3 className="text-3xl font-bold mb-2 text-white">47 hrs</h3>
      <p className="text-sm text-white/90 mb-4">Total Focus Time</p>

      <div className="flex items-center gap-4 pt-4 border-t border-white/20">
        <div>
          <p className="text-xs text-white/80">Daily Avg</p>
          <p className="text-lg font-semibold text-white">6.7 hrs</p>
        </div>
        <div>
          <p className="text-xs text-white/80">Streak</p>
          <p className="text-lg font-semibold text-white">12 days</p>
        </div>
      </div>
    </div>
  );
}
