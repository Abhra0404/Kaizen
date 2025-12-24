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
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, Abhra</h2>
        <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your progress today</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={Code2}
          value="290"
          label="DSA Problems Solved"
          iconBgColor="bg-blue-50"
          iconColor="text-blue-500"
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

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2">
          <ChartCard />
        </div>
        <div>
          <ProgressCircle />
        </div>
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
