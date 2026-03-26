import MetricCard from '@/components/dashboard/MetricCard';
import ChartCard from '@/components/dashboard/ChartCard';
import ProgressCircle from '@/components/dashboard/ProgressCircle';
import ProjectsList from '@/components/dashboard/ProjectsList';
import WeeklyProgress from '@/components/dashboard/WeeklyProgress';
import HighlightCard from '@/components/dashboard/HighlightCard';
import { Code2, CheckCircle, Target, FolderKanban } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { PartialProblem, PartialHabit, PartialGoal, PartialProject } from '@/types';
import Spinner from '@/components/ui/Spinner';
import ErrorBanner from '@/components/ui/ErrorBanner';

type Problem = PartialProblem;
type Habit = PartialHabit;
type Goal = PartialGoal;
type Project = PartialProject;

export default function Overview() {
  const { user } = useAuth();
  const firstName = (user?.user_metadata?.full_name ?? user?.email ?? 'there').split(' ')[0];

  const [mode, setMode] = useState<'real' | 'sample'>('real');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    setFetchError(null);
    Promise.all([
      supabase.from('dsa_problems').select('solved, date').eq('user_id', user.id),
      supabase.from('habits').select('streak').eq('user_id', user.id),
      supabase.from('goals').select('completed').eq('user_id', user.id),
      supabase.from('projects').select('name, status, progress').eq('user_id', user.id),
    ]).then(([dsa, hab, gol, proj]) => {
      if (cancelled) return;
      const errors = [dsa.error, hab.error, gol.error, proj.error].filter(Boolean);
      if (errors.length > 0) {
        setFetchError(errors.map(e => e!.message).join('; '));
      }
      setProblems((dsa.data as Problem[]) ?? []);
      setHabits((hab.data as Habit[]) ?? []);
      setGoals((gol.data as Goal[]) ?? []);
      setProjects((proj.data as Project[]) ?? []);
      setLoading(false);
    }).catch((err) => {
      if (cancelled) return;
      setFetchError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [user]);

  const getLast7DaysPoints = useMemo(() => {
    const today = new Date();
    const labels: { day: string; value: number }[] = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      labels.push({ day: d.toLocaleDateString(undefined, { weekday: 'short' }), value: 0 });
    }

    problems.forEach((p) => {
      if (!p?.date) return;
      const date = new Date(p.date);
      const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= 6) {
        const idx = 6 - diffDays;
        labels[idx].value += 1;
      }
    });
    return labels;
  }, [problems]);

  const getLast4Weeks = useMemo(() => {
    const today = new Date();
    const weeks: { week: string; value: number }[] = [];
    for (let i = 3; i >= 0; i -= 1) {
      weeks.push({ week: `Week ${4 - i}`, value: 0 });
    }
    problems.forEach((p) => {
      if (!p?.date) return;
      const date = new Date(p.date);
      const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      const weekIndex = Math.floor(diffDays / 7);
      if (weekIndex >= 0 && weekIndex <= 3) {
        const idx = 3 - weekIndex;
        weeks[idx].value += 1;
      }
    });
    return weeks;
  }, [problems]);

  const datasets = useMemo(() => {
    // Week-over-week helpers (uses date field on dsa_problems)
    const today = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;
    const solvedThisWeek = problems.filter(p => {
      if (!p?.date || !p.solved) return false;
      const diff = Math.floor((today.getTime() - new Date(p.date).getTime()) / msPerDay);
      return diff >= 0 && diff < 7;
    }).length;
    const solvedLastWeek = problems.filter(p => {
      if (!p?.date || !p.solved) return false;
      const diff = Math.floor((today.getTime() - new Date(p.date).getTime()) / msPerDay);
      return diff >= 7 && diff < 14;
    }).length;
    const dsaTrend = (() => {
      if (solvedLastWeek === 0 && solvedThisWeek === 0) return { value: '0%', direction: 'neutral' as const };
      if (solvedLastWeek === 0) return { value: `+${solvedThisWeek}`, direction: 'up' as const };
      const pct = Math.round(((solvedThisWeek - solvedLastWeek) / solvedLastWeek) * 100);
      return pct >= 0
        ? { value: `+${pct}%`, direction: 'up' as const }
        : { value: `${pct}%`, direction: 'down' as const };
    })();
    const habitsTrend = habits.length > 0
      ? { value: `${habits.length} total`, direction: 'neutral' as const }
      : { value: '0 total', direction: 'neutral' as const };
    const completedGoals = goals.filter(g => g.completed).length;
    const activeGoals = goals.filter(g => !g.completed).length;
    const goalsTrend = completedGoals > 0
      ? { value: `${completedGoals} done`, direction: 'up' as const }
      : { value: `${activeGoals} open`, direction: 'neutral' as const };
    const projectsTrend = projects.length > 0
      ? { value: `${projects.length} tracked`, direction: 'neutral' as const }
      : { value: '0 tracked', direction: 'neutral' as const };

    return {
    real: {
      metrics: (() => {
        const solved = problems.filter((p) => p.solved).length;
        const activeHabits = habits.length;
        const goalsInProgress = goals.filter((g) => !g.completed).length;
        const activeProjects = projects.length;
        return [
          { icon: Code2, value: String(solved), label: 'Total Problems Solved', trend: dsaTrend },
          { icon: CheckCircle, value: String(activeHabits), label: 'Active Habits', trend: habitsTrend },
          { icon: Target, value: String(goalsInProgress), label: 'Goals In Progress', trend: goalsTrend },
          { icon: FolderKanban, value: String(activeProjects), label: 'Active Projects', trend: projectsTrend },
        ];
      })(),
      chart: {
        points: getLast7DaysPoints,
        totalLabel: `Last 7 days: ${getLast7DaysPoints.reduce((sum, d) => sum + d.value, 0)} problems`,
      },
      progress: (() => {
        const totalGoals = goals.length;
        const completed = goals.filter((g) => g.completed).length;
        const percentage = totalGoals ? Math.round((completed / totalGoals) * 100) : 0;
        const activeSummary = `${completed} / ${totalGoals || 1}`;
        return { percentage, activeSummary, monthDelta: totalGoals ? `+${Math.min(100, Math.max(0, percentage))}%` : '+0%' };
      })(),
      weekly: {
        weeklyData: getLast4Weeks,
        footerSummary: `${problems.length} problems tracked`,
        trendLabel: '+ Live',
      },
      projects: projects.map((p) => ({
        name: p.name ?? 'Untitled Project',
        status: p.status ?? 'In Progress',
        progress: Math.min(100, Math.max(0, Number(p.progress ?? 0))),
        color: '#10b981',
      })),
      highlight: (() => {
        const focusHours = (problems.length * 0.5).toFixed(1);
        const dailyAvg = (problems.length / 7).toFixed(1);
        const bestStreak = habits.reduce((max, h) => Math.max(max, Number(h.streak ?? 0)), 0);
        return {
          title: `${focusHours} hrs`,
          subTitle: 'Estimated Focus Time',
          badge: 'Live',
          stats: [
            { label: 'Daily Avg', value: `${dailyAvg} hrs` },
            { label: 'Best Streak', value: `${bestStreak} days` },
          ],
        };
      })(),
    },
    sample: {
      metrics: [
        { icon: Code2, value: '120', label: 'Total Problems Solved', trend: { value: '+18%', direction: 'up' as const } },
        { icon: CheckCircle, value: '6', label: 'Active Habits', trend: { value: '+2', direction: 'up' as const } },
        { icon: Target, value: '3', label: 'Goals In Progress', trend: { value: '-1', direction: 'down' as const } },
        { icon: FolderKanban, value: '4', label: 'Active Projects', trend: { value: '4 tracked', direction: 'neutral' as const } },
      ],
      chart: {
        points: [
          { day: 'Mon', value: 18 },
          { day: 'Tue', value: 26 },
          { day: 'Wed', value: 12 },
          { day: 'Thu', value: 22 },
          { day: 'Fri', value: 28 },
          { day: 'Sat', value: 15 },
          { day: 'Sun', value: 20 },
        ],
        totalLabel: 'Sample: 141 problems',
      },
      progress: {
        percentage: 42,
        activeSummary: '3 / 7',
        monthDelta: '+5%',
      },
      weekly: {
        weeklyData: [
          { week: 'Week 1', value: 18 },
          { week: 'Week 2', value: 22 },
          { week: 'Week 3', value: 19 },
          { week: 'Week 4', value: 25 },
        ],
        footerSummary: 'Sample: 84 problems',
        trendLabel: '+9% this month',
      },
      projects: [
        { name: 'Sample Landing Page', status: 'Planning', progress: 15, color: '#9ca3af' },
        { name: 'Sample Mobile App', status: 'In Progress', progress: 40, color: '#10b981' },
        { name: 'Sample API', status: 'Review', progress: 70, color: '#10b981' },
      ],
      highlight: {
        title: '22 hrs',
        subTitle: 'Sample Focus Time',
        badge: 'Sample',
        stats: [
          { label: 'Daily Avg', value: '3.1 hrs' },
          { label: 'Streak', value: '4 days' },
        ],
      },
    },
  }; }, [goals, habits, problems, projects, getLast4Weeks, getLast7DaysPoints]);

  const current = datasets[mode];

  if (loading && mode === 'real') {
    return <Spinner className="h-64" />;
  }

  return (
    <div className="space-y-8">
      <ErrorBanner message={fetchError} onDismiss={() => setFetchError(null)} />

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-primary mb-2">Welcome back, {firstName}</h1>
          <p className="text-gray-600 dark:text-dark-muted">Here's your productivity overview</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-1">
            <button
              onClick={() => setMode('real')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                mode === 'real' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'text-gray-700 dark:text-dark-secondary'
              }`}
            >
              Real
            </button>
            <button
              onClick={() => setMode('sample')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                mode === 'sample' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'text-gray-700 dark:text-dark-secondary'
              }`}
            >
              Sample
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {current.metrics.map((metric, idx) => (
          <MetricCard
            key={metric.label}
            icon={metric.icon}
            value={metric.value}
            label={metric.label}
            iconBgColor="bg-gray-100 dark:bg-dark-card"
            iconColor="text-gray-700 dark:text-dark-secondary"
            primary={idx === 0}
            trend={metric.trend}
          />
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <ChartCard
            points={current.chart.points}
            totalLabel={current.chart.totalLabel}
            title="Weekly Activity"
            subtitle={mode === 'sample' ? 'Sample problems solved over time' : 'Problems solved over time'}
          />
        </div>
        <div>
          <ProgressCircle
            percentage={current.progress.percentage}
            activeSummary={current.progress.activeSummary}
            monthDelta={current.progress.monthDelta}
            title="Goals Completion"
          />
        </div>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <WeeklyProgress
            weeklyData={current.weekly.weeklyData}
            footerSummary={current.weekly.footerSummary}
            trendLabel={current.weekly.trendLabel}
          />
        </div>
        <div>
          <ProjectsList
            projects={current.projects}
            title="Active Projects"
          />
        </div>
        <div>
          <HighlightCard
            title={current.highlight.title}
            subTitle={current.highlight.subTitle}
            badge={current.highlight.badge}
            stats={current.highlight.stats}
          />
        </div>
      </div>
    </div>
  );
}
