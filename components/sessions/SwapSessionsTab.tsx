'use client';

import { Session } from '@/types/type';
import { ArrowRightLeft } from 'lucide-react';
import { SessionCard } from './SessionCard';
import { CountdownTimer } from './CountdownTimer';
import { getTimeUntilSession } from '@/lib/sessionUtils';

interface SwapSessionsTabProps {
  sessions: Session[];
  userId: string;
  onAction: (sessionId: string, action:  'accept' | 'reject' | 'cancel' | 'delete'|'archive') => void;
}

export const SwapSessionsTab: React.FC<SwapSessionsTabProps> = ({
  sessions,
  userId,
  onAction
}) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 animate-in bounce-in">
        <div className="relative">
          <ArrowRightLeft className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full animate-bounce"></div>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No swap sessions</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Sessions from accepted swap requests will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session, index) => {
        const isCurrentUserMentor = session.mentorId === userId;
        const { canJoin } = getTimeUntilSession(session.date, session.startTime);
        
        return (
          <SessionCard
            key={session.id}
            session={session}
            role={isCurrentUserMentor ? 'mentor' : 'mentee'}
            index={index}
            onAction={onAction}
          >
            <CountdownTimer date={session.date} startTime={session.startTime} />
            
            <button
              disabled={!canJoin}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                canJoin 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {canJoin ? 'Join Session' : 'Session Not Ready'}
            </button>
          </SessionCard>
        );
      })}
    </div>
  );
};
