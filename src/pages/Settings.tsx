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
        { label: 'Theme', value: 'Light', select: true },
        { label: 'Language', value: 'English', select: true },
        { label: 'Timezone', value: 'EST (UTC -5)', select: true },
      ],
    },
  ];

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
        {settingSections.map((section, idx) => {
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
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500 dark:bg-green-600 border-none cursor-pointer transition-colors">
                        <span className="inline-block h-4 w-4 rounded-full bg-white ml-1"></span>
                      </button>
                    )}

                    {item.editable && (
                      <button className="text-sm text-blue-500 hover:text-blue-600 bg-transparent border-none cursor-pointer font-medium">
                        Edit
                      </button>
                    )}

                    {item.select && (
                      <select className="text-sm text-gray-700 dark:text-gray-300 bg-transparent cursor-pointer font-medium border border-gray-200 dark:border-gray-600 rounded-md px-2 py-1 dark:bg-gray-700">
                        <option>{item.value}</option>
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
      </div>
    </>
  );
}
