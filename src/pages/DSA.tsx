import { Filter, Plus, TrendingUp } from 'lucide-react';

export default function DSA() {
  const problems = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', topic: 'Array', solved: true, date: '2024-12-20' },
    { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', topic: 'Linked List', solved: true, date: '2024-12-19' },
    { id: 3, title: 'Longest Substring', difficulty: 'Medium', topic: 'String', solved: false, date: '2024-12-18' },
    { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topic: 'Array', solved: false, date: '2024-12-17' },
    { id: 5, title: 'Longest Palindromic Substring', difficulty: 'Medium', topic: 'String', solved: true, date: '2024-12-16' },
    { id: 6, title: 'Zigzag Conversion', difficulty: 'Medium', topic: 'String', solved: false, date: '2024-12-15' },
  ];

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

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Problems Solved</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">142</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">+8 this week</p>
            </div>
            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Easy</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">58</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">41% of total</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Medium & Hard</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">84</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">59% of total</p>
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
            <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg border-none cursor-pointer transition-colors">
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
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{problem.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
