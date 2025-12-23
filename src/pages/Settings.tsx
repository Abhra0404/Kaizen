import { User, Lock, Bell, Palette, LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Item = {
  label: string;
  value: string;
  toggle?: boolean;
  editable?: boolean;
  link?: boolean;
  select?: boolean;
};

type Section = {
  title: string;
  icon: LucideIcon;
  items: Item[];
};

export default function Settings() {
  const settingSections: Section[] = [
    {
      title: 'Account Settings',
      icon: User,
      items: [
        { label: 'Email', value: 'alex.chen@email.com', editable: true },
        { label: 'Username', value: 'alexchen', editable: true },
        { label: 'Full Name', value: 'Alex Chen', editable: true },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: Lock,
      items: [
        { label: 'Two-Factor Authentication', value: 'Enabled', toggle: true },
        { label: 'Password', value: '••••••••', editable: true },
        { label: 'Login Activity', value: 'View details', link: true },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Email Notifications', value: 'On', toggle: true },
        { label: 'Daily Summary', value: 'Off', toggle: true },
        { label: 'Streak Reminders', value: 'On', toggle: true },
        { label: 'Goal Updates', value: 'On', toggle: true },
      ],
    },
    {
      title: 'Preferences',
      icon: Palette,
      items: [
        { label: 'Theme', value: 'Light', select: true },
        { label: 'Language', value: 'English', select: true },
        { label: 'Timezone', value: 'EST (UTC -5)', select: true },
      ],
    },
  ];

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '8px' }}>Settings</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>Manage your account and preferences</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '48rem' }}>
        {settingSections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div key={idx} style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={20} />
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>{section.title}</h3>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '24px', borderBottom: itemIdx === section.items.length - 1 ? '0' : '1px solid #f3f4f6' }}>
                    <div>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, marginBottom: '4px' }}>{item.label}</p>
                      {item.link ? (
                        <button style={{ fontSize: '14px', color: '#3b82f6', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontWeight: 500 }}>
                          {item.value}
                        </button>
                      ) : item.editable || item.select ? (
                        <p style={{ fontSize: '14px', color: '#111827', fontWeight: 500, margin: 0 }}>{item.value}</p>
                      ) : (
                        <p style={{ fontSize: '14px', color: '#111827', fontWeight: 500, margin: 0 }}>{item.value}</p>
                      )}
                    </div>

                    {item.toggle && (
                      <button style={{ position: 'relative', display: 'inline-flex', height: '24px', width: '44px', alignItems: 'center', borderRadius: '9999px', backgroundColor: '#10b981', border: 'none', cursor: 'pointer' }}>
                        <span style={{ display: 'inline-block', height: '16px', width: '16px', borderRadius: '9999px', backgroundColor: 'white', marginLeft: '4px' }}></span>
                      </button>
                    )}

                    {item.editable && (
                      <button style={{ fontSize: '14px', color: '#3b82f6', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                        Edit
                      </button>
                    )}

                    {item.select && (
                      <select style={{ fontSize: '14px', color: '#374151', background: 'transparent', cursor: 'pointer', fontWeight: 500, border: '1px solid #e5e7eb', borderRadius: '6px', padding: '4px 8px' }}>
                        <option>{item.value}</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div style={{ backgroundColor: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#7f1d1d', margin: 0, marginBottom: '8px' }}>Danger Zone</h3>
          <p style={{ fontSize: '14px', color: '#b91c1c', margin: 0, marginBottom: '16px' }}>Once you delete your account, there is no going back. Please be certain.</p>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#dc2626', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            <LogOut size={18} />
            Delete Account
          </button>
        </div>
      </div>
    </>
  );
}
