import { Link } from 'react-router-dom';
import { Mail, Clock, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import AuthLayout from '@/components/layout/AuthLayout';

const RATE_LIMIT_COOLDOWN = 60;

function isRateLimitError(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes('rate limit') ||
    lower.includes('too many') ||
    lower.includes('over_email_send_rate_limit')
  );
}

export default function Signup() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startCooldown = () => {
    setCooldown(RATE_LIMIT_COOLDOWN);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          cooldownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isSupabaseConfigured) {
      setError('App is not configured properly. Environment variables are missing. Contact the site administrator.');
      return;
    }
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(email.trim(), password, name.trim());
      if (error) {
        if (isRateLimitError(error.message)) {
          setError('Too many signup attempts. Please wait before trying again.');
          startCooldown();
        } else {
          setError(error.message);
        }
      } else {
        setSubmittedEmail(email.trim());
        setSubmitted(true);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')) {
        setError('Network error: unable to reach the server. Check your internet connection.');
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        {submitted ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-dark-card flex items-center justify-center">
                <Mail size={36} className="text-gray-700 dark:text-dark-secondary" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-primary">Check your email</h2>
              <p className="text-gray-600 dark:text-dark-muted">We sent a verification link to</p>
              <p className="font-semibold text-gray-900 dark:text-dark-primary">{submittedEmail}</p>
              <p className="text-sm text-gray-500 dark:text-dark-muted pt-1">
                Click the link in the email to verify your account, then sign in.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-block w-full px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white focus-visible:ring-offset-2"
            >
              Go to Sign In
            </Link>
            <p className="text-xs text-gray-400 dark:text-dark-border">
              Didn&apos;t receive it? Check your spam folder.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <h1 className="text-4xl font-bold">Get started</h1>
              <p className="text-gray-600 dark:text-dark-muted">Create your account to start tracking progress</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-required="true"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface placeholder-gray-400 dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-0 dark:focus:ring-offset-dark-surface transition-all"
                />
              </div>

              <div className="space-y-2">
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
                  className="w-full px-4 py-3 border border-gray-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface placeholder-gray-400 dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-0 dark:focus:ring-offset-dark-surface transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-required="true"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface placeholder-gray-400 dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-0 dark:focus:ring-offset-dark-surface transition-all"
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
                {password.length > 0 && password.length < 6 && (
                  <p className="text-xs text-gray-500 dark:text-dark-muted">Minimum 6 characters</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    aria-required="true"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface placeholder-gray-400 dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-0 dark:focus:ring-offset-dark-surface transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-dark-secondary transition-colors"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <p className="text-xs text-red-500 dark:text-red-400">Passwords do not match</p>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg text-red-600 dark:text-red-400 text-sm space-y-1" role="alert">
                  <p>{error}</p>
                  {cooldown > 0 && (
                    <p className="flex items-center gap-1.5 font-medium">
                      <Clock size={13} className="shrink-0" />
                      Try again in {cooldown}s
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || cooldown > 0}
                className="w-full px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white focus-visible:ring-offset-2"
              >
                {loading ? 'Creating account...' : cooldown > 0 ? `Wait ${cooldown}s` : 'Create account'}
              </button>
            </form>

            <div className="relative" aria-hidden="true">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-dark-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-dark-bg text-gray-600 dark:text-dark-muted">or</span>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-gray-600 dark:text-dark-muted text-sm">Already have an account?</p>
              <Link
                to="/login"
                className="inline-block px-6 py-2 border-2 border-gray-300 dark:border-dark-border text-gray-900 dark:text-dark-primary rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white focus-visible:ring-offset-2"
              >
                Sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
