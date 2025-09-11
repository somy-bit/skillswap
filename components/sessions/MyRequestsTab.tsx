'use client';

import { Session } from '@/types/type';
import { Send } from 'lucide-react';
import { SessionCard } from './SessionCard';

interface MyRequestsTabProps {
  sessions: Session[];
  onCancel: (sessionId: string) => void;
}

export const MyRequestsTab: React.FC<MyRequestsTabProps> = ({
  sessions,
  onCancel
}) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 animate-in bounce-in">
        <div className="relative">
          <Send className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No requests sent</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Sessions you've requested will appear here
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
          role="mentee"
          index={index}
          onAction={() => {}}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
};
