import { User, Lock, Bell, Palette, LogOut, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type Item = {
  label: string;
  value: string;
  toggle?: boolean;
  editable?: boolean;
  link?: boolean;
  select?: boolean;
  options?: string[];
};

type Section = {
  title: string;
  icon: LucideIcon;
  items: Item[];
};

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'Light';
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') return 'Dark';
  if (stored === 'light') return 'Light';
  return 'System';
};

const applyTheme = (theme: string) => {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;

  const setDark = () => {
    root.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  };

  const setLight = () => {
    root.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  };

  if (theme === 'Dark') {
    setDark();
  } else if (theme === 'Light') {
    setLight();
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      setDark();
    } else {
      setLight();
    }
    localStorage.setItem('theme', 'system');
  }
};

export default function Settings() {
  const initialTheme = getInitialTheme();
  const [sections, setSections] = useState<Section[]>([
    {
      title: 'Account Settings',
      icon: User,
      items: [
        { label: 'Email', value: 'abhra.j04@gmail.com', editable: true },
        { label: 'Username', value: 'abhra0404', editable: true },
        { label: 'Full Name', value: 'Abhra', editable: true },
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
        { label: 'Theme', value: initialTheme, select: true, options: ['Light', 'Dark', 'System'] },
        { label: 'Language', value: 'English', select: true, options: ['English', 'Spanish', 'French', 'German'] },
        { label: 'Timezone', value: 'EST (UTC -5)', select: true, options: ['EST (UTC -5)', 'PST (UTC -8)', 'UTC', 'IST (UTC +5:30)'] },
      ],
    },
  ]);

  useEffect(() => {
    applyTheme(initialTheme);
  }, [initialTheme]);
  
  const [editing, setEditing] = useState<{ sectionIdx: number; itemIdx: number; value: string } | null>(null);

  const handleToggle = (sectionIdx: number, itemIdx: number) => {
    setSections(prev => prev.map((section, sIdx) => {
      if (sIdx !== sectionIdx) return section;
      return {
        ...section,
        items: section.items.map((item, iIdx) => {
          if (iIdx !== itemIdx) return item;
          const nextValue = (item.value === 'On' || item.value === 'Enabled') ? 'Off' : 'On';
          return { ...item, value: nextValue };
        }),
      };
    }));
  };

  const startEdit = (sectionIdx: number, itemIdx: number, value: string) => {
    setEditing({ sectionIdx, itemIdx, value });
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSections(prev => prev.map((section, sIdx) => {
      if (sIdx !== editing.sectionIdx) return section;
      return {
        ...section,
        items: section.items.map((item, iIdx) => iIdx === editing.itemIdx ? { ...item, value: editing.value } : item),
      };
    }));
    setEditing(null);
  };

  const handleSelectChange = (sectionIdx: number, itemIdx: number, value: string) => {
    setSections(prev => prev.map((section, sIdx) => {
      if (sIdx !== sectionIdx) return section;
      return {
        ...section,
        items: section.items.map((item, iIdx) => iIdx === itemIdx ? { ...item, value } : item),
      };
    }));

    if (sections[sectionIdx]?.title === 'Preferences' && sections[sectionIdx]?.items[itemIdx]?.label === 'Theme') {
      applyTheme(value);
    }
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col gap-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Profile & Controls</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update information and safeguards</p>
        </div>
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
              <div className="p-4 px-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <Icon size={20} className="text-gray-700 dark:text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h3>
              </div>

              <div className="p-6 flex flex-col gap-6">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className={`flex items-center justify-between pb-6 ${
                    itemIdx === section.items.length - 1 ? '' : 'border-b border-gray-100 dark:border-gray-700'
                  }`}>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{item.label}</p>
                      {item.link ? (
                        <button className="text-sm text-blue-500 hover:text-blue-600 bg-transparent border-none p-0 cursor-pointer font-medium">
                          {item.value}
                        </button>
                      ) : item.editable || item.select ? (
                        <p className="text-sm text-gray-900 dark:text-white font-medium">{item.value}</p>
                      ) : (
                        <p className="text-sm text-gray-900 dark:text-white font-medium">{item.value}</p>
                      )}
                    </div>

                    {item.toggle && (
                      <button
                        onClick={() => handleToggle(idx, itemIdx)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full border-none cursor-pointer transition-colors ${
                          item.value === 'On' || item.value === 'Enabled' ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        aria-label="Toggle setting"
                      >
                        <span className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform ${
                          item.value === 'On' || item.value === 'Enabled' ? 'translate-x-5' : 'translate-x-1'
                        }`}></span>
                      </button>
                    )}

                    {item.editable && (
                      <button
                        onClick={() => startEdit(idx, itemIdx, item.value)}
                        className="text-sm text-blue-500 hover:text-blue-600 bg-transparent border-none cursor-pointer font-medium"
                      >
                        Edit
                      </button>
                    )}

                    {item.select && (
                      <select
                        className="text-sm text-gray-700 dark:text-gray-300 bg-transparent cursor-pointer font-medium border border-gray-200 dark:border-gray-600 rounded-md px-2 py-1 dark:bg-gray-700"
                        value={item.value}
                        onChange={(e) => handleSelectChange(idx, itemIdx, e.target.value)}
                      >
                        {(item.options || [item.value]).map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-6 transition-colors">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-400 mb-2">Danger Zone</h3>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg border-none cursor-pointer transition-colors">
            <LogOut size={18} />
            Delete Account
          </button>
        </div>

        {editing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Value</h3>
                <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleEditSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Value</label>
                  <input
                    type="text"
                    value={editing.value}
                    onChange={(e) => setEditing(curr => curr ? { ...curr, value: e.target.value } : null)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
