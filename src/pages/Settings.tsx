import { User, Lock, Bell, Palette, LogOut, Sparkles, Camera, Trash2, Monitor, Clock, Shield, Code } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import * as leetcodeService from '@/services/leetcode';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { THEME_OPTIONS } from '@/constants';
import type { ThemeOption } from '@/constants';
import PageHeader from '@/components/ui/PageHeader';
import Modal from '@/components/ui/Modal';

type Item = {
  label: string;
  value: string;
  toggle?: boolean;
  editable?: boolean;
  link?: boolean;
  select?: boolean;
  options?: string[];
  changePassword?: boolean;
};

type Section = {
  title: string;
  icon: LucideIcon;
  items: Item[];
  blurred?: boolean;
};

export default function Settings() {
  const { signOut, user } = useAuth();
  const { theme: currentTheme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const userFullName: string = user?.user_metadata?.full_name ?? '';
  const userEmail: string = user?.email ?? '';
  const userUsername: string = user?.user_metadata?.username ?? userEmail.split('@')[0];
  const avatarUrl: string = user?.user_metadata?.avatar_url ?? '';
  const initial = (userFullName || userEmail).charAt(0).toUpperCase();

  const [avatarPreview, setAvatarPreview] = useState<string>(avatarUrl);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // LeetCode integration state
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [lcSaving, setLcSaving] = useState(false);
  const [lcSaved, setLcSaved] = useState(false);

  useEffect(() => {
    if (user) {
      leetcodeService.getLeetCodeUsername(user.id).then(setLeetcodeUsername);
    }
  }, [user]);

  useEffect(() => {
    setAvatarPreview(user?.user_metadata?.avatar_url ?? '');
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Image must be under 2MB.');
      return;
    }
    setAvatarError('');
    setAvatarUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true });
    if (uploadError) {
      setAvatarError(uploadError.message);
      setAvatarUploading(false);
      return;
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    const publicUrl = data.publicUrl + '?t=' + Date.now();
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl },
    });
    if (updateError) {
      setAvatarError(updateError.message);
    } else {
      setAvatarPreview(publicUrl);
    }
    setAvatarUploading(false);
  };

  const handleRemoveAvatar = async () => {
    if (!user) return;
    setAvatarUploading(true);
    await supabase.auth.updateUser({ data: { avatar_url: '' } });
    setAvatarPreview('');
    setAvatarUploading(false);
  };

  const handleSaveLeetCode = async () => {
    if (!user) return;
    setLcSaving(true);
    try {
      await leetcodeService.saveLeetCodeUsername(user.id, leetcodeUsername);
      setLcSaved(true);
      setTimeout(() => setLcSaved(false), 2000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('LeetCode save error:', err);
      alert(`Failed to save LeetCode username: ${msg}`);
    }
    setLcSaving(false);
  };

  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    setSections([
      {
        title: 'Account Settings',
        icon: User,
        items: [
          { label: 'Email', value: userEmail, editable: true },
          { label: 'Username', value: userUsername, editable: true },
          { label: 'Full Name', value: userFullName, editable: true },
        ],
      },
      {
        title: 'Privacy & Security',
        icon: Lock,
        items: [
          { label: 'Password', value: '••••••••', changePassword: true },
          { label: 'Login Activity', value: 'View details', link: true },
        ],
      },
      {
        title: 'Preferences',
        icon: Palette,
        items: [
          { label: 'Theme', value: currentTheme, select: true, options: [...THEME_OPTIONS] },
        ],
      },
      {
        title: 'Notifications',
        icon: Bell,
        blurred: true,
        items: [
          { label: 'Email Notifications', value: 'On', toggle: true },
          { label: 'Daily Summary', value: 'Off', toggle: true },
          { label: 'Streak Reminders', value: 'On', toggle: true },
          { label: 'Goal Updates', value: 'On', toggle: true },
        ],
      },
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentTheme]);
  
  const [editing, setEditing] = useState<{ sectionIdx: number; itemIdx: number; value: string } | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [showLoginActivity, setShowLoginActivity] = useState(false);
  type SessionInfo = { browser: string; os: string; lastSignIn: string; expiresAt: string; };
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);

  const parseUserAgent = (ua: string) => {
    let browser = 'Unknown Browser';
    if (ua.includes('Edg/')) browser = 'Microsoft Edge';
    else if (ua.includes('OPR/') || ua.includes('Opera')) browser = 'Opera';
    else if (ua.includes('Chrome/')) browser = 'Google Chrome';
    else if (ua.includes('Firefox/')) browser = 'Mozilla Firefox';
    else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari';

    let os = 'Unknown OS';
    if (ua.includes('Windows NT')) os = 'Windows';
    else if (ua.includes('Mac OS X')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    return { browser, os };
  };

  const handleViewLoginActivity = async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    const { browser, os } = parseUserAgent(navigator.userAgent);
    setSessionInfo({
      browser,
      os,
      lastSignIn: user?.last_sign_in_at
        ? new Date(user.last_sign_in_at).toLocaleString()
        : 'Unknown',
      expiresAt: session?.expires_at
        ? new Date(session.expires_at * 1000).toLocaleString()
        : 'Unknown',
    });
    setShowLoginActivity(true);
  };

  const closePasswordModal = () => {
    setChangingPassword(false);
    setPasswordForm({ newPassword: '', confirmPassword: '' });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword });
    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess('Password updated successfully!');
      setTimeout(closePasswordModal, 1500);
    }
  };

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

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    const field = sections[editing.sectionIdx]?.items[editing.itemIdx]?.label;
    const newValue = editing.value.trim();
    if (!newValue) return;

    try {
      if (field === 'Email') {
        const { error } = await supabase.auth.updateUser({ email: newValue });
        if (error) { alert(error.message); return; }
      } else if (field === 'Full Name') {
        const { error } = await supabase.auth.updateUser({ data: { full_name: newValue } });
        if (error) { alert(error.message); return; }
      } else if (field === 'Username') {
        const { error } = await supabase.auth.updateUser({ data: { username: newValue } });
        if (error) { alert(error.message); return; }
      }

      setSections(prev => prev.map((section, sIdx) => {
        if (sIdx !== editing.sectionIdx) return section;
        return {
          ...section,
          items: section.items.map((item, iIdx) => iIdx === editing.itemIdx ? { ...item, value: newValue } : item),
        };
      }));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save changes');
    }
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
      setTheme(value as ThemeOption);
    }
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      <div className="flex flex-col gap-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-dark-primary">Profile & Controls</h2>
          <p className="text-sm text-gray-500 dark:text-dark-muted">Update information and safeguards</p>
        </div>

        {/* Profile Picture Card */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border transition-colors">
          <div className="p-4 px-6 border-b border-gray-200 dark:border-dark-border flex items-center gap-3">
            <Camera size={20} className="text-gray-700 dark:text-dark-secondary" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-primary">Profile Picture</h3>
          </div>
          <div className="p-6 flex items-center gap-6">
            {/* Avatar display */}
            <div className="relative shrink-0">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-gray-200 dark:ring-dark-border"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center text-white dark:text-gray-900 text-2xl font-bold">
                  {initial}
                </div>
              )}
              {avatarUploading && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-600 dark:text-dark-muted">Upload a photo. Max size 2MB.</p>
              {avatarError && <p className="text-xs text-red-500">{avatarError}</p>}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Camera size={15} />
                  {avatarPreview ? 'Change Photo' : 'Upload Photo'}
                </button>
                {avatarPreview && (
                  <button
                    onClick={handleRemoveAvatar}
                    disabled={avatarUploading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </div>
        </div>
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div key={idx} className="relative rounded-xl overflow-hidden border border-gray-100 dark:border-dark-border shadow-sm">
              {/* Header – never blurred */}
              <div className="bg-white dark:bg-dark-card p-4 px-6 border-b border-gray-200 dark:border-dark-border flex items-center gap-3">
                <Icon size={20} className="text-gray-700 dark:text-dark-secondary" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-primary">{section.title}</h3>
              </div>

              {section.blurred ? (
                <div className="relative">
                  <div className="blur-sm pointer-events-none select-none">
                    <div className="bg-white dark:bg-dark-card p-6 flex flex-col gap-6">
                      {section.items.map((item, itemIdx) => (
                        <div key={itemIdx} className={`flex items-center justify-between pb-6 ${
                          itemIdx === section.items.length - 1 ? '' : 'border-b border-gray-100 dark:border-dark-border'
                        }`}>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-dark-muted mb-1">{item.label}</p>
                            <p className="text-sm text-gray-900 dark:text-dark-primary font-medium">{item.value}</p>
                          </div>
                          {item.toggle && (
                            <div className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                              item.value === 'On' ? 'bg-green-500' : 'bg-gray-300'
                            }`}>
                              <span className={`inline-block h-4 w-4 rounded-full bg-white transform ${
                                item.value === 'On' ? 'translate-x-5' : 'translate-x-1'
                              }`}></span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30 dark:bg-dark-surface/30 backdrop-blur-[2px]">
                    <div className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-full shadow-lg">
                      <Bell size={16} className="shrink-0" />
                      <span className="text-sm font-semibold tracking-wide">Coming Soon</span>
                    </div>
                  </div>
                </div>
              ) : (
              <div className="bg-white dark:bg-dark-card p-6 flex flex-col gap-6">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className={`flex items-center justify-between pb-6 ${
                    itemIdx === section.items.length - 1 ? '' : 'border-b border-gray-100 dark:border-dark-border'
                  }`}>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-muted mb-1">{item.label}</p>
                      {item.link ? (
                        <button
                          onClick={handleViewLoginActivity}
                          className="text-sm text-gray-700 dark:text-dark-secondary hover:text-gray-900 dark:hover:text-dark-primary bg-transparent border-none p-0 cursor-pointer font-medium">
                          {item.value}
                        </button>
                      ) : item.editable || item.select ? (
                        <p className="text-sm text-gray-900 dark:text-dark-primary font-medium">{item.value}</p>
                      ) : (
                        <p className="text-sm text-gray-900 dark:text-dark-primary font-medium">{item.value}</p>
                      )}
                    </div>

                    {item.toggle && (
                      <button
                        onClick={() => handleToggle(idx, itemIdx)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full border-none cursor-pointer transition-colors ${
                          item.value === 'On' || item.value === 'Enabled' ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-300 dark:bg-dark-accent'
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
                        className="text-sm text-gray-700 dark:text-dark-secondary hover:text-gray-900 dark:hover:text-dark-primary bg-transparent border-none cursor-pointer font-medium"
                      >
                        Edit
                      </button>
                    )}

                    {item.changePassword && (
                      <button
                        onClick={() => setChangingPassword(true)}
                        className="text-sm text-gray-700 dark:text-dark-secondary hover:text-gray-900 dark:hover:text-dark-primary bg-transparent border-none cursor-pointer font-medium"
                      >
                        Change
                      </button>
                    )}

                    {item.select && (
                      <select
                        className="text-sm text-gray-700 dark:text-dark-secondary bg-transparent cursor-pointer font-medium border border-gray-200 dark:border-dark-border rounded-md px-2 py-1 dark:bg-dark-input"
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
              )}
            </div>
          );
        })}

        {/* AI Settings – Coming Soon */}
        <div className="relative rounded-xl overflow-hidden border border-gray-100 dark:border-dark-border shadow-sm">
          {/* Header – not blurred */}
          <div className="bg-white dark:bg-dark-card p-4 px-6 border-b border-gray-200 dark:border-dark-border flex items-center gap-3">
            <Sparkles size={20} className="text-gray-700 dark:text-dark-secondary" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-primary">AI Settings</h3>
          </div>
          {/* Blurred body */}
          <div className="relative">
            <div className="blur-sm pointer-events-none select-none">
              <div className="bg-white dark:bg-dark-card p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-dark-border">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-dark-muted mb-1">AI Model</p>
                    <p className="text-sm text-gray-900 dark:text-dark-primary font-medium">GPT-4o</p>
                  </div>
                  <select className="text-sm text-gray-700 dark:text-dark-secondary bg-transparent font-medium border border-gray-200 dark:border-dark-border rounded-md px-2 py-1 dark:bg-dark-input">
                    <option>GPT-4o</option>
                  </select>
                </div>
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-dark-border">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-dark-muted mb-1">Smart Suggestions</p>
                    <p className="text-sm text-gray-900 dark:text-dark-primary font-medium">On</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500">
                    <span className="inline-block h-4 w-4 rounded-full bg-white transform translate-x-5"></span>
                  </div>
                </div>
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-dark-border">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-dark-muted mb-1">Daily AI Summary</p>
                    <p className="text-sm text-gray-900 dark:text-dark-primary font-medium">Off</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300">
                    <span className="inline-block h-4 w-4 rounded-full bg-white transform translate-x-1"></span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-dark-muted mb-1">Personalized Insights</p>
                    <p className="text-sm text-gray-900 dark:text-dark-primary font-medium">On</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500">
                    <span className="inline-block h-4 w-4 rounded-full bg-white transform translate-x-5"></span>
                  </div>
                </div>
              </div>
            </div>
            {/* Coming Soon overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30 dark:bg-dark-surface/30 backdrop-blur-[2px]">
              <div className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-full shadow-lg">
                <Sparkles size={16} className="shrink-0" />
                <span className="text-sm font-semibold tracking-wide">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>

        {/* Integrations – LeetCode */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border transition-colors">
          <div className="p-4 px-6 border-b border-gray-200 dark:border-dark-border flex items-center gap-3">
            <Code size={20} className="text-gray-700 dark:text-dark-secondary" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-primary">Integrations</h3>
          </div>
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">
              LeetCode Username
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={leetcodeUsername}
                onChange={(e) => setLeetcodeUsername(e.target.value)}
                placeholder="e.g. uwi"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
              <button
                onClick={handleSaveLeetCode}
                disabled={lcSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900 disabled:opacity-50 transition-colors"
              >
                {lcSaved ? 'Saved' : 'Save'}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-dark-muted">
              Your public LeetCode username. Go to DSA page and click "Sync LeetCode" to import your solved problems.
            </p>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-6 transition-colors">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-400 mb-2">Danger Zone</h3>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg border-none cursor-pointer transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg border-none cursor-pointer transition-colors"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  alert('Account deletion requires a server-side admin function. Please contact support to proceed.');
                }
              }}
            >
              <LogOut size={18} />
              Delete Account
            </button>
          </div>
        </div>

        {showLoginActivity && sessionInfo && (
          <Modal open={showLoginActivity && !!sessionInfo} onClose={() => setShowLoginActivity(false)} title="Login Activity">
              <div className="flex items-center gap-3 mb-6 -mt-4">
                  <Shield size={22} className="text-gray-700 dark:text-dark-secondary" />
              </div>

              <div className="mb-4 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">1 active session</span>
              </div>

              <div className="rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
                <div className="bg-gray-50 dark:bg-dark-input/50 px-4 py-2 border-b border-gray-200 dark:border-dark-border">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-dark-muted">Current Session</p>
                </div>
                <div className="p-4 flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <Monitor size={18} className="text-gray-500 dark:text-dark-muted mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-dark-muted">Device</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-dark-primary">{sessionInfo.browser} on {sessionInfo.os}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-gray-500 dark:text-dark-muted mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-dark-muted">Last Sign In</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-dark-primary">{sessionInfo.lastSignIn}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield size={18} className="text-gray-500 dark:text-dark-muted mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-dark-muted">Session Expires</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-dark-primary">{sessionInfo.expiresAt}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowLoginActivity(false)}
                className="mt-5 w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-secondary bg-gray-100 dark:bg-dark-input rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover transition-colors"
              >
                Close
              </button>
          </Modal>
        )}

        <Modal open={changingPassword} onClose={closePasswordModal} title="Change Password">
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    placeholder="Enter new password"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>

                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                {passwordSuccess && <p className="text-sm text-green-600">{passwordSuccess}</p>}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={closePasswordModal} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-secondary bg-gray-100 dark:bg-dark-input rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900 transition-colors">Update Password</button>
                </div>
              </form>
        </Modal>

        <Modal open={!!editing} onClose={() => setEditing(null)} title={`Edit ${editing ? sections[editing.sectionIdx]?.items[editing.itemIdx]?.label ?? 'Value' : 'Value'}`}>
              <form onSubmit={handleEditSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">
                    {editing ? sections[editing.sectionIdx]?.items[editing.itemIdx]?.label ?? 'Value' : 'Value'}
                  </label>
                  <input
                    type="text"
                    value={editing?.value ?? ''}
                    onChange={(e) => setEditing(curr => curr ? { ...curr, value: e.target.value } : null)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setEditing(null)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-secondary bg-gray-100 dark:bg-dark-input rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900 transition-colors">Save</button>
                </div>
              </form>
        </Modal>
      </div>
    </>
  );
}
