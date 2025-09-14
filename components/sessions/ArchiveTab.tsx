'use client';

import { Session } from '@/types/type';
import { Archive, Calendar, Clock, User, Trash2 } from 'lucide-react';

interface ArchiveTabProps {
  sessions: Session[];
  onDelete: (sessionId: string) => void;
}

export const ArchiveTab: React.FC<ArchiveTabProps> = ({
  sessions,
  onDelete
}) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 animate-in bounce-in">
        <div className="relative">
          <Archive className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No archived sessions</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Cancelled sessions will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session, index) => (
        <div 
          key={session.id}
          className="animate-in fade-in-50 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm font-medium text-red-600">
                Cancelled
              </span>
            </div>
            
            <button
              onClick={() => onDelete(session.id!)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete permanently"
            >
              <Trash2 className="w-4 h-4" />
            </button>
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
              <span>Session cancelled</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            Cancelled on {new Date().toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};
