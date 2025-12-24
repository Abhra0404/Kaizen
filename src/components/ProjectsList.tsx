export default function ProjectsList() {
  const projects = [
    { name: 'E-commerce Platform', status: 'In Progress', progress: 65, color: '#3b82f6' },
    { name: 'Mobile App Design', status: 'Review', progress: 90, color: '#10b981' },
    { name: 'API Integration', status: 'In Progress', progress: 45, color: '#3b82f6' },
    { name: 'Database Migration', status: 'Planning', progress: 20, color: '#9ca3af' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors hover:shadow-lg duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Projects</h3>
        <button className="text-sm text-blue-600 dark:text-blue-400 bg-transparent border-none cursor-pointer font-medium hover:text-blue-700 dark:hover:text-blue-300">View All</button>
      </div>

      <div>
        {projects.map((project, index) => (
          <div key={index} className={`pb-4 ${index < projects.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{project.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{project.status}</p>
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="h-2 rounded-full transition-all" style={{ backgroundColor: project.color, width: `${project.progress}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
