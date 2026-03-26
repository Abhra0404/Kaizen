import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AuthLayout from '@/components/layout/AuthLayout';

/**
 * Handles Supabase email confirmation redirects.
 *
 * After the user clicks the confirmation link, Supabase redirects to the app's
 * origin with tokens or error info appended to the URL fragment (#access_token=…).
 * We also handle query-string params (?access_token=…) as a fallback.
 */
export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;

    // Parse params from whichever location Supabase used (fragment or query string)
    let params: URLSearchParams;
    if (hash.includes('access_token=') || hash.includes('error=') || hash.includes('error_code=')) {
      params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
    } else {
      params = new URLSearchParams(search);
    }

    const error = params.get('error');
    const errorCode = params.get('error_code');
    const accessToken = params.get('access_token');

    if (error) {
      if (errorCode === 'otp_expired') {
        setErrorMessage(
          'Your confirmation link has expired. Confirmation links are only valid for 24 hours. Please sign up again to receive a new link.'
        );
      } else if (error === 'access_denied') {
        setErrorMessage(
          'Access denied. The confirmation link is invalid or has already been used.'
        );
      } else {
        setErrorMessage(params.get('error_description')?.replace(/\+/g, ' ') ?? 'An error occurred during email confirmation.');
      }
      setStatus('error');
      // Clean up the URL
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }

    if (accessToken) {
      // supabase-js already detected the session from the URL on createClient,
      // but we call getSession here to ensure it is set before redirecting.
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setStatus('success');
          // Clean up the URL and navigate to dashboard
          setTimeout(() => {
            window.location.replace('/dashboard');
          }, 1500);
        } else {
          setErrorMessage('Could not verify your session. Please try logging in.');
          setStatus('error');
        }
      });
      return;
    }

    // No recognised params – redirect to login
    window.location.replace('/login');
  }, []);

  return (
    <AuthLayout showBackLink={false} showFooter={false}>
      <div className="w-full max-w-md text-center space-y-6">
        {status === 'loading' && (
          <>
            <Loader size={48} className="mx-auto animate-spin text-gray-400" />
            <h1 className="text-2xl font-bold">Confirming your email…</h1>
            <p className="text-gray-500 dark:text-dark-muted">Please wait a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={48} className="mx-auto text-green-500" />
            <h1 className="text-2xl font-bold">Email confirmed!</h1>
            <p className="text-gray-500 dark:text-dark-muted">Taking you to your dashboard…</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle size={48} className="mx-auto text-red-500" />
            <h1 className="text-2xl font-bold">Confirmation failed</h1>
            <p className="text-gray-600 dark:text-dark-muted">{errorMessage}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                to="/signup"
                className="px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Sign up again
              </Link>
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-dark-border text-sm font-medium hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
              >
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
