import { Moon, Sun, ArrowLeft, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user } = useAuth();
  const { isDark, toggleDark } = useTheme();
  const fullName: string = user?.user_metadata?.full_name ?? user?.email ?? 'User';
  const firstName = fullName.split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase();
  const avatarUrl: string = user?.user_metadata?.avatar_url ?? '';

  return (
    <nav className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border h-16 flex items-center justify-between px-3 md:px-6 shadow-sm gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-gray-600 dark:text-dark-muted hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors shrink-0"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-primary hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-all duration-200 whitespace-nowrap shrink-0"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium hidden sm:inline">Home</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={toggleDark}
          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-all duration-200"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} className="text-gray-400" /> : <Moon size={18} className="text-gray-700" />}
        </button>
        <div className="flex items-center gap-2 ml-1 pl-2 border-l border-gray-200 dark:border-dark-border">
          <p className="text-sm font-semibold text-gray-900 dark:text-dark-primary hidden sm:block">{firstName}</p>
          <div className="w-9 h-9 rounded-lg overflow-hidden shadow-sm shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={firstName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center text-white dark:text-gray-900 text-sm font-bold">
                {initial}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
