import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Overview from './pages/Overview';
import DSA from './pages/DSA';
import Habits from './pages/Habits';
import Projects from './pages/Projects';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const location = useLocation();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLanding = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-white rounded-full animate-spin" />
      </div>
    );
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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar onToggleSidebar={() => setSidebarOpen(o => !o)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <Routes>
              <Route path="/dashboard" element={<Overview />} />
              <Route path="/dsa" element={<DSA />} />
              <Route path="/habits" element={<Habits />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
