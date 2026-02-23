import { Search, Moon, Sun, ArrowLeft, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user } = useAuth();
  const fullName: string = user?.user_metadata?.full_name ?? user?.email ?? 'User';
  const firstName = fullName.split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase();
  const avatarUrl: string = user?.user_metadata?.avatar_url ?? '';
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-3 md:px-6 shadow-sm gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <Link
          to="/"
          className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 whitespace-nowrap shrink-0"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Home</span>
        </Link>
        <div className="relative w-full max-w-xs hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} className="text-gray-400" /> : <Moon size={18} className="text-gray-700" />}
        </button>
        <div className="flex items-center gap-2 ml-1 pl-2 border-l border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 hidden sm:block">{firstName}</p>
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
