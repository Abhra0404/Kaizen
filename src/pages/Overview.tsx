import MetricCard from '../components/MetricCard';
import ChartCard from '../components/ChartCard';
import ProgressCircle from '../components/ProgressCircle';
import ProjectsList from '../components/ProjectsList';
import WeeklyProgress from '../components/WeeklyProgress';
import HighlightCard from '../components/HighlightCard';
import { Code2, CheckCircle, Target, FolderKanban } from 'lucide-react';

export default function Overview() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, Abhra</h1>
          <p className="text-gray-600 dark:text-gray-400">Here's your productivity overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
            Download Report
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-sm hover:shadow-md">
            Create New
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Code2}
          value="290"
          label="Total Problems Solved"
          iconBgColor="bg-gray-100 dark:bg-gray-800"
          iconColor="text-gray-700 dark:text-gray-300"
          primary
        />
        <MetricCard
          icon={CheckCircle}
          value="18"
          label="Active Habits"
          iconBgColor="bg-gray-100 dark:bg-gray-800"
          iconColor="text-gray-700 dark:text-gray-300"
        />
        <MetricCard
          icon={Target}
          value="8"
          label="Goals In Progress"
          iconBgColor="bg-gray-100 dark:bg-gray-800"
          iconColor="text-gray-700 dark:text-gray-300"
        />
        <MetricCard
          icon={FolderKanban}
          value="12"
          label="Active Projects"
          iconBgColor="bg-gray-100 dark:bg-gray-800"
          iconColor="text-gray-700 dark:text-gray-300"
        />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <ChartCard />
        </div>
        <div>
          <ProgressCircle />
        </div>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
    </div>
  );
}
