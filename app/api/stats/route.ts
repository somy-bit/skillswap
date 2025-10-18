import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('No valid token provided');
  }
  
  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await adminAuth.verifyIdToken(token);
  return decodedToken;
}

function getWeekRange(date: Date) {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // End of week (Saturday)
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request);
    const uid = decodedToken.uid;
    
    const now = new Date();
    const thisWeek = getWeekRange(now);
    const lastWeekStart = new Date(thisWeek.start);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeek = getWeekRange(lastWeekStart);

    // Get all data in parallel
    const [connectionsSnap, sessionsSnap, messagesSnap, connectionRequestsSnap] = await Promise.all([
      adminDb.collection('connections').where('status', '==', 'accepted').get(),
      adminDb.collection('sessions').get(),
      adminDb.collection('messages').where('receiverId', '==', uid).where('read', '==', false).get(),
      adminDb.collection('connections').where('receiverId', '==', uid).where('status', '==', 'pending').get()
    ]);

    // Count user's actual connections
    const userConnections = connectionsSnap.docs.filter(doc => {
      const data = doc.data();
      return data.senderId === uid || data.receiverId === uid;
    });
    const totalConnections = userConnections.length;

    // Filter sessions for current user and weeks
    const userSessions = sessionsSnap.docs.filter(doc => {
      const data = doc.data();
      return data.mentorId === uid || data.menteeId === uid;
    });

    const thisWeekSessions = userSessions.filter(doc => {
      const data = doc.data();
      let sessionDate;
      
      if (data.date?.toDate) {
        sessionDate = data.date.toDate();
      } else if (data.date instanceof Date) {
        sessionDate = data.date;
      } else if (typeof data.date === 'string') {
        sessionDate = new Date(data.date);
      } else {
        return false;
      }
      
      return sessionDate >= thisWeek.start && sessionDate <= thisWeek.end;
    }).length;

    const lastWeekSessions = userSessions.filter(doc => {
      const data = doc.data();
      let sessionDate;
      
      if (data.date?.toDate) {
        sessionDate = data.date.toDate();
      } else if (data.date instanceof Date) {
        sessionDate = data.date;
      } else if (typeof data.date === 'string') {
        sessionDate = new Date(data.date);
      } else {
        return false;
      }
      
      return sessionDate >= lastWeek.start && sessionDate <= lastWeek.end;
    }).length;

    const sessionDifference = thisWeekSessions - lastWeekSessions;
    const unreadMessages = messagesSnap.size;
    const pendingConnectionRequests = connectionRequestsSnap.size;

    const stats = {
      totalConnections,
      thisWeekSessions,
      lastWeekSessions,
      sessionDifference,
      unreadMessages,
      pendingConnectionRequests
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
