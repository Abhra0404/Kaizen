import { Plus, Trash2 } from 'lucide-react';

export default function Projects() {
  const projects = [
    {
      id: 1,
      name: 'E-Commerce Platform',
      description: 'Full-stack MERN application with payment integration',
      status: 'In Progress',
      progress: 65,
      team: ['Alex', 'Jamie', 'Sam'],
      tags: ['React', 'Node.js', 'MongoDB'],
    },
    {
      id: 2,
      name: 'Mobile App Design',
      description: 'iOS and Android app for habit tracking',
      status: 'Review',
      progress: 90,
      team: ['Alex', 'Taylor'],
      tags: ['Flutter', 'Firebase'],
    },
    {
      id: 3,
      name: 'API Integration',
      description: 'RESTful API with authentication and middleware',
      status: 'In Progress',
      progress: 45,
      team: ['Alex'],
      tags: ['Express.js', 'PostgreSQL'],
    },
    {
      id: 4,
      name: 'Database Migration',
      description: 'Migrating from SQL to NoSQL database',
      status: 'Planning',
      progress: 20,
      team: ['Alex', 'Morgan'],
      tags: ['MongoDB', 'PostgreSQL'],
    },
  ];

  // status pill styling inlined below; removed Tailwind mapping

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Projects</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Manage and track all your ongoing projects</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Pipeline</p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Projects</h2>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg border-none cursor-pointer transition-colors">
          <Plus size={18} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{project.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
              </div>
              <button className="p-2 rounded-lg bg-transparent border-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Trash2 size={18} className="text-gray-400 dark:text-gray-500" />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
                  {project.status}
                </span>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Team</p>
              <div className="flex gap-2">
                {project.team.map((member, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-xs font-semibold"
                  >
                    {member[0]}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
