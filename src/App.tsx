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
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f9fafb' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar />

        <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          <div style={{ maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto' }}>
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
