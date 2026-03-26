import { Link } from 'react-router-dom';
import { Zap, Moon, Sun } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface AuthLayoutProps {
  children: ReactNode;
  showBackLink?: boolean;
  showFooter?: boolean;
}

export default function AuthLayout({ children, showBackLink = true, showFooter = true }: AuthLayoutProps) {
  const { isDark, toggleDark } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-primary flex flex-col">
      <nav
        className="fixed top-0 w-full z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border shadow-sm"
        role="navigation"
        aria-label="Auth navigation"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group" aria-label="Kaizen — Home">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center text-white dark:text-gray-900 group-hover:shadow-md transition-shadow">
              <Zap size={20} className="fill-current" />
            </div>
            <span className="text-lg font-bold tracking-tight group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Kaizen</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDark}
              className="p-2 text-gray-600 dark:text-dark-muted border border-gray-300 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {showBackLink && (
              <Link
                to="/"
                className="text-sm font-medium px-4 py-2 text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-primary hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-all duration-200"
              >
                Back to Home
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 pt-24 pb-12">
        {children}
      </div>

      {showFooter && (
        <footer className="border-t border-gray-200 dark:border-dark-border py-8 px-6" role="contentinfo">
          <div className="max-w-6xl mx-auto text-center text-sm text-gray-500 dark:text-dark-muted">
            <p>&copy; {new Date().getFullYear()} Kaizen. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
}
