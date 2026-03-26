import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useProblems } from '@/hooks/useProblems';
import { useAuth } from '@/contexts/AuthContext';
import { DIFFICULTIES, DIFFICULTY_STYLES } from '@/constants';
import type { Difficulty } from '@/types';
import Spinner from '@/components/ui/Spinner';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import Modal from '@/components/ui/Modal';
import ErrorBanner from '@/components/ui/ErrorBanner';
import EmptyState from '@/components/ui/EmptyState';
import SyncStatusBadge from '@/components/SyncStatusBadge';

export default function DSA() {
  const { user } = useAuth();
  const {
    problems, loading, error, clearError,
    addProblem, toggleSolved, removeProblem,
    syncFromLeetCode, syncing, syncResult, setSyncResult,
  } = useProblems();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Easy' as Difficulty,
    topic: '',
    solved: false,
  });

  const totalCount = problems.length;
  const solvedCount = problems.filter(p => p.solved).length;
  const easyCount = problems.filter(p => p.difficulty === 'Easy').length;
  const mediumCount = problems.filter(p => p.difficulty === 'Medium').length;
  const hardCount = problems.filter(p => p.difficulty === 'Hard').length;

  const handleAddProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProblem(formData);
    setIsModalOpen(false);
    setFormData({ title: '', difficulty: 'Easy', topic: '', solved: false });
  };

  if (loading) return <Spinner className="py-12" />;

  return (
    <>
      <PageHeader title="DSA Problems" subtitle="Track your problem-solving progress" />

      <ErrorBanner message={error} onDismiss={clearError} />

      {syncResult && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm flex items-center justify-between">
          <span>{syncResult}</span>
          <button onClick={() => setSyncResult(null)} className="text-green-500 hover:text-green-600 dark:hover:text-green-300 ml-3 font-medium">
            Dismiss
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-dark-primary">Problem Snapshot</h2>
        <p className="text-sm text-gray-500 dark:text-dark-muted">Today&apos;s key stats</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Problems Solved" value={solvedCount} subtext={`of ${totalCount} total`} />
        <StatCard label="Easy" value={easyCount} subtext={`${totalCount ? Math.round((easyCount / totalCount) * 100) : 0}% of total`} labelColor="text-green-600 dark:text-green-400" valueColor="text-green-600 dark:text-green-400" />
        <StatCard label="Medium" value={mediumCount} subtext={`${totalCount ? Math.round((mediumCount / totalCount) * 100) : 0}% of total`} labelColor="text-orange-600 dark:text-orange-400" valueColor="text-orange-600 dark:text-orange-400" />
        <StatCard label="Hard" value={hardCount} subtext={`${totalCount ? Math.round((hardCount / totalCount) * 100) : 0}% of total`} labelColor="text-red-600 dark:text-red-400" valueColor="text-red-600 dark:text-red-400" />
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-border transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-dark-muted uppercase tracking-wide">Activity</p>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-primary">Recent Problems</h2>
            <SyncStatusBadge userId={user?.id} />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => syncFromLeetCode(false)}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg border border-amber-500 cursor-pointer transition-colors"
              title="Syncs your 20 most recent solved problems (no cookie needed)"
            >
              <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Syncing...' : 'Quick Sync'}
            </button>
            <button
              onClick={() => syncFromLeetCode(true)}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg border border-amber-600 cursor-pointer transition-colors"
              title="Syncs ALL solved problems 20 at a time (requires session cookie in Settings)"
            >
              <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Syncing...' : 'Full Sync'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-black hover:bg-gray-900 text-white rounded-lg border border-black cursor-pointer transition-colors"
            >
              <Plus size={16} />
              Add Problem
            </button>
          </div>
        </div>

        {problems.length === 0 ? (
          <EmptyState message='No problems yet. Click "Add Problem" to track your first one.' />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-border">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-dark-secondary">Problem</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-dark-secondary">Difficulty</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-dark-secondary">Topic</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-dark-secondary">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-dark-secondary">Date</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem) => (
                  <tr key={problem.id} className="border-b border-gray-100 dark:border-dark-border">
                    <td className="py-4 px-4 text-gray-900 dark:text-dark-primary font-medium">
                      {problem.title}
                      {problem.source === 'leetcode' && (
                        <span className="ml-2 text-xs text-amber-600 dark:text-amber-400 font-semibold">LC</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${DIFFICULTY_STYLES[problem.difficulty]}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-dark-muted">{problem.topic}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleSolved(problem.id)}
                        className="cursor-pointer"
                        aria-label={problem.solved ? 'Mark as unsolved' : 'Mark as solved'}
                      >
                        {problem.solved ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">Solved</span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-dark-input text-gray-700 dark:text-dark-secondary">Pending</span>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-dark-muted">
                      <div className="flex items-center justify-between gap-3">
                        <span>{problem.date}</span>
                        <button
                          onClick={() => removeProblem(problem.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          aria-label="Delete problem"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Problem">
        <form onSubmit={handleAddProblem} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Problem Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              placeholder="e.g., Two Sum"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Topic</label>
            <input
              type="text"
              required
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              placeholder="e.g., Array, String, Tree"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="solved"
              checked={formData.solved}
              onChange={(e) => setFormData({ ...formData, solved: e.target.checked })}
              className="w-4 h-4 text-gray-900 dark:text-dark-primary border-gray-300 rounded focus:ring-gray-400"
            />
            <label htmlFor="solved" className="text-sm font-medium text-gray-700 dark:text-dark-secondary">Mark as solved</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-secondary bg-gray-100 dark:bg-dark-input rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900 transition-colors"
            >
              Add Problem
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
