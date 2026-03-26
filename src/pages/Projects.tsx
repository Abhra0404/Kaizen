import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { PROJECT_STATUSES } from '@/constants';
import type { Project, ProjectStatus } from '@/types';
import Spinner from '@/components/ui/Spinner';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import ErrorBanner from '@/components/ui/ErrorBanner';

export default function Projects() {
  const { projects, loading, error, clearError, addProject, updateProject, removeProject } = useProjects();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [addForm, setAddForm] = useState({ name: '', description: '', status: 'Planning' as ProjectStatus, progress: 0, team: '', tags: '' });
  const [editForm, setEditForm] = useState({ name: '', description: '', status: 'Planning' as ProjectStatus, progress: 0, team: '', tags: '' });

  const stats = useMemo(() => {
    const total = projects.length;
    const done = projects.filter(p => p.status === 'Done').length;
    const inProgress = projects.filter(p => p.status === 'In Progress').length;
    const avgProgress = total ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / total) : 0;
    return { total, done, inProgress, avgProgress };
  }, [projects]);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProject({
      name: addForm.name,
      description: addForm.description,
      status: addForm.status,
      progress: Math.min(100, Math.max(0, addForm.progress)),
      team: addForm.team.split(',').map(t => t.trim()).filter(Boolean),
      tags: addForm.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setIsAddOpen(false);
    setAddForm({ name: '', description: '', status: 'Planning', progress: 0, team: '', tags: '' });
  };

  const openEditProject = (project: Project) => {
    setEditingProject(project);
    setEditForm({
      name: project.name,
      description: project.description,
      status: project.status,
      progress: project.progress,
      team: project.team.join(', '),
      tags: project.tags.join(', '),
    });
    setIsEditOpen(true);
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    await updateProject(editingProject.id, {
      name: editForm.name,
      description: editForm.description,
      status: editForm.status,
      progress: Math.min(100, Math.max(0, editForm.progress)),
      team: editForm.team.split(',').map(t => t.trim()).filter(Boolean),
      tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setIsEditOpen(false);
    setEditingProject(null);
  };

  if (loading) return <Spinner className="py-12" />;

  return (
    <>
      <PageHeader title="Projects" subtitle="Manage and track all your ongoing projects" />

      <ErrorBanner message={error} onDismiss={clearError} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Projects" value={stats.total} />
        <StatCard label="In Progress" value={stats.inProgress} />
        <StatCard label="Done" value={stats.done} />
        <StatCard label="Avg Progress" value={`${stats.avgProgress}%`} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500 dark:text-dark-muted uppercase tracking-wide">Pipeline</p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-primary">Active Projects</h2>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 text-white rounded-lg border border-black cursor-pointer transition-colors"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-border transition-all hover:shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-primary mb-1">{project.name}</h3>
                <p className="text-sm text-gray-600 dark:text-dark-muted">{project.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEditProject(project)} className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors" aria-label="Edit project">
                  <Pencil size={18} className="text-indigo-600 dark:text-indigo-300" />
                </button>
                <button onClick={() => removeProject(project.id)} className="p-2 rounded-lg bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" aria-label="Delete project">
                  <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold border border-gray-200 dark:border-dark-border text-gray-700 dark:text-dark-secondary bg-gray-50 dark:bg-dark-input">{project.status}</span>
                <span className="text-sm font-semibold text-gray-700 dark:text-dark-secondary">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-input rounded-full h-2">
                <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all" style={{ width: `${project.progress}%` }} />
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-600 dark:text-dark-muted mb-2">Team</p>
              <div className="flex gap-2 flex-wrap">
                {project.team.map((member, idx) => (
                  <div key={idx} className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-semibold">{member[0]}</div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-dark-input text-gray-700 dark:text-dark-secondary rounded-md text-xs font-medium">{tag}</span>
              ))}
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <EmptyState message='No projects yet. Click "New Project" to add one.' className="col-span-full" />
        )}
      </div>

      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="New Project" maxWidth="max-w-2xl">
        <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Name</label>
            <input type="text" required value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent" placeholder="Project name" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Description</label>
            <textarea required value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent" rows={3} placeholder="What is this project about?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Status</label>
            <select value={addForm.status} onChange={(e) => setAddForm({ ...addForm, status: e.target.value as ProjectStatus })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent">
              {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Progress (%)</label>
            <input type="number" min={0} max={100} value={addForm.progress} onChange={(e) => setAddForm({ ...addForm, progress: Number(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent" placeholder="0 - 100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Team (comma separated)</label>
            <input type="text" value={addForm.team} onChange={(e) => setAddForm({ ...addForm, team: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent" placeholder="Alex, Jamie, Sam" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Tags (comma separated)</label>
            <input type="text" value={addForm.tags} onChange={(e) => setAddForm({ ...addForm, tags: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent" placeholder="React, Node.js, MongoDB" />
          </div>
          <div className="md:col-span-2 flex gap-3 pt-2">
            <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-secondary bg-gray-100 dark:bg-dark-input rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900 transition-colors">Save Project</button>
          </div>
        </form>
      </Modal>

      <Modal open={isEditOpen && !!editingProject} onClose={() => { setIsEditOpen(false); setEditingProject(null); }} title="Edit Project" maxWidth="max-w-2xl">
        <form onSubmit={handleUpdateProject} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Name</label>
            <input type="text" required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent" placeholder="Project name" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Description</label>
            <textarea required value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent" rows={3} placeholder="What is this project about?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Status</label>
            <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as ProjectStatus })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent">
              {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Progress (%)</label>
            <input type="number" min={0} max={100} value={editForm.progress} onChange={(e) => setEditForm({ ...editForm, progress: Number(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent" placeholder="0 - 100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Team (comma separated)</label>
            <input type="text" value={editForm.team} onChange={(e) => setEditForm({ ...editForm, team: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent" placeholder="Alex, Jamie, Sam" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-secondary mb-2">Tags (comma separated)</label>
            <input type="text" value={editForm.tags} onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-dark-primary focus:ring-2 focus:ring-gray-400 focus:border-transparent" placeholder="React, Node.js, MongoDB" />
          </div>
          <div className="md:col-span-2 flex gap-3 pt-2">
            <button type="button" onClick={() => { setIsEditOpen(false); setEditingProject(null); }} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-secondary bg-gray-100 dark:bg-dark-input rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">Save Changes</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
