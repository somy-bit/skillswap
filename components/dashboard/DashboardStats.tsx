'use client';
import { useStats } from '@/lib/hooks/useStats';
import { StatCard } from './StatCard';
import { Users, Calendar, MessageSquare, TrendingUp } from 'lucide-react';

export function DashboardStats() {
  const { data, loading, error } = useStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
        <p className="text-red-600">Failed to load stats: {error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Connections"
        value={data.totalConnections}
        icon={<Users size={24} />}
      />
      <StatCard
        title="Sessions This Week"
        value={data.thisWeekSessions}
        icon={<Calendar size={24} />}
        trend={{
          value: Math.abs(data.sessionDifference),
          isPositive: data.sessionDifference >= 0
        }}
      />
      <StatCard
        title="Messages"
        value={data.unreadMessages}
        icon={<MessageSquare size={24} />}
      />
      <StatCard
        title="Weekly Growth"
        value={data.sessionDifference >= 0 ? `+${data.sessionDifference}` : data.sessionDifference}
        icon={<TrendingUp size={24} />}
      />
    </div>
  );
}
