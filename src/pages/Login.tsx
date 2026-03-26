import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import AuthLayout from '@/components/layout/AuthLayout';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signInWithOAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isSupabaseConfigured) {
      setError('App is not configured properly. Environment variables are missing. Contact the site administrator.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn(email.trim(), password);
      if (error) {
        setError(error.message);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')) {
        setError('Network error: unable to reach the server. Check your internet connection or contact support.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google') => {
    setError('');
    const { error } = await signInWithOAuth(provider);
    if (error) setError(error.message);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        {/* Glassmorphic card */}
        <div className="bg-white/70 dark:bg-dark-card/70 backdrop-blur-xl border border-gray-200/60 dark:border-dark-border/60 rounded-2xl shadow-xl shadow-gray-900/5 dark:shadow-black/20 p-8">
          <div className="space-y-6">
            {/* Back arrow */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-primary transition-colors"
              aria-label="Back to Home"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Link>

            {/* Header */}
            <div className="text-center animate-fade-in" style={{ animationDelay: '0ms' }}>
              <h1 className="text-3xl font-bold">
                <span className="heading-shine">Welcome back</span>
              </h1>
              <p className="mt-1 text-gray-600 dark:text-dark-muted text-sm">Sign in to your account to continue</p>
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-required="true"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-dark-border rounded-lg bg-white/80 dark:bg-dark-surface/80 placeholder-gray-400 dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-0 dark:focus:ring-offset-dark-surface transition-all"
                />
              </div>

              <div className="space-y-1 animate-fade-in" style={{ animationDelay: '150ms' }}>
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-required="true"
                    className="w-full px-4 py-2.5 pr-12 border border-gray-200 dark:border-dark-border rounded-lg bg-white/80 dark:bg-dark-surface/80 placeholder-gray-400 dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-0 dark:focus:ring-offset-dark-surface transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-dark-secondary transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50/80 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg text-red-600 dark:text-red-400 text-sm" role="alert">
                  {error}
                </div>
              )}

              <div className="animate-fade-in pt-1" style={{ animationDelay: '200ms' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white focus-visible:ring-offset-2"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative animate-fade-in" style={{ animationDelay: '250ms' }} aria-hidden="true">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200/80 dark:border-dark-border/80" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white/70 dark:bg-dark-card/70 text-gray-400 dark:text-dark-muted">or</span>
              </div>
            </div>

            {/* OAuth */}
            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg font-medium text-sm text-gray-700 dark:text-dark-secondary hover:bg-gray-50 dark:hover:bg-dark-hover hover:border-gray-300 dark:hover:border-dark-accent transition-all duration-200 focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white focus-visible:ring-offset-2"
              >
                <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" />
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" />
                  <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z" />
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z" />
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Sign up link */}
            <p className="text-center text-gray-600 dark:text-dark-muted text-sm animate-fade-in" style={{ animationDelay: '350ms' }}>
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold text-gray-900 dark:text-dark-primary hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
