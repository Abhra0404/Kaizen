import MetricCard from '@/components/dashboard/MetricCard';
import ChartCard from '@/components/dashboard/ChartCard';
import DifficultyBreakdown from '@/components/dashboard/DifficultyBreakdown';
import HabitStreaks from '@/components/dashboard/HabitStreaks';
import GoalsProgress from '@/components/dashboard/GoalsProgress';
import ProjectsList from '@/components/dashboard/ProjectsList';
import RecentActivity from '@/components/dashboard/RecentActivity';
import TopicHeatmap from '@/components/dashboard/TopicHeatmap';
import { Code2, CheckCircle, Target, FolderKanban } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Problem, Habit, Goal, Project } from '@/types';
import { SELECT_COLUMNS } from '@/constants';
import Spinner from '@/components/ui/Spinner';
import ErrorBanner from '@/components/ui/ErrorBanner';

type TimeRange = '7d' | '30d' | 'all';

export default function Overview() {
  const { user } = useAuth();
  const firstName = (user?.user_metadata?.full_name ?? user?.email ?? 'there').split(' ')[0];

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    setFetchError(null);
    Promise.all([
      supabase.from('dsa_problems').select(SELECT_COLUMNS.DSA_PROBLEMS).eq('user_id', user.id),
      supabase.from('habits').select(SELECT_COLUMNS.HABITS).eq('user_id', user.id),
      supabase.from('goals').select(SELECT_COLUMNS.GOALS).eq('user_id', user.id),
      supabase.from('projects').select(SELECT_COLUMNS.PROJECTS).eq('user_id', user.id),
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

  // ── Computed values ──────────────────────────────────────

  const solvedProblems = useMemo(() => problems.filter(p => p.solved), [problems]);

  const difficultyBreakdown = useMemo(() => {
    const counts = { easy: 0, medium: 0, hard: 0 };
    solvedProblems.forEach(p => {
      if (p.difficulty === 'Easy') counts.easy++;
      else if (p.difficulty === 'Medium') counts.medium++;
      else if (p.difficulty === 'Hard') counts.hard++;
    });
    return counts;
  }, [solvedProblems]);

  const topicCounts = useMemo(() => {
    const map = new Map<string, number>();
    solvedProblems.forEach(p => {
      const topic = p.topic || 'Other';
      map.set(topic, (map.get(topic) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([topic, count]) => ({ topic, count }));
  }, [solvedProblems]);

  const recentActivity = useMemo(() => {
    return [...solvedProblems]
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      })
      .slice(0, 10);
  }, [solvedProblems]);

  // ── DSA Chart data with time range toggle ────────────────

  const chartData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const msPerDay = 86400000;

    if (timeRange === '7d') {
      const labels: { day: string; value: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today.getTime() - i * msPerDay);
        labels.push({ day: d.toLocaleDateString(undefined, { weekday: 'short' }), value: 0 });
      }
      solvedProblems.forEach(p => {
        const d = new Date(p.date);
        d.setHours(0, 0, 0, 0);
        const diff = Math.floor((today.getTime() - d.getTime()) / msPerDay);
        if (diff >= 0 && diff <= 6) {
          labels[6 - diff].value++;
        }
      });
      const total = labels.reduce((s, l) => s + l.value, 0);
      return { points: labels, totalLabel: `Last 7 days: ${total} problems` };
    }

    if (timeRange === '30d') {
      const labels: { day: string; value: number }[] = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(today.getTime() - i * msPerDay);
        const month = d.toLocaleDateString(undefined, { month: 'short' });
        labels.push({ day: `${d.getDate()}\n${month}`, value: 0 });
      }
      solvedProblems.forEach(p => {
        const d = new Date(p.date);
        d.setHours(0, 0, 0, 0);
        const diff = Math.floor((today.getTime() - d.getTime()) / msPerDay);
        if (diff >= 0 && diff <= 29) {
          labels[29 - diff].value++;
        }
      });
      const total = labels.reduce((s, l) => s + l.value, 0);
      return { points: labels, totalLabel: `Last 30 days: ${total} problems` };
    }

    // 'all' — group by month
    if (solvedProblems.length === 0) {
      return { points: [] as { day: string; value: number }[], totalLabel: 'All time: 0 problems' };
    }
    const monthMap = new Map<string, number>();
    solvedProblems.forEach(p => {
      const d = new Date(p.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthMap.set(key, (monthMap.get(key) ?? 0) + 1);
    });
    const sortedMonths = [...monthMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    const points = sortedMonths.map(([key, value]) => {
      const [year, month] = key.split('-');
      const monthName = new Date(Number(year), Number(month) - 1).toLocaleDateString(undefined, { month: 'short' });
      return { day: `${monthName} ${year.slice(2)}`, value };
    });
    return { points, totalLabel: `All time: ${solvedProblems.length} problems` };
  }, [solvedProblems, timeRange]);

  // ── Metric card trends ───────────────────────────────────

  const dsaTrend = useMemo(() => {
    const today = new Date();
    const msPerDay = 86400000;
    const thisWeek = solvedProblems.filter(p => {
      const diff = Math.floor((today.getTime() - new Date(p.date).getTime()) / msPerDay);
      return diff >= 0 && diff < 7;
    }).length;
    const lastWeek = solvedProblems.filter(p => {
      const diff = Math.floor((today.getTime() - new Date(p.date).getTime()) / msPerDay);
      return diff >= 7 && diff < 14;
    }).length;
    if (lastWeek === 0 && thisWeek === 0) return { value: '0%', direction: 'neutral' as const };
    if (lastWeek === 0) return { value: `+${thisWeek}`, direction: 'up' as const };
    const pct = Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
    return pct >= 0
      ? { value: `+${pct}%`, direction: 'up' as const }
      : { value: `${pct}%`, direction: 'down' as const };
  }, [solvedProblems]);

  const completedGoals = goals.filter(g => g.completed).length;
  const totalGoals = goals.length;

  const metricsList = useMemo(() => [
    {
      icon: Code2,
      value: String(solvedProblems.length),
      label: 'DSA Solved',
      trend: dsaTrend,
    },
    {
      icon: CheckCircle,
      value: String(habits.length),
      label: 'Active Habits',
      trend: { value: `${habits.length} total`, direction: 'neutral' as const },
    },
    {
      icon: Target,
      value: `${completedGoals}/${totalGoals}`,
      label: 'Goals Done',
      trend: completedGoals > 0
        ? { value: `${Math.round((completedGoals / Math.max(totalGoals, 1)) * 100)}%`, direction: 'up' as const }
        : { value: `${totalGoals - completedGoals} open`, direction: 'neutral' as const },
    },
    {
      icon: FolderKanban,
      value: String(projects.filter(p => p.status !== 'Done').length),
      label: 'Active Projects',
      trend: { value: `${projects.length} total`, direction: 'neutral' as const },
    },
  ], [solvedProblems, habits, completedGoals, totalGoals, projects, dsaTrend]);

  // ── Render ───────────────────────────────────────────────

  if (loading) {
    return <Spinner className="h-64" />;
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-8">
      <ErrorBanner message={fetchError} onDismiss={() => setFetchError(null)} />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-primary mb-1">Welcome back, {firstName}</h1>
          <p className="text-gray-600 dark:text-dark-muted">Here's your productivity overview</p>
        </div>
        <span className="text-sm text-gray-500 dark:text-dark-muted bg-gray-100 dark:bg-dark-input px-3 py-1.5 rounded-lg font-medium">
          {dateStr}
        </span>
      </div>

      {/* Row 1: 6 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsList.map((m, idx) => (
          <MetricCard
            key={m.label}
            icon={m.icon}
            value={m.value}
            label={m.label}
            iconBgColor="bg-gray-100 dark:bg-dark-card"
            iconColor="text-gray-700 dark:text-dark-secondary"
            primary={idx === 0}
            trend={m.trend}
          />
        ))}
      </div>

      {/* Row 2: DSA Activity (2/3) + Difficulty Breakdown (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="DSA Activity"
            subtitle="Problems solved over time"
            points={chartData.points}
            totalLabel={chartData.totalLabel}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </div>
        <div>
          <DifficultyBreakdown
            easy={difficultyBreakdown.easy}
            medium={difficultyBreakdown.medium}
            hard={difficultyBreakdown.hard}
          />
        </div>
      </div>

      {/* Row 3: Habit Streaks (1/2) + Goals Progress (1/2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HabitStreaks habits={habits} />
        <GoalsProgress goals={goals} />
      </div>

      {/* Row 4: Active Projects + Recent Activity + Topic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProjectsList
          projects={projects.map(p => ({
            name: p.name ?? 'Untitled Project',
            status: p.status ?? 'In Progress',
            progress: Math.min(100, Math.max(0, Number(p.progress ?? 0))),
            color: '#10b981',
          }))}
          title="Active Projects"
        />
        <RecentActivity items={recentActivity} />
        <TopicHeatmap topics={topicCounts} />
      </div>
    </div>
  );
}
