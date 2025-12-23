import { LayoutDashboard, Code2, CheckCircle, FolderKanban, Target, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', to: '/' },
  { icon: Code2, label: 'DSA', to: '/dsa' },
  { icon: CheckCircle, label: 'Habits', to: '/habits' },
  { icon: FolderKanban, label: 'Projects', to: '/projects' },
  { icon: Target, label: 'Goals', to: '/goals' },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

export default function Sidebar() {
  return (
    <aside style={{
      width: '256px',
      backgroundColor: 'white',
      borderRight: '1px solid #e5e7eb',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>Kaizen</h1>
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Continuous Growth</p>
      </div>

      <nav style={{ flex: 1, padding: '12px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              style={({ isActive }) => ({
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '4px',
                textDecoration: 'none',
                backgroundColor: isActive ? '#eff6ff' : 'transparent',
                color: isActive ? '#2563eb' : '#4b5563',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500
              })}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div style={{
        padding: '16px',
        margin: '12px',
        background: 'linear-gradient(to bottom right, #eff6ff, #f0fdf4)',
        borderRadius: '8px',
        border: '1px solid #dbeafe'
      }}>
        <p style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Track Your Progress</p>
        <p style={{ fontSize: '12px', color: '#6b7280' }}>Stay consistent and achieve your goals</p>
      </div>
    </aside>
  );
}
