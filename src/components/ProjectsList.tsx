export default function ProjectsList() {
  const projects = [
    { name: 'E-commerce Platform', status: 'In Progress', progress: 65, color: '#3b82f6' },
    { name: 'Mobile App Design', status: 'Review', progress: 90, color: '#10b981' },
    { name: 'API Integration', status: 'In Progress', progress: 45, color: '#3b82f6' },
    { name: 'Database Migration', status: 'Planning', progress: 20, color: '#9ca3af' },
  ];

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>Active Projects</h3>
        <button style={{ fontSize: '14px', color: '#2563eb', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '500' }}>View All</button>
      </div>

      <div>
        {projects.map((project, index) => (
          <div key={index} style={{ paddingBottom: '16px', borderBottom: index < projects.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>{project.name}</h4>
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', margin: '4px 0 0 0' }}>{project.status}</p>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>{project.progress}%</span>
            </div>
            <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px' }}>
              <div style={{ backgroundColor: project.color, height: '8px', borderRadius: '9999px', width: `${project.progress}%`, transition: 'all 0.3s' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
