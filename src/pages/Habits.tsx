import { Plus, Check } from 'lucide-react';

export default function Habits() {
  const habits = [
    { id: 1, name: 'Morning Coding Session', frequency: 'Daily', streak: 12, color: 'bg-blue-100', borderColor: 'border-blue-300' },
    { id: 2, name: 'Read Technical Articles', frequency: 'Daily', streak: 8, color: 'bg-green-100', borderColor: 'border-green-300' },
    { id: 3, name: 'Exercise', frequency: 'Daily', streak: 5, color: 'bg-orange-100', borderColor: 'border-orange-300' },
    { id: 4, name: 'Review Notes', frequency: 'Weekly', streak: 4, color: 'bg-teal-100', borderColor: 'border-teal-300' },
    { id: 5, name: 'Contribute to Open Source', frequency: 'Weekly', streak: 2, color: 'bg-purple-100', borderColor: 'border-purple-300' },
    { id: 6, name: 'Project Work', frequency: 'Daily', streak: 15, color: 'bg-pink-100', borderColor: 'border-pink-300' },
  ];

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '8px' }}>My Habits</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>Build and track consistent habits for growth</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0, marginBottom: '4px' }}>Active Habits</p>
          <p style={{ fontSize: '30px', fontWeight: 700, color: '#111827', margin: 0 }}>18</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0, marginBottom: '4px' }}>Current Streak</p>
          <p style={{ fontSize: '30px', fontWeight: 700, color: '#111827', margin: 0 }}>15 days</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0, marginBottom: '4px' }}>Completion Rate</p>
          <p style={{ fontSize: '30px', fontWeight: 700, color: '#111827', margin: 0 }}>89%</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
          <Plus size={18} />
          New Habit
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px' }}>
        {habits.map((habit) => (
          <div key={habit.id} style={{ backgroundColor: '#eef2ff', border: '2px solid #c7d2fe', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0, marginBottom: '4px' }}>{habit.name}</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{habit.frequency}</p>
              </div>
              <button style={{ padding: '8px', backgroundColor: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                <Check size={20} color="#9ca3af" />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>{habit.streak}</span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>day streak</span>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '4px' }}>
              {[...Array(7)].map((_, i) => (
                <div key={i} style={{ flex: 1, height: '8px', borderRadius: '9999px', backgroundColor: i < 5 ? '#22c55e' : '#d1d5db' }}></div>
              ))}
            </div>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, marginTop: '8px' }}>Last 7 days completion</p>
          </div>
        ))}
      </div>
    </>
  );
}
