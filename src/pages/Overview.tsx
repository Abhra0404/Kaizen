import MetricCard from '../components/MetricCard';
import ChartCard from '../components/ChartCard';
import ProgressCircle from '../components/ProgressCircle';
import ProjectsList from '../components/ProjectsList';
import WeeklyProgress from '../components/WeeklyProgress';
import HighlightCard from '../components/HighlightCard';
import { Code2, CheckCircle, Target, FolderKanban } from 'lucide-react';

export default function Overview() {
  return (
    <>
      <div className="mb-10">
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">Overview</p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Welcome back, Abhra</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Here&apos;s what&apos;s happening with your progress today</p>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Priority Metrics</p>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Today&apos;s Summary</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Kept to four for quick scanning</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-10">
        <MetricCard
          icon={Code2}
          value="290"
          label="Total Problems Solved"
          iconBgColor="bg-blue-50"
          iconColor="text-blue-500"
          primary
        />
        <MetricCard
          icon={CheckCircle}
          value="18"
          label="Active Habits"
          iconBgColor="bg-green-50"
          iconColor="text-green-500"
        />
        <MetricCard
          icon={Target}
          value="8"
          label="Goals In Progress"
          iconBgColor="bg-orange-50"
          iconColor="text-orange-500"
        />
        <MetricCard
          icon={FolderKanban}
          value="12"
          label="Active Projects"
          iconBgColor="bg-teal-50"
          iconColor="text-teal-500"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Trends</p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Progress Overview</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Weekly activity vs. goal completion</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="col-span-2">
          <ChartCard />
        </div>
        <div>
          <ProgressCircle />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Deep Dive</p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Weekly Insights</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Streaks, projects, and highlights together</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <WeeklyProgress />
        </div>
        <div>
          <ProjectsList />
        </div>
        <div>
          <HighlightCard />
        </div>
      </div>
    </>
  );
}
