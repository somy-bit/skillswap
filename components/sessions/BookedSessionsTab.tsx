'use client';

import { Session } from '@/types/type';
import { Calendar } from 'lucide-react';
import { SessionCard } from './SessionCard';

interface BookedSessionsTabProps {
  sessions: Session[];
  onAction: (sessionId: string, action: 'accept' | 'reject' | 'cancel' | 'delete' | 'archive') => void;

}

export const BookedSessionsTab: React.FC<BookedSessionsTabProps> = ({
  sessions,
  onAction,
 
}) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 animate-in bounce-in">
        <div className="relative">
          <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-75"></div>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No booked sessions yet</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Sessions where you're the mentor will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session, index) => (
        <SessionCard
          key={session.id}
          session={session}
          role="mentor"
          index={index}
          onAction={onAction}
          
        />
      ))}
    </div>
  );
};
