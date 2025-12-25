import { CheckCircle2, Circle, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Goal = {
  id: number;
  title: string;
  description: string;
  progress: number;
  deadline: string;
  category: string;
  completed: boolean;
};

const STORAGE_KEY = 'kaizen-goals';

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved) as Goal[];
    } catch (err) {
      console.error('Failed to load goals', err);
    }
    return [];
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const [addForm, setAddForm] = useState({
    title: '',
    description: '',
    category: '',
    deadline: '',
    progress: 0,
    completed: false,
  });

  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    deadline: '',
    progress: 0,
    completed: false,
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (err) {
      console.error('Failed to save goals', err);
    }
  }, [goals]);

  const stats = useMemo(() => {
    const total = goals.length;
    const completed = goals.filter(g => g.completed).length;
    const inProgress = total - completed;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, completionRate };
  }, [goals]);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: Goal = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      title: addForm.title,
      description: addForm.description,
      category: addForm.category || 'General',
      deadline: addForm.deadline || 'No deadline',
      progress: Math.min(100, Math.max(0, addForm.progress)),
      completed: addForm.completed,
    };
    setGoals(prev => [newGoal, ...prev]);
    setIsAddOpen(false);
    setAddForm({ title: '', description: '', category: '', deadline: '', progress: 0, completed: false });
  };

  const handleDeleteGoal = (id: number) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const toggleCompleted = (id: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const openEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setEditForm({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      deadline: goal.deadline === 'No deadline' ? '' : goal.deadline,
      progress: goal.progress,
      completed: goal.completed,
    });
    setIsEditOpen(true);
  };

  const handleUpdateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal) return;
    setGoals(prev => prev.map(g => g.id === editingGoal.id ? {
      ...g,
      title: editForm.title,
      description: editForm.description,
      category: editForm.category || 'General',
      deadline: editForm.deadline || 'No deadline',
      progress: Math.min(100, Math.max(0, editForm.progress)),
      completed: editForm.completed,
    } : g));
    setIsEditOpen(false);
    setEditingGoal(null);
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Goals</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Set and achieve meaningful learning goals</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Goal Snapshot</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Where you stand now</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Goals</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">In Progress</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Completion Rate</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completionRate}%</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Planning</p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Goals</h2>
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
                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
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
                  <Circle size={24} className="text-gray-300 dark:text-gray-600" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2 gap-3">
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      goal.completed
                        ? 'text-gray-600 dark:text-gray-400 line-through'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {goal.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{goal.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold whitespace-nowrap">
                      {goal.category}
                    </span>
                    <button
                      onClick={() => openEditGoal(goal)}
                      className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                      aria-label="Edit goal"
                    >
                      <Pencil size={16} className="text-indigo-600 dark:text-indigo-300" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 rounded-lg bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      aria-label="Delete goal"
                    >
                      <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        goal.completed ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                  Deadline: <span className="font-semibold text-gray-700 dark:text-gray-300">{goal.deadline}</span>
                </p>
              </div>
            </div>
          </div>
        ))}

        {goals.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center text-gray-600 dark:text-gray-400">
            No goals yet. Click "New Goal" to add your first one.
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">New Goal</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={addForm.title}
                  onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Goal title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  required
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="What does success look like?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <input
                  type="text"
                  value={addForm.category}
                  onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Learning, Health"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Deadline</label>
                <input
                  type="date"
                  value={addForm.deadline}
                  onChange={(e) => setAddForm({ ...addForm, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Progress (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={addForm.progress}
                  onChange={(e) => setAddForm({ ...addForm, progress: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0 - 100"
                />
              </div>

              <div className="flex items-center gap-2 md:col-span-2">
                <input
                  type="checkbox"
                  id="add-completed"
                  checked={addForm.completed}
                  onChange={(e) => setAddForm({ ...addForm, completed: e.target.checked })}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="add-completed" className="text-sm font-medium text-gray-700 dark:text-gray-300">Mark as completed</label>
              </div>

              <div className="md:col-span-2 flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {isEditOpen && editingGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Goal</h3>
              <button onClick={() => { setIsEditOpen(false); setEditingGoal(null); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateGoal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Goal title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  required
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="What does success look like?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <input
                  type="text"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Learning, Health"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Deadline</label>
                <input
                  type="date"
                  value={editForm.deadline}
                  onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Progress (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={editForm.progress}
                  onChange={(e) => setEditForm({ ...editForm, progress: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0 - 100"
                />
              </div>

              <div className="flex items-center gap-2 md:col-span-2">
                <input
                  type="checkbox"
                  id="edit-completed"
                  checked={editForm.completed}
                  onChange={(e) => setEditForm({ ...editForm, completed: e.target.checked })}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="edit-completed" className="text-sm font-medium text-gray-700 dark:text-gray-300">Mark as completed</label>
              </div>

              <div className="md:col-span-2 flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsEditOpen(false); setEditingGoal(null); }}
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
