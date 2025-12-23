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
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '8px' }}>Welcome back, Abhra</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>Here's what's happening with your progress today</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '24px', marginBottom: '32px' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ gridColumn: 'span 2' }}>
          <ChartCard />
        </div>
        <div>
          <ProgressCircle />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px' }}>
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
