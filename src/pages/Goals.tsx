import { CheckCircle2, Circle, Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useGoals } from '@/hooks/useGoals';
import type { Goal } from '@/types';
import Spinner from '@/components/ui/Spinner';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import ErrorBanner from '@/components/ui/ErrorBanner';

export default function Goals() {
  const { goals, loading, error, clearError, addGoal, updateGoal, removeGoal, toggleCompleted } = useGoals();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const [addForm, setAddForm] = useState({ title: '', description: '', category: '', deadline: '', progress: 0, completed: false });
  const [editForm, setEditForm] = useState({ title: '', description: '', category: '', deadline: '', progress: 0, completed: false });

  const stats = useMemo(() => {
    const total = goals.length;
    const completed = goals.filter(g => g.completed).length;
    const inProgress = total - completed;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, completionRate };
  }, [goals]);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    await addGoal({
      title: addForm.title,
      description: addForm.description,
      category: addForm.category || 'General',
      deadline: addForm.deadline || '',
      progress: Math.min(100, Math.max(0, addForm.progress)),
      completed: addForm.completed,
    });
    setIsAddOpen(false);
    setAddForm({ title: '', description: '', category: '', deadline: '', progress: 0, completed: false });
  };

  const openEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setEditForm({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      deadline: goal.deadline,
      progress: goal.progress,
      completed: goal.completed,
    });
    setIsEditOpen(true);
  };

  const handleUpdateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal) return;
    await updateGoal(editingGoal.id, {
      title: editForm.title,
      description: editForm.description,
      category: editForm.category || 'General',
      deadline: editForm.deadline || '',
      progress: Math.min(100, Math.max(0, editForm.progress)),
      completed: editForm.completed,
    });
    setIsEditOpen(false);
    setEditingGoal(null);
  };

  const formatDeadline = (deadline: string) => {
    if (!deadline) return 'No deadline';
    try {
      return new Date(deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return deadline;
    }
  };

  if (loading) return <Spinner className="py-12" />;

  return (
    <>
      <PageHeader title="Goals" subtitle="Set and achieve meaningful learning goals" />

      <ErrorBanner message={error} onDismiss={clearError} />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-dark-primary">Goal Snapshot</h2>
        <p className="text-sm text-gray-500 dark:text-dark-muted">Where you stand now</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Goals" value={stats.total} />
        <StatCard label="In Progress" value={stats.inProgress} />
        <StatCard label="Completed" value={stats.completed} />
        <StatCard label="Completion Rate" value={`${stats.completionRate}%`} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500 dark:text-dark-muted uppercase tracking-wide">Planning</p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-primary">Active Goals</h2>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 text-white rounded-lg border border-black cursor-pointer transition-colors"
        >
          <Plus size={18} />
          New Goal
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className={`rounded-xl p-6 shadow-sm border transition-all ${
              goal.completed
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-white dark:bg-dark-card border-gray-100 dark:border-dark-border'
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleCompleted(goal.id)}
                className="mt-1 bg-transparent border-none cursor-pointer"
                aria-label={goal.completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {goal.completed ? (
                  <CheckCircle2 size={24} className="text-green-600 dark:text-green-400" />
                ) : (
                  <Circle size={24} className="text-gray-300 dark:text-dark-border" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2 gap-3">
                  <div>
                    <h3 className={`text-lg font-semibold ${goal.completed ? 'text-gray-600 dark:text-dark-muted line-through' : 'text-gray-900 dark:text-dark-primary'}`}>
                      {goal.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-dark-muted mt-1">{goal.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-dark-input text-gray-700 dark:text-dark-secondary rounded-full text-xs font-semibold whitespace-nowrap">{goal.category}</span>
                    <button onClick={() => openEditGoal(goal)} className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors" aria-label="Edit goal">
                      <Pencil size={16} className="text-indigo-600 dark:text-indigo-300" />
                    </button>
                    <button onClick={() => removeGoal(goal.id)} className="p-2 rounded-lg bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" aria-label="Delete goal">
                      <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-dark-muted">Progress</span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-dark-secondary">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-dark-input rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all ${goal.completed ? 'bg-green-500' : 'bg-emerald-500'}`} style={{ width: `${goal.progress}%` }} />
                  </div>
                </div>

                <p className="text-xs text-gray-600 dark:text-dark-muted mt-3">
                  Deadline: <span className="font-semibold text-gray-700 dark:text-dark-secondary">{formatDeadline(goal.deadline)}</span>
                </p>
              </div>
            </div>
          </div>
        ))}

        {goals.length === 0 && (
          <EmptyState message='No goals yet. Click "New Goal" to add your first one.' />
        )}
      </div>

      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="New Goal" maxWidth="max-w-2xl">
        <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Title</label>
            <input type="text" required value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent" placeholder="Goal title" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Description</label>
            <textarea required value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent" rows={3} placeholder="What does success look like?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Category</label>
            <input type="text" value={addForm.category} onChange={(e) => setAddForm({ ...addForm, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent" placeholder="e.g., Learning, Health" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Deadline</label>
            <input type="date" value={addForm.deadline} onChange={(e) => setAddForm({ ...addForm, deadline: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Progress (%)</label>
            <input type="text" inputMode="numeric" value={addForm.progress} onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); setAddForm({ ...addForm, progress: Math.min(100, parseInt(v) || 0) }); }} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent" placeholder="0 - 100" />
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <input type="checkbox" id="add-completed" checked={addForm.completed} onChange={(e) => setAddForm({ ...addForm, completed: e.target.checked })} className="w-4 h-4 text-gray-900 dark:text-dark-primary border-gray-300 rounded focus:ring-gray-400" />
            <label htmlFor="add-completed" className="text-sm font-medium text-gray-700 dark:text-dark-secondary">Mark as completed</label>
          </div>
          <div className="md:col-span-2 flex gap-3 pt-2">
            <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-secondary bg-gray-100 dark:bg-dark-input rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900 transition-colors">Save Goal</button>
          </div>
        </form>
      </Modal>

      <Modal open={isEditOpen && !!editingGoal} onClose={() => { setIsEditOpen(false); setEditingGoal(null); }} title="Edit Goal" maxWidth="max-w-2xl">
        <form onSubmit={handleUpdateGoal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Title</label>
            <input type="text" required value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent" placeholder="Goal title" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Description</label>
            <textarea required value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent" rows={3} placeholder="What does success look like?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Category</label>
            <input type="text" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent" placeholder="e.g., Learning, Health" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Deadline</label>
            <input type="date" value={editForm.deadline} onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Progress (%)</label>
            <input type="text" inputMode="numeric" value={editForm.progress} onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); setEditForm({ ...editForm, progress: Math.min(100, parseInt(v) || 0) }); }} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent" placeholder="0 - 100" />
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <input type="checkbox" id="edit-completed" checked={editForm.completed} onChange={(e) => setEditForm({ ...editForm, completed: e.target.checked })} className="w-4 h-4 text-gray-900 dark:text-dark-primary border-gray-300 rounded focus:ring-gray-400" />
            <label htmlFor="edit-completed" className="text-sm font-medium text-gray-700 dark:text-dark-secondary">Mark as completed</label>
          </div>
          <div className="md:col-span-2 flex gap-3 pt-2">
            <button type="button" onClick={() => { setIsEditOpen(false); setEditingGoal(null); }} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-secondary bg-gray-100 dark:bg-dark-input rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">Save Changes</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
