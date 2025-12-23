import { ChevronDown } from 'lucide-react';

export default function ChartCard() {
  const data = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 78 },
    { day: 'Wed', value: 45 },
    { day: 'Thu', value: 88 },
    { day: 'Fri', value: 92 },
    { day: 'Sat', value: 58 },
    { day: 'Sun', value: 72 },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>Weekly Activity</h3>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', fontSize: '14px', color: '#4b5563', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Last 7 days
          <ChevronDown size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', height: '256px' }}>
        {data.map((item, index) => (
          <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '100%', backgroundColor: '#f3f4f6', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', position: 'relative', height: '100%' }}>
              <div style={{ width: '100%', background: 'linear-gradient(to top, #3b82f6, #60a5fa)', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', position: 'absolute', bottom: 0, height: `${(item.value / maxValue) * 100}%` }}></div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280' }}>{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
