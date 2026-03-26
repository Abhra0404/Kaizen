import { Link } from 'react-router-dom';
import { Zap, Moon, Sun, Code, Target, CheckCircle2, TrendingUp } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useState } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  showBackLink?: boolean;
  showFooter?: boolean;
}

export default function AuthLayout({ children, showBackLink = true, showFooter = true }: AuthLayoutProps) {
  const { isDark, toggleDark } = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-primary flex flex-col relative overflow-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.04] pointer-events-none z-0" aria-hidden="true" />

      {/* Radial glow behind form */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-gradient-radial from-gray-200/40 via-gray-100/20 to-transparent dark:from-dark-card/30 dark:via-dark-surface/10 dark:to-transparent rounded-full blur-3xl" />
      </div>

      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-dark-card dark:to-dark-input rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-dark-input dark:to-dark-card rounded-full blur-3xl opacity-20 animate-float-delayed" />
      </div>

      {/* Floating icons — desktop only */}
      <div className="hidden lg:block fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[20%] left-[8%] animate-float-slow" style={{ animationDelay: '0s' }}>
          <div className="w-12 h-12 rounded-xl border border-gray-200/60 dark:border-dark-border/60 bg-white/70 dark:bg-dark-card/70 backdrop-blur-sm shadow-lg shadow-gray-900/5 dark:shadow-black/10 flex items-center justify-center">
            <Code size={20} className="text-gray-400 dark:text-dark-muted" />
          </div>
        </div>

        <div className="absolute top-[25%] right-[10%] animate-float-diagonal" style={{ animationDelay: '1.5s' }}>
          <div className="w-11 h-11 rounded-xl border border-gray-200/60 dark:border-dark-border/60 bg-white/70 dark:bg-dark-card/70 backdrop-blur-sm shadow-lg shadow-gray-900/5 dark:shadow-black/10 flex items-center justify-center">
            <Target size={18} className="text-gray-400 dark:text-dark-muted" />
          </div>
        </div>

        <div className="absolute top-[60%] left-[6%] animate-float-gentle" style={{ animationDelay: '3s' }}>
          <div className="w-10 h-10 rounded-xl border border-gray-200/60 dark:border-dark-border/60 bg-white/70 dark:bg-dark-card/70 backdrop-blur-sm shadow-lg shadow-gray-900/5 dark:shadow-black/10 flex items-center justify-center">
            <CheckCircle2 size={16} className="text-gray-400 dark:text-dark-muted" />
          </div>
        </div>

        <div className="absolute top-[65%] right-[7%] animate-float-slow" style={{ animationDelay: '2s' }}>
          <div className="w-11 h-11 rounded-xl border border-gray-200/60 dark:border-dark-border/60 bg-white/70 dark:bg-dark-card/70 backdrop-blur-sm shadow-lg shadow-gray-900/5 dark:shadow-black/10 flex items-center justify-center">
            <TrendingUp size={18} className="text-gray-400 dark:text-dark-muted" />
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav
        className="fixed top-0 w-full z-50 bg-white/60 dark:bg-dark-bg/60 backdrop-blur-xl border-b border-gray-200/40 dark:border-dark-border/40 shadow-sm"
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

          <button
            onClick={toggleDark}
            className="p-2 text-gray-600 dark:text-dark-muted border border-gray-300/60 dark:border-dark-border/60 hover:bg-gray-100/80 dark:hover:bg-dark-hover/80 rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className={`flex-1 flex items-center justify-center px-6 pt-24 pb-12 relative z-10 transition-all duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>

      {/* Footer */}
      {showFooter && (
        <footer className="relative z-10 border-t border-gray-200/40 dark:border-dark-border/40 py-8 px-6" role="contentinfo">
          <div className="max-w-6xl mx-auto text-center text-sm text-gray-500 dark:text-dark-muted">
            <p>&copy; {new Date().getFullYear()} Kaizen. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
}
