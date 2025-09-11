'use client';

import { Session } from '@/types/type';
import { Calendar, Clock, User } from 'lucide-react';

interface SessionCardProps {
  session: Session;
  role: 'mentor' | 'mentee';
  index: number;
  onAction: (sessionId: string, action:  'accept' | 'reject' | 'cancel' | 'delete') => void;
  onSwapRequest?: (session: Session) => void;
  onCancel?: (sessionId: string) => void;
  children?: React.ReactNode;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  role,
  index,
  onAction,
  onSwapRequest,
  onCancel,
  children
}) => {
  return (
    <div 
      className="animate-in fade-in-50 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            session.status === 'confirmed' ? 'bg-green-500' :
            session.status === 'pending' ? 'bg-yellow-500' :
            session.status === 'cancelled' ? 'bg-red-500' :
            'bg-blue-500'
          }`}></div>
          <span className="text-sm font-medium capitalize text-gray-700">
            {session.status === 'confirmed' && role === 'mentee' ? 'Confirmed - Swap Pending' : session.status}
          </span>
        </div>
        
        <div className="flex space-x-2">
          {role === 'mentor' && session.status === 'pending' && (
            <>
              <button
                onClick={() => onAction(session.id!, 'accept')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => onAction(session.id!, 'reject')}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </>
          )}
          
          {role === 'mentor' && session.status === 'confirmed' && (
            <>
              <button
                onClick={() => onAction(session.id!, 'cancel')}
                className="px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onSwapRequest?.(session)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Swap
              </button>
            </>
          )}
          
          {role === 'mentor' && session.status === 'cancelled' && (
            <button
              onClick={() => onAction(session.id!, 'delete')}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          )}
          
          {role === 'mentee' && session.status === 'confirmed' && (
            <button
              onClick={() => onCancel?.(session.id!)}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2">{session.skill}</h3>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date(session.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>{session.startTime} - {session.endTime}</span>
        </div>
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span>As {role === 'mentor' ? 'Mentor' : 'Mentee'}</span>
        </div>
      </div>
      
      {children}
      
      {session.message && (
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          {session.message}
        </p>
      )}
    </div>
  );
};
