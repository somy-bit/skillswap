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

export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request);
    const uid = decodedToken.uid;

    // Get all sessions where user is either mentor or mentee
    const sessionsSnapshot = await adminDb.collection('sessions').get();
    const allSessions: any[] = [];

    sessionsSnapshot.forEach(doc => {
      const data = doc.data();
      // Check if user is mentor or mentee in this session
      if (data.mentorId === uid || data.menteeId === uid) {
        allSessions.push({
          id: doc.id, // Use the actual document ID
          ...data
        });
      }
    });

    return NextResponse.json({ sessions: allSessions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request);
    const uid = decodedToken.uid;

    const { mentorId, date, startTime, endTime, skill, message } = await request.json();

    // Create session object
    const sessionData = {
      mentorId,
      menteeId: uid,
      date,
      startTime,
      endTime,
      skill,
      message,
      status: "pending",
      createdAt: new Date(),
    };

    // ✅ Save as a new document in "sessions" collection
    const sessionRef = await adminDb.collection("sessions").add(sessionData);
    const sessionId = sessionRef.id;

    // 🔒 Mark slot as booked
    const slotsRef = adminDb.collection("slots").doc(mentorId);
    const slotsDoc = await slotsRef.get();

    if (slotsDoc.exists) {
      const slots = slotsDoc.data()?.slots || [];
      const updatedSlots = slots.map((slot: any) => {
        if (
          slot.date === date &&
          slot.startTime === startTime &&
          slot.endTime === endTime
        ) {
          return { ...slot, isBooked: true };
        }
        return slot;
      });

      await slotsRef.update({
        slots: updatedSlots,
        updatedAt: new Date(),
      });
    }

    // 🔔 Create notification for mentor
    const notificationData = {
      type: "booking",
      senderId: uid,
      message: `New session booking request for ${skill}`,
      timestamp: new Date(),
      seen: false,
      sessionId, // store the created sessionId
    };

    const notifRef = adminDb.collection("notifications").doc(mentorId);
    const notifDoc = await notifRef.get();

    if (notifDoc.exists) {
      const existingNotifications = notifDoc.data()?.notifications || [];
      await notifRef.update({
        notifications: [...existingNotifications, notificationData],
        updatedAt: new Date(),
      });
    } else {
      await notifRef.set({
        notifications: [notificationData],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true, sessionId });
  } catch (error) {
    console.error("Error booking session:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request);
    const uid = decodedToken.uid;

    const { sessionId, action } = await request.json();

    // Get the session document directly
    const sessionDoc = await adminDb.collection('sessions').doc(sessionId).get();

    if (!sessionDoc.exists) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const session = sessionDoc.data();

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Check if user is authorized (mentor for accept/reject/cancel, or mentee for some actions)
    if (session.mentorId !== uid && session.menteeId !== uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    switch (action) {
      case 'accept':
        if (session.mentorId !== uid) {
          return NextResponse.json({ error: 'Only mentor can accept' }, { status: 403 });
        }
        await adminDb.collection('sessions').doc(sessionId).update({
          status: 'confirmed',
          updatedAt: new Date()
        });
        
        // Send notification to mentee
        await sendNotification(session.menteeId, {
          type: 'session_accepted',
          senderId: uid,
          message: `Your session for ${session.skill} has been accepted`,
          sessionId: sessionId
        });
        break;

      case 'reject':
        if (session.mentorId !== uid) {
          return NextResponse.json({ error: 'Only mentor can reject' }, { status: 403 });
        }
        await adminDb.collection('sessions').doc(sessionId).update({
          status: 'rejected',
          updatedAt: new Date()
        });
        
        // Free up the slot
        await freeSlot(session.mentorId, session.date, session.startTime, session.endTime);
        
        // Send notification to mentee
        await sendNotification(session.menteeId, {
          type: 'session_rejected',
          senderId: uid,
          message: `Your session for ${session.skill} has been rejected`,
          sessionId: sessionId
        });
        break;

      case 'cancel':
        // Allow both mentor and mentee to cancel
        await adminDb.collection('sessions').doc(sessionId).update({
          status: 'cancelled',
          updatedAt: new Date()
        });
        
        // Free up the slot
        await freeSlot(session.mentorId, session.date, session.startTime, session.endTime);
        
        // Send notification to the other party
        const otherUserId = session.mentorId === uid ? session.menteeId : session.mentorId;
        const userRole = session.mentorId === uid ? 'mentor' : 'mentee';
        await sendNotification(otherUserId, {
          type: 'session_cancelled',
          senderId: uid,
          message: `Your session for ${session.skill} has been cancelled by the ${userRole}`,
          sessionId: sessionId
        });
        break;

      case 'archive':
        if (session.mentorId !== uid) {
          return NextResponse.json({ error: 'Only mentor can archive' }, { status: 403 });
        }
        
        await adminDb.collection('sessions').doc(sessionId).update({
          status: 'archived',
          updatedAt: new Date()
        });
        break;

      case 'delete':
        // Allow deletion from archived sessions or regular sessions
        if (session.mentorId !== uid && session.menteeId !== uid) {
          return NextResponse.json({ error: 'Unauthorized to delete' }, { status: 403 });
        }
        
        await adminDb.collection('sessions').doc(sessionId).delete();
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function sendNotification(userId: string, notification: any) {
  const notifRef = adminDb.collection("notifications").doc(userId);
  const notifDoc = await notifRef.get();

  const notificationData = {
    ...notification,
    timestamp: new Date(),
    seen: false,
  };

  if (notifDoc.exists) {
    const existingNotifications = notifDoc.data()?.notifications || [];
    await notifRef.update({
      notifications: [...existingNotifications, notificationData],
      updatedAt: new Date(),
    });
  } else {
    await notifRef.set({
      notifications: [notificationData],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request);
    const uid = decodedToken.uid;

    const { sessionId } = await request.json();

    // Find the session document
    const sessionDoc = await adminDb.collection('sessions').doc(sessionId).get();

    if (!sessionDoc.exists) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const sessionData = sessionDoc.data();

    // Check if user is the mentee (only mentees can delete their requests)
    if (sessionData?.menteeId !== uid) {
      return NextResponse.json({ error: 'Only mentee can delete session request' }, { status: 403 });
    }

    // Delete the session
    await adminDb.collection('sessions').doc(sessionId).delete();

    // Free up the slot
    await freeSlot(sessionData.mentorId, sessionData.date, sessionData.startTime, sessionData.endTime);

    // Send notification to mentor
    await sendNotification(sessionData.mentorId, {
      type: 'session_cancelled',
      senderId: uid,
      message: `Session request for ${sessionData.skill} has been cancelled by the mentee`,
      sessionId: sessionId
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function freeSlot(mentorId: string, date: string, startTime: string, endTime: string) {
  const slotsRef = adminDb.collection("slots").doc(mentorId);
  const slotsDoc = await slotsRef.get();

  if (slotsDoc.exists) {
    const slots = slotsDoc.data()?.slots || [];
    const updatedSlots = slots.map((slot: any) => {
      if (
        slot.date === date &&
        slot.startTime === startTime &&
        slot.endTime === endTime
      ) {
        return { ...slot, isBooked: false };
      }
      return slot;
    });

    await slotsRef.update({
      slots: updatedSlots,
      updatedAt: new Date(),
    });
  }
}

