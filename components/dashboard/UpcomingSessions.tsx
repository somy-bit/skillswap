import { Clock, Video, User } from 'lucide-react';
import Link from 'next/link';

export default function UpcomingSessions() {
  const sessions = [
    {
      title: 'React Advanced Patterns',
      mentor: 'John Smith',
      time: 'Today, 2:00 PM',
      duration: '1 hour',
      status: 'starting-soon'
    },
    {
      title: 'Node.js Best Practices',
      mentor: 'Sarah Johnson',
      time: 'Tomorrow, 10:00 AM',
      duration: '45 mins',
      status: 'scheduled'
    },
    {
      title: 'UI/UX Design Review',
      mentor: 'Mike Wilson',
      time: 'Friday, 3:30 PM',
      duration: '30 mins',
      status: 'scheduled'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Sessions</h3>
        <Link 
          href="/dashboard/sessions"
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {sessions.map((session, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  {session.title}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{session.mentor}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{session.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {session.status === 'starting-soon' && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Starting Soon
                  </span>
                )}
                <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Video className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
