import { LayoutDashboard, Code2, CheckCircle, FolderKanban, Target, Settings, Zap } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', to: '/dashboard' },
  { icon: Code2, label: 'DSA', to: '/dsa' },
  { icon: CheckCircle, label: 'Habits', to: '/habits' },
  { icon: FolderKanban, label: 'Projects', to: '/projects' },
  { icon: Target, label: 'Goals', to: '/goals' },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 rounded-lg flex items-center justify-center shadow-sm">
            <Zap size={18} className="text-white dark:text-gray-900" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Kaizen</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Productivity Suite</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg no-underline transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                } font-medium text-sm group`
              }
            >
              <Icon size={18} strokeWidth={2} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 m-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-lg">💡</span>
          <div>
            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-1">Pro Tip</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Track daily progress to maintain momentum</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
