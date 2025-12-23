import { Plus, CheckCircle2, Circle } from 'lucide-react';

export default function Goals() {
  const goals = [
    {
      id: 1,
      title: 'Master DSA',
      description: 'Solve 500 LeetCode problems',
      progress: 58,
      deadline: '2025-06-30',
      category: 'Learning',
      completed: false,
    },
    {
      id: 2,
      title: 'Complete Full-Stack Project',
      description: 'Build and deploy a production-ready application',
      progress: 75,
      deadline: '2025-03-30',
      category: 'Project',
      completed: false,
    },
    {
      id: 3,
      title: 'Improve Communication Skills',
      description: 'Give 5 technical presentations',
      progress: 40,
      deadline: '2025-12-31',
      category: 'Soft Skills',
      completed: false,
    },
    {
      id: 4,
      title: 'Read 12 Technical Books',
      description: 'One book per month on software development',
      progress: 33,
      deadline: '2025-12-31',
      category: 'Reading',
      completed: false,
    },
    {
      id: 5,
      title: 'Build Open Source Portfolio',
      description: 'Contribute to 3 major open source projects',
      progress: 100,
      deadline: '2024-12-20',
      category: 'Open Source',
      completed: true,
    },
  ];

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '8px' }}>Goals</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>Set and achieve meaningful learning goals</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0, marginBottom: '4px' }}>Total Goals</p>
          <p style={{ fontSize: '30px', fontWeight: 700, color: '#111827', margin: 0 }}>8</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0, marginBottom: '4px' }}>In Progress</p>
          <p style={{ fontSize: '30px', fontWeight: 700, color: '#111827', margin: 0 }}>4</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0, marginBottom: '4px' }}>Completed</p>
          <p style={{ fontSize: '30px', fontWeight: 700, color: '#16a34a', margin: 0 }}>1</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0, marginBottom: '4px' }}>Completion Rate</p>
          <p style={{ fontSize: '30px', fontWeight: 700, color: '#111827', margin: 0 }}>59%</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
          <Plus size={18} />
          New Goal
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {goals.map((goal) => (
          <div
            key={goal.id}
            style={{
              backgroundColor: goal.completed ? '#f0fdf4' : 'white',
              border: `1px solid ${goal.completed ? '#bbf7d0' : '#f3f4f6'}`,
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <button style={{ marginTop: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                {goal.completed ? (
                  <CheckCircle2 size={24} color="#16a34a" />
                ) : (
                  <Circle size={24} color="#d1d5db" />
                )}
              </button>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: goal.completed ? '#6b7280' : '#111827', margin: 0, textDecoration: goal.completed ? 'line-through' : 'none' }}>
                      {goal.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, marginTop: '4px' }}>{goal.description}</p>
                  </div>
                  <span style={{ padding: '4px 12px', backgroundColor: '#f3f4f6', color: '#374151', borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}>
                    {goal.category}
                  </span>
                </div>

                <div style={{ marginTop: '16px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#6b7280' }}>Progress</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>{goal.progress}%</span>
                  </div>
                  <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px' }}>
                    <div
                      style={{ height: '8px', borderRadius: '9999px', transition: 'width 0.2s ease', backgroundColor: goal.completed ? '#22c55e' : '#3b82f6', width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, marginTop: '12px' }}>
                  Deadline: <span style={{ fontWeight: 600, color: '#374151' }}>{goal.deadline}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
