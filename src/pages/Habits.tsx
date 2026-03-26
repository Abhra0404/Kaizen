import { Check, Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useHabits } from '@/hooks/useHabits';
import { FREQUENCIES } from '@/constants';
import type { Frequency, Habit } from '@/types';
import Spinner from '@/components/ui/Spinner';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import ErrorBanner from '@/components/ui/ErrorBanner';

export default function Habits() {
  const { habits, loading, error, clearError, addHabit, updateHabit, removeHabit, incrementStreak } = useHabits();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', frequency: 'Daily' as Frequency, streak: 0 });

  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', frequency: 'Daily' as Frequency, streak: 0 });

  const stats = useMemo(() => {
    const active = habits.length;
    const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
    const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
    const dailyCount = habits.filter(h => h.frequency === 'Daily').length;
    return { active, totalStreak, bestStreak, dailyCount };
  }, [habits]);

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addHabit(formData);
    setIsModalOpen(false);
    setFormData({ name: '', frequency: 'Daily', streak: 0 });
  };

  const startEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setEditFormData({ name: habit.name, frequency: habit.frequency, streak: habit.streak });
  };

  const handleUpdateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHabit) return;
    await updateHabit(editingHabit.id, editFormData);
    setEditingHabit(null);
  };

  return (
    <>
      <PageHeader title="My Habits" subtitle="Build and track consistent habits for growth" />

      <ErrorBanner message={error} onDismiss={clearError} />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-dark-primary">Habit Snapshot</h2>
        <p className="text-sm text-gray-500 dark:text-dark-muted">Daily momentum at a glance</p>
      </div>

      {loading ? (
        <Spinner className="py-12" />
      ) : (<>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Active Habits" value={stats.active} />
        <StatCard label="Daily Habits" value={stats.dailyCount} />
        <StatCard label="Total Streak Days" value={stats.totalStreak} />
        <StatCard label="Best Streak" value={`${stats.bestStreak} days`} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500 dark:text-dark-muted uppercase tracking-wide">Routines</p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-primary">Active Habits</h2>
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
        {habits.map((habit) => (
          <div key={habit.id} className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-6 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-primary mb-1">{habit.name}</h3>
                <p className="text-sm text-gray-600 dark:text-dark-muted">{habit.frequency}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => startEditHabit(habit)} className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors" aria-label="Edit habit">
                  <Pencil size={18} className="text-indigo-600 dark:text-indigo-300" />
                </button>
                <button onClick={() => incrementStreak(habit.id)} className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors" aria-label="Increment streak">
                  <Check size={18} className="text-green-600 dark:text-green-400" />
                </button>
                <button onClick={() => removeHabit(habit.id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" aria-label="Delete habit">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-dark-primary">{habit.streak}</span>
              <span className="text-sm text-gray-600 dark:text-dark-muted">day streak</span>
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-dark-input rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 transition-all"
                  style={{ width: `${Math.min(100, (habit.streak / Math.max(habit.streak, 30)) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-dark-muted mt-2">
                {habit.streak > 0
                  ? `${habit.streak} day${habit.streak === 1 ? '' : 's'} — keep it going!`
                  : 'Tap the check to start your streak'}
              </p>
            </div>
          </div>
        ))}

        {habits.length === 0 && (
          <EmptyState message='No habits yet. Click "New Habit" to create your first one.' className="col-span-full" />
        )}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Habit">
        <form onSubmit={handleAddHabit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Habit name</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="e.g., Morning Coding Session" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Frequency</label>
            <select value={formData.frequency} onChange={(e) => setFormData({ ...formData, frequency: e.target.value as Frequency })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Starting streak</label>
            <input type="number" min={0} value={formData.streak} onChange={(e) => setFormData({ ...formData, streak: Number(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="0" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-secondary bg-gray-100 dark:bg-dark-input rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900 transition-colors">Save Habit</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!editingHabit} onClose={() => setEditingHabit(null)} title="Edit Habit">
        <form onSubmit={handleUpdateHabit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Habit name</label>
            <input type="text" required value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="e.g., Morning Coding Session" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Frequency</label>
            <select value={editFormData.frequency} onChange={(e) => setEditFormData({ ...editFormData, frequency: e.target.value as Frequency })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Streak</label>
            <input type="number" min={0} value={editFormData.streak} onChange={(e) => setEditFormData({ ...editFormData, streak: Number(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="0" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setEditingHabit(null)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-secondary bg-gray-100 dark:bg-dark-input rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">Save Changes</button>
          </div>
        </form>
      </Modal>
      </>)}
    </>
  );
}
