import { Plus, Trash2 } from 'lucide-react';

export default function Projects() {
  const projects = [
    {
      id: 1,
      name: 'E-Commerce Platform',
      description: 'Full-stack MERN application with payment integration',
      status: 'In Progress',
      progress: 65,
      team: ['Alex', 'Jamie', 'Sam'],
      tags: ['React', 'Node.js', 'MongoDB'],
    },
    {
      id: 2,
      name: 'Mobile App Design',
      description: 'iOS and Android app for habit tracking',
      status: 'Review',
      progress: 90,
      team: ['Alex', 'Taylor'],
      tags: ['Flutter', 'Firebase'],
    },
    {
      id: 3,
      name: 'API Integration',
      description: 'RESTful API with authentication and middleware',
      status: 'In Progress',
      progress: 45,
      team: ['Alex'],
      tags: ['Express.js', 'PostgreSQL'],
    },
    {
      id: 4,
      name: 'Database Migration',
      description: 'Migrating from SQL to NoSQL database',
      status: 'Planning',
      progress: 20,
      team: ['Alex', 'Morgan'],
      tags: ['MongoDB', 'PostgreSQL'],
    },
  ];

  // status pill styling inlined below; removed Tailwind mapping

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '8px' }}>Projects</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>Manage and track all your ongoing projects</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
          <Plus size={18} />
          New Project
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px' }}>
        {projects.map((project) => (
          <div key={project.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6', transition: 'box-shadow 0.2s ease' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0, marginBottom: '4px' }}>{project.name}</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{project.description}</p>
              </div>
              <button style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <Trash2 size={18} color="#9ca3af" />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, border: '1px solid #e5e7eb', color: '#374151', backgroundColor: '#f9fafb' }}>
                  {project.status}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>{project.progress}%</span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px' }}>
                <div
                  style={{ width: `${project.progress}%`, height: '8px', borderRadius: '9999px', background: 'linear-gradient(to right, #3b82f6, #2563eb)', transition: 'width 0.2s ease' }}
                ></div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, marginBottom: '8px' }}>Team</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {project.team.map((member, idx) => (
                  <div
                    key={idx}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 600 }}
                  >
                    {member[0]}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {project.tags.map((tag) => (
                <span key={tag} style={{ padding: '4px 8px', backgroundColor: '#f3f4f6', color: '#374151', borderRadius: '6px', fontSize: '12px', fontWeight: 500 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
