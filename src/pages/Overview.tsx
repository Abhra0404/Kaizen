import MetricCard from '../components/MetricCard';
import ChartCard from '../components/ChartCard';
import ProgressCircle from '../components/ProgressCircle';
import ProjectsList from '../components/ProjectsList';
import WeeklyProgress from '../components/WeeklyProgress';
import HighlightCard from '../components/HighlightCard';
import { Code2, CheckCircle, Target, FolderKanban } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Problem = { solved?: boolean; date?: string };
type Habit = { streak?: number };
type Goal = { completed?: boolean };
type Project = { name?: string; status?: string; progress?: number };

export default function Overview() {
  const [mode, setMode] = useState<'real' | 'sample'>('sample');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const safeParse = (key: string) => {
      try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : [];
      } catch {
        return [];
      }
    };

    setProblems(safeParse('kaizen-dsa-problems'));
    setHabits(safeParse('kaizen-habits'));
    setGoals(safeParse('kaizen-goals'));
    setProjects(safeParse('kaizen-projects'));
  }, []);

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

  const datasets = useMemo(() => ({
    real: {
      metrics: (() => {
        const solved = problems.filter((p) => p.solved).length;
        const activeHabits = habits.length;
        const goalsInProgress = goals.filter((g) => !g.completed).length;
        const activeProjects = projects.length;
        return [
          { icon: Code2, value: String(solved), label: 'Total Problems Solved' },
          { icon: CheckCircle, value: String(activeHabits), label: 'Active Habits' },
          { icon: Target, value: String(goalsInProgress), label: 'Goals In Progress' },
          { icon: FolderKanban, value: String(activeProjects), label: 'Active Projects' },
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
        color: '#3b82f6',
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
        { icon: Code2, value: '120', label: 'Total Problems Solved' },
        { icon: CheckCircle, value: '6', label: 'Active Habits' },
        { icon: Target, value: '3', label: 'Goals In Progress' },
        { icon: FolderKanban, value: '4', label: 'Active Projects' },
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
        { name: 'Sample Mobile App', status: 'In Progress', progress: 40, color: '#3b82f6' },
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
  }), [goals, habits, problems, projects, getLast4Weeks, getLast7DaysPoints]);

  const current = datasets[mode];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, Abhra</h1>
          <p className="text-gray-600 dark:text-gray-400">Here's your productivity overview</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            <button
              onClick={() => setMode('real')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                mode === 'real' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Real
            </button>
            <button
              onClick={() => setMode('sample')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                mode === 'sample' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'text-gray-700 dark:text-gray-300'
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
            iconBgColor="bg-gray-100 dark:bg-gray-800"
            iconColor="text-gray-700 dark:text-gray-300"
            primary={idx === 0}
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
