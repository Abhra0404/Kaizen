import { Filter, Plus, TrendingUp } from 'lucide-react';

export default function DSA() {
  const problems = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', topic: 'Array', solved: true, date: '2024-12-20' },
    { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', topic: 'Linked List', solved: true, date: '2024-12-19' },
    { id: 3, title: 'Longest Substring', difficulty: 'Medium', topic: 'String', solved: false, date: '2024-12-18' },
    { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topic: 'Array', solved: false, date: '2024-12-17' },
    { id: 5, title: 'Longest Palindromic Substring', difficulty: 'Medium', topic: 'String', solved: true, date: '2024-12-16' },
    { id: 6, title: 'Zigzag Conversion', difficulty: 'Medium', topic: 'String', solved: false, date: '2024-12-15' },
  ];

  const difficultyStyle: Record<string, { bg: string; text: string; border: string }> = {
    Easy: { bg: '#f0fdf4', text: '#047857', border: '#bbf7d0' },
    Medium: { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa' },
    Hard: { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
  };

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '8px' }}>DSA Problems</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>Track your problem-solving progress</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: 0, marginBottom: '4px' }}>Problems Solved</p>
              <p style={{ fontSize: '30px', fontWeight: 700, color: '#111827', margin: 0 }}>142</p>
              <p style={{ fontSize: '12px', color: '#16a34a', margin: 0, marginTop: '8px' }}>+8 this week</p>
            </div>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#f0fdf4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} color="#16a34a" />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0, marginBottom: '4px' }}>Easy</p>
          <p style={{ fontSize: '30px', fontWeight: 700, color: '#111827', margin: 0 }}>58</p>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, marginTop: '8px' }}>41% of total</p>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0, marginBottom: '4px' }}>Medium & Hard</p>
          <p style={{ fontSize: '30px', fontWeight: 700, color: '#111827', margin: 0 }}>84</p>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, marginTop: '8px' }}>59% of total</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>Recent Problems</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '14px', color: '#4b5563', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', cursor: 'pointer' }}>
              <Filter size={16} />
              Filter
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '14px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
              <Plus size={16} />
              Add Problem
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#374151' }}>Problem</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#374151' }}>Difficulty</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#374151' }}>Topic</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#374151' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#374151' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => (
                <tr key={problem.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', color: '#111827', fontWeight: 500 }}>{problem.title}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, border: `1px solid ${difficultyStyle[problem.difficulty].border}`, color: difficultyStyle[problem.difficulty].text, backgroundColor: difficultyStyle[problem.difficulty].bg }}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: '#6b7280' }}>{problem.topic}</td>
                  <td style={{ padding: '16px' }}>
                    {problem.solved ? (
                      <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, backgroundColor: '#f0fdf4', color: '#047857' }}>Solved</span>
                    ) : (
                      <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, backgroundColor: '#f3f4f6', color: '#374151' }}>Pending</span>
                    )}
                  </td>
                  <td style={{ padding: '16px', color: '#6b7280' }}>{problem.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
