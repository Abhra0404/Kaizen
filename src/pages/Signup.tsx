import { Link } from 'react-router-dom';
import { Mail, Clock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
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
  const { signUp, signInWithOAuth } = useAuth();
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
          {/* Back arrow */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-primary transition-colors mb-6"
            aria-label="Back to Home"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>

          {submitted ? (
            /* ── Email verification sent ── */
            <div className="text-center space-y-6">
              <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0ms' }}>
                <div className="w-20 h-20 rounded-full bg-gray-100/80 dark:bg-dark-surface/80 border border-gray-200/60 dark:border-dark-border/60 flex items-center justify-center">
                  <Mail size={36} className="text-gray-700 dark:text-dark-secondary" />
                </div>
              </div>
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <h2 className="text-3xl font-bold">
                  <span className="heading-shine">Check your email</span>
                </h2>
                <p className="text-gray-600 dark:text-dark-muted">We sent a verification link to</p>
                <p className="font-semibold text-gray-900 dark:text-dark-primary">{submittedEmail}</p>
                <p className="text-sm text-gray-500 dark:text-dark-muted pt-1">
                  Click the link in the email to verify your account, then sign in.
                </p>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                <Link
                  to="/login"
                  className="inline-block w-full px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white focus-visible:ring-offset-2"
                >
                  Go to Sign In
                </Link>
              </div>
              <p className="text-xs text-gray-400 dark:text-dark-border animate-fade-in" style={{ animationDelay: '300ms' }}>
                Didn&apos;t receive it? Check your spam folder.
              </p>
            </div>
          ) : (
            /* ── Signup form ── */
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center animate-fade-in" style={{ animationDelay: '0ms' }}>
                <h1 className="text-3xl font-bold">
                  <span className="heading-shine">Get started</span>
                </h1>
                <p className="mt-1 text-gray-600 dark:text-dark-muted text-sm">Create your account to start tracking progress</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="space-y-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
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
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-dark-border rounded-lg bg-white/80 dark:bg-dark-surface/80 placeholder-gray-400 dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-0 dark:focus:ring-offset-dark-surface transition-all"
                  />
                </div>

                <div className="space-y-1 animate-fade-in" style={{ animationDelay: '150ms' }}>
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

                <div className="space-y-1 animate-fade-in" style={{ animationDelay: '200ms' }}>
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
                  {password.length > 0 && password.length < 6 && (
                    <p className="text-xs text-gray-500 dark:text-dark-muted">Minimum 6 characters</p>
                  )}
                </div>

                <div className="space-y-1 animate-fade-in" style={{ animationDelay: '250ms' }}>
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
                      className="w-full px-4 py-2.5 pr-12 border border-gray-200 dark:border-dark-border rounded-lg bg-white/80 dark:bg-dark-surface/80 placeholder-gray-400 dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-0 dark:focus:ring-offset-dark-surface transition-all"
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
                  <div className="p-3 bg-red-50/80 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg text-red-600 dark:text-red-400 text-sm space-y-1" role="alert">
                    <p>{error}</p>
                    {cooldown > 0 && (
                      <p className="flex items-center gap-1.5 font-medium">
                        <Clock size={13} className="shrink-0" />
                        Try again in {cooldown}s
                      </p>
                    )}
                  </div>
                )}

                <div className="animate-fade-in pt-1" style={{ animationDelay: '300ms' }}>
                  <button
                    type="submit"
                    disabled={loading || cooldown > 0}
                    className="w-full px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white focus-visible:ring-offset-2"
                  >
                    {loading ? 'Creating account...' : cooldown > 0 ? `Wait ${cooldown}s` : 'Create account'}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="relative animate-fade-in" style={{ animationDelay: '350ms' }} aria-hidden="true">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200/80 dark:border-dark-border/80" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white/70 dark:bg-dark-card/70 text-gray-400 dark:text-dark-muted">or</span>
                </div>
              </div>

              {/* OAuth */}
              <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
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

              {/* Sign in link */}
              <p className="text-center text-gray-600 dark:text-dark-muted text-sm animate-fade-in" style={{ animationDelay: '450ms' }}>
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-gray-900 dark:text-dark-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
