import { useState, useEffect } from 'react';
import { SessionCard } from '../components/sessions/SessionCard';
import { updateSessionStatus, generateMockSessions, MockSession } from '../lib/sessions';

export default function Sessions() {
  const [sessions, setSessions] = useState<MockSession[]>([]);

  useEffect(() => {
    // Load mock sessions for demo
    setSessions(generateMockSessions());
  }, []);

  const handleStatusUpdate = async (sessionId: string, status: string) => {
    await updateSessionStatus(sessionId, status);
    setSessions(prev => 
      prev.map(s => s.id === sessionId ? {...s, status: status as any} : s)
    );
  };

  const handleCancel = async (sessionId: string) => {
    await handleStatusUpdate(sessionId, 'cancelled');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Skill Swap Sessions</h1>
          <p className="text-gray-600">Manage your upcoming and past skill exchange sessions</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session, index) => (
            <SessionCard 
              key={session.id} 
              session={{
                id: session.id,
                skill: session.skill,
                date: session.date,
                startTime: session.startTime,
                endTime: session.endTime,
                status: session.status as any,
                message: session.message ?? '',
               
              }}
              role="mentee" // Demo role
              index={index}
              onAction={handleStatusUpdate}
              onCancel={handleCancel}
            />
          ))}
        </div>

        {sessions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No sessions found</p>
            <p className="text-gray-400 mt-2">Book your first skill swap session to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
