import { LayoutDashboard, Code2, CheckCircle, FolderKanban, Target, Settings, Zap } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', to: '/' },
  { icon: Code2, label: 'DSA', to: '/dsa' },
  { icon: CheckCircle, label: 'Habits', to: '/habits' },
  { icon: FolderKanban, label: 'Projects', to: '/projects' },
  { icon: Target, label: 'Goals', to: '/goals' },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col transition-colors">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <Zap size={20} color="white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Kaizen</h1>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500 ml-10 font-medium">Continuous Growth</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg no-underline transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                } font-medium text-sm`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 m-4 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-orange-900/20 dark:via-orange-900/10 dark:to-rose-900/20 rounded-xl border border-orange-200 dark:border-orange-800/50 transition-colors shadow-sm">
        <div className="flex items-start gap-2 mb-2">
          <div className="text-lg">🎯</div>
          <div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Quick Tip</p>
          </div>
        </div>
        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">Stay consistent and achieve your goals with daily progress tracking</p>
      </div>
    </aside>
  );
}
