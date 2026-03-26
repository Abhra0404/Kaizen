import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import Spinner from '@/components/ui/Spinner';
import Overview from '@/pages/Overview';
import DSA from '@/pages/DSA';
import Habits from '@/pages/Habits';
import Projects from '@/pages/Projects';
import Goals from '@/pages/Goals';
import Settings from '@/pages/Settings';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import AuthCallback from '@/pages/AuthCallback';

function App() {
  const location = useLocation();
  const { user, loading } = useAuth();

  // Detect when Supabase redirects back with auth params in the URL fragment.
  // Supabase appends tokens to the URL hash (e.g. #access_token=… or #error=…).
  // We intercept them here before the router processes the path.
  const rawHash = window.location.hash;
  const rawSearch = window.location.search;
  const isAuthRedirect =
    rawHash.includes('access_token=') ||
    rawHash.includes('error_code=') ||
    rawHash.includes('error=access_denied') ||
    rawSearch.includes('access_token=') ||
    rawSearch.includes('error_code=') ||
    rawSearch.includes('error=access_denied');

  if (isAuthRedirect) {
    return <AuthCallback />;
  }

  const isLanding = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';

  if (loading) {
    return <Spinner className="min-h-screen" />;
  }

  if (isLanding) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Protected: redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/dashboard" element={<Overview />} />
        <Route path="/dsa" element={<DSA />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
