'use client'

import { useState, useEffect } from 'react';
import { Clock, Video, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Session {
  id: string;
  skill: string;
  mentorName?: string;
  menteeName?: string;
  date: any;
  startTime: string;
  duration: number;
  status: string;
  mentorId: string;
  menteeId: string;
}

export default function UpcomingSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUpcomingSessions();
    }
  }, [user]);

  const fetchUpcomingSessions = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/swap-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const now = new Date();
        
        // Use swapSessions which are already filtered for confirmed status
        const upcomingSessions = data.swapSessions
          .filter((session: Session) => {
            const sessionDate = session.date?.toDate ? session.date.toDate() : new Date(session.date);
            return sessionDate > now;
          })
          .sort((a: Session, b: Session) => {
            const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
            const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
            return dateA.getTime() - dateB.getTime();
          })
          .slice(0, 3);

        setSessions(upcomingSessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSessionTime = (session: Session) => {
    const sessionDate = session.date?.toDate ? session.date.toDate() : new Date(session.date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (sessionDate.toDateString() === today.toDateString()) {
      return `Today, ${session.startTime}`;
    } else if (sessionDate.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${session.startTime}`;
    } else {
      return `${sessionDate.toLocaleDateString()}, ${session.startTime}`;
    }
  };

  const getOtherPersonName = (session: Session) => {
    return session.mentorId === user?.uid ? session.menteeName : session.mentorName;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Sessions</h3>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

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
      
      {sessions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No upcoming sessions</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {session.skill}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{getOtherPersonName(session) || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatSessionTime(session)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href="/dashboard/sessions">
                    <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      <Video className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
