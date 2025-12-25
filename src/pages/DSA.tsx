import { Filter, Plus, Trash2, TrendingUp, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type Problem = {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  solved: boolean;
  date: string;
};

export default function DSA() {
  const STORAGE_KEY = 'kaizen-dsa-problems';

  const [problems, setProblems] = useState<Problem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as Problem[];
      }
    } catch (err) {
      console.error('Failed to load problems from storage', err);
    }
    return [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    topic: '',
    solved: false,
  });

  const totalCount = problems.length;
  const solvedCount = problems.filter(p => p.solved).length;
  const easyCount = problems.filter(p => p.difficulty === 'Easy').length;
  const mediumCount = problems.filter(p => p.difficulty === 'Medium').length;
  const hardCount = problems.filter(p => p.difficulty === 'Hard').length;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
    } catch (err) {
      console.error('Failed to save problems to storage', err);
    }
  }, [problems]);

  const handleAddProblem = (e: React.FormEvent) => {
    e.preventDefault();
    const newProblem: Problem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      ...formData,
      date: new Date().toISOString().split('T')[0],
    };
    setProblems([newProblem, ...problems]);
    setIsModalOpen(false);
    setFormData({ title: '', difficulty: 'Easy', topic: '', solved: false });
  };

  const handleDeleteProblem = (id: number) => {
    setProblems(prev => prev.filter(problem => problem.id !== id));
  };

  const difficultyStyle: Record<string, { bg: string; text: string; border: string }> = {
    Easy: { bg: '#f0fdf4', text: '#047857', border: '#bbf7d0' },
    Medium: { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa' },
    Hard: { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">DSA Problems</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Track your problem-solving progress</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Problem Snapshot</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Today&apos;s key stats</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Problems Solved</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{solvedCount}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">of {totalCount} total</p>
            </div>
            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Easy</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{easyCount}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{totalCount ? Math.round((easyCount / totalCount) * 100) : 0}% of total</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Medium</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{mediumCount}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{totalCount ? Math.round((mediumCount / totalCount) * 100) : 0}% of total</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Hard</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{hardCount}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{totalCount ? Math.round((hardCount / totalCount) * 100) : 0}% of total</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Activity</p>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Problems</h2>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <Filter size={16} />
              Filter
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

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Problem</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Difficulty</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Topic</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => (
                <tr key={problem.id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">{problem.title}</td>
                  <td className="py-4 px-4">
                    <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, border: `1px solid ${difficultyStyle[problem.difficulty].border}`, color: difficultyStyle[problem.difficulty].text, backgroundColor: difficultyStyle[problem.difficulty].bg }}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{problem.topic}</td>
                  <td className="py-4 px-4">
                    {problem.solved ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">Solved</span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Pending</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center justify-between gap-3">
                      <span>{problem.date}</span>
                      <button
                        onClick={() => handleDeleteProblem(problem.id)}
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
      </div>

      {/* Add Problem Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Problem</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddProblem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Problem Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Two Sum"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topic
                </label>
                <input
                  type="text"
                  required
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Array, String, Tree"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="solved"
                  checked={formData.solved}
                  onChange={(e) => setFormData({ ...formData, solved: e.target.checked })}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="solved" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mark as solved
                </label>
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
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
