import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import Overview from './pages/Overview';
import DSA from './pages/DSA';
import Habits from './pages/Habits';
import Projects from './pages/Projects';
import Goals from './pages/Goals';
import Settings from './pages/Settings';

function App() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/dsa" element={<DSA />} />
              <Route path="/habits" element={<Habits />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
