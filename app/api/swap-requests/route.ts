import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { Session } from '@/types/type';
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

type SwapReq = {
  id: string;
  status: 'pending' | 'accepted'|'rejected';
  message: string;
  sessionId: string;
  requesterId: string;
  targetSessionId: string;

}




export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request);
    const uid = decodedToken.uid;

    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Query sessions where user is mentor
    const asMentorSnap = await adminDb
      .collection("sessions")
      .where("mentorId", "==", uid)
      .get();

    // ✅ Query sessions where user is mentee
    const asMenteeSnap = await adminDb
      .collection("sessions")
      .where("menteeId", "==", uid)
      .get();

    // Map mentor sessions
    const asMentor = asMentorSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });

    // Map mentee sessions
    const asMentee = asMenteeSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });


    const swapRequestsSnap = await adminDb.collection('swapRequests').get();
    const requests = swapRequestsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SwapReq[];

    const acceptedSwaps = requests.filter(swap => swap.status === 'accepted')
    const acceptedSessionIds = acceptedSwaps.map(swap => swap.sessionId);
    const swapSessions = [...asMentor, ...asMentee].filter(session =>
      acceptedSessionIds.includes(session.id)
    );

    return NextResponse.json({
      asMentor,
      asMentee,
      requests,
      swapSessions
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request);
    const uid = decodedToken.uid;
    const { sessionId, targetSessionId, message } = await request.json();

    // Create swap request
    const swapRequestData = {
      requesterId: uid,
      sessionId,
      targetSessionId,
      message,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const swapRequestRef = await adminDb.collection('swapRequests').add(swapRequestData);

    // Create notification for the target user
    // This would require getting the target session to find the other user
    // Implementation depends on your session structure

    return NextResponse.json({
      success: true,
      requestId: swapRequestRef.id
    });
  } catch (error) {
    console.error('Error creating swap request:', error);
    return NextResponse.json({ error: 'Failed to create swap request' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request);
    const uid = decodedToken.uid;
    const { requestId, action } = await request.json();

    if (!['accept', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const swapRequestRef = adminDb.collection('swapRequests').doc(requestId);
    const swapRequestDoc = await swapRequestRef.get();

    if (!swapRequestDoc.exists) {
      return NextResponse.json({ error: 'Swap request not found' }, { status: 404 });
    }

    const swapRequestData = swapRequestDoc.data();

    // Verify user has permission to respond to this request
    // This would require checking if the user owns the target session

    await swapRequestRef.update({
      status: action === 'accept' ? 'accepted' : 'rejected',
      updatedAt: new Date()
    });

    if (action === 'accept' && swapRequestData) {
      // Create new swap session
      const sessionRef = adminDb.collection('sessions').doc(swapRequestData.sessionId);
      const sessionDoc = await sessionRef.get();

      if (sessionDoc.exists) {
        const sessionData = sessionDoc.data();
        await adminDb.collection('sessions').add({
          ...sessionData,
          isSwapSession: true,
          originalSessionId: swapRequestData.sessionId,
          swapRequestId: requestId,
          status: 'confirmed'
        });
      }
    }

    {
      swapRequestData &&
      await sendNotification(swapRequestData.requesterId, {
        type: action === 'accept' ? 'swap_accepted' : 'swap_rejected',
        senderId: uid,
        message: `Your swap request has been ${action}ed`,
        sessionId: swapRequestData.sessionId
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating swap request:', error);
    return NextResponse.json({ error: 'Failed to update swap request' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request);
    const uid = decodedToken.uid;
    const { requestId } = await request.json();

    const swapRequestRef = adminDb.collection('swapRequests').doc(requestId);
    const swapRequestDoc = await swapRequestRef.get();

    if (!swapRequestDoc.exists) {
      return NextResponse.json({ error: 'Swap request not found' }, { status: 404 });
    }

    const swapRequestData = swapRequestDoc.data();

    // Verify user owns this request
    if (swapRequestData?.requesterId !== uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await swapRequestRef.delete();

    // Send notification to the other user
    const sessionRef = adminDb.collection('sessions').doc(swapRequestData.targetSessionId);
    const sessionDoc = await sessionRef.get();

    if (sessionDoc.exists) {
      const sessionData = sessionDoc.data();
      const otherUserId = sessionData?.mentorId === uid ? sessionData?.menteeId : sessionData?.mentorId;

      if (otherUserId) {
        await sendNotification(otherUserId, {
          type: 'swap_cancelled',
          senderId: uid,
          message: 'A swap request has been cancelled',
          sessionId: swapRequestData.sessionId
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting swap request:', error);
    return NextResponse.json({ error: 'Failed to delete swap request' }, { status: 500 });
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
