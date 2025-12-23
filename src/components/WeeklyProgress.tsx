import { TrendingUp } from 'lucide-react';

export default function WeeklyProgress() {
  const weeklyData = [
    { week: 'Week 1', value: 45 },
    { week: 'Week 2', value: 58 },
    { week: 'Week 3', value: 52 },
    { week: 'Week 4', value: 73 },
  ];

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '24px', margin: 0 }}>DSA Progress</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ position: 'relative', height: '128px' }}>
          <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 400 120">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            <path
              d="M 20 90 L 120 65 L 220 75 L 380 25"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {[20, 120, 220, 380].map((x, i) => (
              <circle
                key={i}
                cx={x}
                cy={[90, 65, 75, 25][i]}
                r="5"
                fill="white"
                stroke="url(#lineGradient)"
                strokeWidth="3"
              />
            ))}
          </svg>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
          {weeklyData.map((item, index) => (
            <div key={index}>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', margin: 0 }}>{item.week}</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{item.value}</p>
            </div>
          ))}
        </div>

        <div style={{ paddingTop: '16px', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
            <TrendingUp size={18} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>+28% this month</span>
          </div>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>290 problems solved</span>
        </div>
      </div>
    </div>
  );
}
