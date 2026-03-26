import { useNavigate } from 'react-router-dom';

type ProjectItem = {
  name: string;
  status: string;
  progress: number;
  color: string;
};

type ProjectsListProps = {
  projects?: ProjectItem[];
  title?: string;
};

export default function ProjectsList({
  projects = [
    { name: 'E-commerce Platform', status: 'In Progress', progress: 65, color: '#10b981' },
    { name: 'Mobile App Design', status: 'Review', progress: 90, color: '#10b981' },
    { name: 'API Integration', status: 'In Progress', progress: 45, color: '#10b981' },
    { name: 'Database Migration', status: 'Planning', progress: 20, color: '#9ca3af' },
  ],
  title = 'Active Projects',
}: ProjectsListProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-border transition-colors hover:shadow-lg duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-primary">{title}</h3>
        <button
          onClick={() => navigate('/projects')}
          className="text-sm text-gray-700 dark:text-dark-secondary bg-transparent border-none cursor-pointer font-medium hover:text-gray-900 dark:hover:text-dark-primary transition-colors"
        >
          View All
        </button>
      </div>

      <div>
        {projects.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-dark-muted text-center py-4">No projects yet</p>
        ) : (
          projects.map((project, index) => (
            <div key={index} className={`pb-4 ${index < projects.length - 1 ? 'border-b border-gray-100 dark:border-dark-border' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-dark-primary">{project.name}</h4>
                  <p className="text-xs text-gray-600 dark:text-dark-muted mt-1">{project.status}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-dark-secondary">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-input rounded-full h-2">
                <div className="h-2 rounded-full transition-all" style={{ backgroundColor: project.color, width: `${project.progress}%` }}></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
