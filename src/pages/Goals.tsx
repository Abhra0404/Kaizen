import { Plus, CheckCircle2, Circle } from 'lucide-react';

export default function Goals() {
  const goals = [
    {
      id: 1,
      title: 'Master DSA',
      description: 'Solve 500 LeetCode problems',
      progress: 58,
      deadline: '2025-06-30',
      category: 'Learning',
      completed: false,
    },
    {
      id: 2,
      title: 'Complete Full-Stack Project',
      description: 'Build and deploy a production-ready application',
      progress: 75,
      deadline: '2025-03-30',
      category: 'Project',
      completed: false,
    },
    {
      id: 3,
      title: 'Improve Communication Skills',
      description: 'Give 5 technical presentations',
      progress: 40,
      deadline: '2025-12-31',
      category: 'Soft Skills',
      completed: false,
    },
    {
      id: 4,
      title: 'Read 12 Technical Books',
      description: 'One book per month on software development',
      progress: 33,
      deadline: '2025-12-31',
      category: 'Reading',
      completed: false,
    },
    {
      id: 5,
      title: 'Build Open Source Portfolio',
      description: 'Contribute to 3 major open source projects',
      progress: 100,
      deadline: '2024-12-20',
      category: 'Open Source',
      completed: true,
    },
  ];

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

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Goals</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">8</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">In Progress</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">4</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">1</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Completion Rate</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">59%</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Planning</p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Goals</h2>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg border-none cursor-pointer transition-colors">
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
              <button className="mt-1 bg-transparent border-none cursor-pointer">
                {goal.completed ? (
                  <CheckCircle2 size={24} className="text-green-600 dark:text-green-400" />
                ) : (
                  <Circle size={24} className="text-gray-300 dark:text-gray-600" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
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
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold">
                    {goal.category}
                  </span>
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
      </div>
    </>
  );
}
