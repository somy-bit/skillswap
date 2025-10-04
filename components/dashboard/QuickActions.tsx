import { Calendar, MessageSquare, Users, Clock, Video, Settings } from 'lucide-react';
import Link from 'next/link';

export default function QuickActions() {
  const actions = [
    { icon: Calendar, label: 'Schedule Session', href: '/dashboard/timetable', color: 'bg-blue-500' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages', color: 'bg-green-500' },
    { icon: Users, label: 'Find Mentors', href: '/dashboard', color: 'bg-purple-500' },
    { icon: Clock, label: 'My Sessions', href: '/dashboard/sessions', color: 'bg-orange-500' },
    { icon: Video, label: 'Join Call', href: '/dashboard/sessions', color: 'bg-red-500' },
    { icon: Settings, label: 'Profile', href: '/dashboard/profile', color: 'bg-gray-500' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
          >
            <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 text-center">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
