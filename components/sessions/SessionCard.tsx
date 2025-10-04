'use client';

import { Session } from '@/types/type';
import { isSessionActive, hasSessionEnded, formatDateForDisplay } from '@/lib/timezone';
import { useState, useEffect } from 'react';
import VideoCall from '../VideoCall';
import { Calendar, Clock, User, Video } from 'lucide-react';

interface SessionCardProps {
  session: Session;
  role: 'mentor' | 'mentee';
  index: number;
  onAction: (sessionId: string, action:  'accept' | 'reject' | 'cancel' | 'delete' | 'archive') => void;
  onCancel?: (sessionId: string) => void;
  children?: React.ReactNode;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  role,
  index,
  onAction,
  onCancel,
  children
}) => {
 
  const [timeStatus, setTimeStatus] = useState<'upcoming' | 'active' | 'ended'>('upcoming');
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // const checkTime = () => {
    //   const now = new Date();
    //   console.log("date of session", session.date);
    //   const sessionDate = new Date(session.date);
    //   const [startHour, startMin] = session.startTime.split(':').map(Number);
    //   const [endHour, endMin] = session.endTime.split(':').map(Number);
      
    //   const startTime = new Date(sessionDate);
    //   startTime.setHours(startHour, startMin, 0, 0);
      
    //   const endTime = new Date(sessionDate);
    //   endTime.setHours(endHour, endMin, 0, 0);
     
    //   if (now >= startTime && now <= endTime) {
    //     setTimeStatus('active');
    //   } else if (now > endTime) {
    //     setTimeStatus('ended');
    //     if (session.status !== 'archived') {
    //       onAction(session.id!, 'archive');
    //     }
    //   } else {
    //     setTimeStatus('upcoming');
    //   }
    // };

  const checkTime = () => {
    if (isSessionActive(session.date, session.startTime, session.endTime)) {
      setTimeStatus("active");
    } else if (hasSessionEnded(session.date, session.endTime)) {
      setTimeStatus("ended");
      // Only auto-archive confirmed sessions that have ended, and only for mentors
      if (session.status === "confirmed" && role === "mentor") {
        onAction(session.id!, "archive");
      }
    } else {
      setTimeStatus("upcoming");
    }
  };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [session, onAction]);

  const joinCall = () => setShowVideo(true);

  return (
    <div 
      className={`animate-in fade-in-50 bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${
        timeStatus === 'ended' ? 'opacity-60' : ''
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            session.status === 'confirmed' ? 'bg-green-500' :
            session.status === 'pending' ? 'bg-yellow-500' :
            session.status === 'cancelled' ? 'bg-red-500' :
            session.status === 'archived' ? 'bg-gray-500' :
            'bg-blue-500'
          }`}></div>
          <span className="text-sm font-medium capitalize text-gray-700">
            {session.status === 'confirmed' && role === 'mentee' ? 'Confirmed - Swap Pending' : session.status}
          </span>
          {timeStatus === 'active' && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Live Now
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          {/* Video Call Button - Only show when session is active and confirmed */}
          {timeStatus === 'active' && session.status === 'confirmed' && (
            <button
              onClick={joinCall}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Video className="w-4 h-4" />
              <span>Join Call</span>
            </button>
          )}

          {role === 'mentor' && session.status === 'pending' && (
            <>
              <button
                onClick={() => onAction(session.id!, 'accept')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                Swap
              </button>
              <button
                onClick={() => onAction(session.id!, 'reject')}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </>
          )}
          
          {role === 'mentor' && session.status === 'confirmed' && timeStatus !== 'ended' && (
            <button
              onClick={() => onAction(session.id!, 'cancel')}
              className="px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
            >
              Cancel
            </button>
          )}
          
          {role === 'mentor' && session.status === 'cancelled' && (
            <>
              <button
                onClick={() => onAction(session.id!, 'archive')}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Archive
              </button>
              <button
                onClick={() => onAction(session.id!, 'delete')}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </>
          )}
          
          {role === 'mentee' && session.status === 'pending' && (
            <button
              onClick={() => onCancel?.(session.id!)}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Cancel
            </button>
          )}
          
          {role === 'mentee' && session.status === 'confirmed' && timeStatus !== 'ended' && (
            <button
              onClick={() => onCancel?.(session.id!)}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Cancel
            </button>
          )}

          {timeStatus === 'ended' && (
            <span className="text-xs text-gray-500 px-2 py-1">
              Session Ended
            </span>
          )}
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2">{session.skill}</h3>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDateForDisplay(session.date)}</span>
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

      {showVideo && (
        <VideoCall 
          roomName={`skill-swap-${session.id}`} 
          onClose={() => setShowVideo(false)} 
        />
      )}
    </div>
  );
};
