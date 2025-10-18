import QuickActions from './QuickActions';
import UpcomingSessions from './UpcomingSessions';
import SkillsOverview from './SkillsOverview';
import RecentActivity from './RecentActivity';

export default function DashboardContent() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
      {/* Left Column */}
      <div className='lg:col-span-2 space-y-6'>
        <QuickActions />
        <UpcomingSessions />
      </div>
      
      {/* Right Column */}
      <div className='space-y-6'>
        <SkillsOverview />
        <RecentActivity />
      </div>
    </div>
  );
}
