export async function updateSessionStatus(sessionId: string, status: string) {
  try {
    const response = await fetch(`/api/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return response.json();
  } catch (error) {
    console.error('Failed to update session status:', error);
  }
}

export interface MockSession {
  id: string;
  title: string;
  skill: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'active' | 'completed' | 'archived';
  message?: string;
}

export function generateMockSessions(): MockSession[] {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  return [
    {
      id: '1',
      title: 'JavaScript Fundamentals',
      skill: 'JavaScript',
      date: today,
      startTime: String(now.getHours() + 1).padStart(2, '0') + ':00', // 1 hour from now
      endTime: String(now.getHours() + 2).padStart(2, '0') + ':00', // 2 hours from now
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'React Hooks Deep Dive',
      skill: 'React',
      date: today,
      startTime: String(Math.max(0, now.getHours() - 1)).padStart(2, '0') + ':00', // 1 hour ago
      endTime: String(now.getHours() + 1).padStart(2, '0') + ':00', // 1 hour from now
      status: 'active'
    },
    {
      id: '3',
      title: 'CSS Grid Layout',
      skill: 'CSS',
      date: today,
      startTime: String(Math.max(0, now.getHours() - 3)).padStart(2, '0') + ':00', // 3 hours ago
      endTime: String(Math.max(0, now.getHours() - 2)).padStart(2, '0') + ':00', // 2 hours ago
      status: 'completed'
    }
  ];
}
