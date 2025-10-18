import { Users, Calendar, MessageSquare, TrendingUp } from 'lucide-react';
import StatsCard from './StatsCard';

interface StatsData {
  totalConnections: number;
  thisWeekSessions: number;
  sessionDifference: number;
  unreadMessages: number;
  pendingConnectionRequests: number;
}

interface StatsSectionProps {
  stats: StatsData | null;
  loading: boolean;
  error: string | null;
  onConnectionsClick: () => void;
}

export default function StatsSection({ stats, loading, error, onConnectionsClick }: StatsSectionProps) {
  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-32 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-4 bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
        <p className="text-red-600">Failed to load stats</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
      <StatsCard
        title="Total Connections"
        value={stats.totalConnections}
        icon={Users}
        trend={`${stats.totalConnections} profiles`}
        color="bg-blue-500"
        onClick={onConnectionsClick}
        notificationCount={stats.pendingConnectionRequests}
      />
      <StatsCard
        title="Sessions This Week"
        value={stats.thisWeekSessions}
        icon={Calendar}
        trend={`${stats.sessionDifference >= 0 ? '+' : ''}${stats.sessionDifference} from last week`}
        color="bg-green-500"
      />
      <StatsCard
        title="Messages"
        value={stats.unreadMessages}
        icon={MessageSquare}
        trend={`${stats.unreadMessages} unread`}
        color="bg-purple-500"
      />
      <StatsCard
        title="Weekly Growth"
        value={stats.sessionDifference >= 0 ? `+${stats.sessionDifference}` : stats.sessionDifference}
        icon={TrendingUp}
        trend={stats.sessionDifference >= 0 ? "Growing!" : "Keep going!"}
        color="bg-orange-500"
      />
    </div>
  );
}
