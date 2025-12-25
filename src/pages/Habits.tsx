import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Habit = {
  id: number;
  name: string;
  frequency: 'Daily' | 'Weekly';
  streak: number;
};

const STORAGE_KEY = 'kaizen-habits';

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved) as Habit[];
    } catch (err) {
      console.error('Failed to load habits', err);
    }
    return [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    frequency: 'Daily' as 'Daily' | 'Weekly',
    streak: 0,
  });

  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    frequency: 'Daily' as 'Daily' | 'Weekly',
    streak: 0,
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch (err) {
      console.error('Failed to save habits', err);
    }
  }, [habits]);

  const stats = useMemo(() => {
    const active = habits.length;
    const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
    const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
    const dailyCount = habits.filter(h => h.frequency === 'Daily').length;
    return { active, totalStreak, bestStreak, dailyCount };
  }, [habits]);

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    const newHabit: Habit = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      ...formData,
    };
    setHabits(prev => [newHabit, ...prev]);
    setIsModalOpen(false);
    setFormData({ name: '', frequency: 'Daily', streak: 0 });
  };

  const handleDeleteHabit = (id: number) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const handleIncrementStreak = (id: number) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, streak: h.streak + 1 } : h));
  };

  const startEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setEditFormData({ name: habit.name, frequency: habit.frequency, streak: habit.streak });
  };

  const handleUpdateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHabit) return;
    setHabits(prev => prev.map(h => h.id === editingHabit.id ? { ...h, ...editFormData } : h));
    setEditingHabit(null);
  };

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Active Habits</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Daily Habits</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.dailyCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Streak Days</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalStreak}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Best Streak</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.bestStreak} days</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Routines</p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Habits</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 text-white rounded-lg border border-black cursor-pointer transition-colors"
        >
          <Plus size={18} />
          New Habit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {habits.map((habit, index) => (
          <div key={habit.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{habit.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{habit.frequency}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEditHabit(habit)}
                  className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                  aria-label="Edit habit"
                >
                  <Pencil size={18} className="text-indigo-600 dark:text-indigo-300" />
                </button>
                <button
                  onClick={() => handleIncrementStreak(habit.id)}
                  className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                  aria-label="Increment streak"
                >
                  <Check size={18} className="text-green-600 dark:text-green-400" />
                </button>
                <button
                  onClick={() => handleDeleteHabit(habit.id)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  aria-label="Delete habit"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{habit.streak}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">day streak</span>
            </div>

            <div className="mt-4 flex gap-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full ${i < Math.min(habit.streak % 8, 7) ? 'bg-indigo-500 dark:bg-indigo-400' : 'bg-gray-200 dark:bg-gray-700'}`}
                ></div>
              ))}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Last 7 check-ins (visual)</p>
          </div>
        ))}

        {habits.length === 0 && (
          <div className="col-span-full bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center text-gray-600 dark:text-gray-400">
            No habits yet. Click "New Habit" to create your first one.
          </div>
        )}
      </div>

      {/* Add Habit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">New Habit</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddHabit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Habit name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Morning Coding Session"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'Daily' | 'Weekly' })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Starting streak</label>
                <input
                  type="number"
                  min={0}
                  value={formData.streak}
                  onChange={(e) => setFormData({ ...formData, streak: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Habit Modal */}
      {editingHabit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Habit</h3>
              <button
                onClick={() => setEditingHabit(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateHabit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Habit name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Morning Coding Session"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frequency</label>
                <select
                  value={editFormData.frequency}
                  onChange={(e) => setEditFormData({ ...editFormData, frequency: e.target.value as 'Daily' | 'Weekly' })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Streak</label>
                <input
                  type="number"
                  min={0}
                  value={editFormData.streak}
                  onChange={(e) => setEditFormData({ ...editFormData, streak: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingHabit(null)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
