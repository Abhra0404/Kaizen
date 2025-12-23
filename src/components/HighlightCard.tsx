import { Award } from 'lucide-react';

export default function HighlightCard() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #3b82f6, #10b981)',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      color: 'white'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Award size={24} color="white" />
        </div>
        <span style={{ fontSize: '12px', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '4px 12px', borderRadius: '9999px', color: 'white' }}>
          This Week
        </span>
      </div>

      <h3 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '8px', margin: '0 0 8px 0', color: 'white' }}>47 hrs</h3>
      <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '16px', margin: '0 0 16px 0' }}>Total Focus Time</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
        <div>
          <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>Daily Avg</p>
          <p style={{ fontSize: '18px', fontWeight: '600', color: 'white', margin: 0 }}>6.7 hrs</p>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>Streak</p>
          <p style={{ fontSize: '18px', fontWeight: '600', color: 'white', margin: 0 }}>12 days</p>
        </div>
      </div>
    </div>
  );
}
