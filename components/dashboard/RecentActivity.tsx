import { Calendar, MessageSquare, UserPlus, Video } from 'lucide-react';

export default function RecentActivity() {
  const activities = [
    {
      icon: Calendar,
      title: 'Session scheduled with John Doe',
      time: '2 hours ago',
      color: 'bg-blue-500'
    },
    {
      icon: MessageSquare,
      title: 'New message from Sarah Wilson',
      time: '4 hours ago',
      color: 'bg-green-500'
    },
    {
      icon: UserPlus,
      title: 'New connection request',
      time: '1 day ago',
      color: 'bg-purple-500'
    },
    {
      icon: Video,
      title: 'Completed session: React Basics',
      time: '2 days ago',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${activity.color}`}>
              <activity.icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
