import { Plus, Check } from 'lucide-react';

export default function Habits() {
  const habits = [
    { id: 1, name: 'Morning Coding Session', frequency: 'Daily', streak: 12, color: 'bg-blue-100', borderColor: 'border-blue-300' },
    { id: 2, name: 'Read Technical Articles', frequency: 'Daily', streak: 8, color: 'bg-green-100', borderColor: 'border-green-300' },
    { id: 3, name: 'Exercise', frequency: 'Daily', streak: 5, color: 'bg-orange-100', borderColor: 'border-orange-300' },
    { id: 4, name: 'Review Notes', frequency: 'Weekly', streak: 4, color: 'bg-teal-100', borderColor: 'border-teal-300' },
    { id: 5, name: 'Contribute to Open Source', frequency: 'Weekly', streak: 2, color: 'bg-purple-100', borderColor: 'border-purple-300' },
    { id: 6, name: 'Project Work', frequency: 'Daily', streak: 15, color: 'bg-pink-100', borderColor: 'border-pink-300' },
  ];

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">My Habits</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Build and track consistent habits for growth</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Habit Snapshot</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Daily momentum at a glance</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Active Habits</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">18</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Current Streak</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">15 days</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Completion Rate</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">89%</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Routines</p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Habits</h2>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg border-none cursor-pointer transition-colors">
          <Plus size={18} />
          New Habit
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {habits.map((habit) => (
          <div key={habit.id} className="bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl p-6 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{habit.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{habit.frequency}</p>
              </div>
              <button className="p-2 bg-white dark:bg-gray-800 rounded-lg border-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Check size={20} className="text-gray-400 dark:text-gray-500" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{habit.streak}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">day streak</span>
            </div>

            <div className="mt-4 flex gap-1">
              {[...Array(7)].map((_, i) => (
                <div key={i} className={`flex-1 h-2 rounded-full ${
                  i < 5 ? 'bg-green-500 dark:bg-green-400' : 'bg-gray-300 dark:bg-gray-600'
                }`}></div>
              ))}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Last 7 days completion</p>
          </div>
        ))}
      </div>
    </>
  );
}
