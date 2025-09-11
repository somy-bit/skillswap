import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  const event = await req.json();
  
  console.log('Zoom webhook event:', event);

  if (event.event === 'meeting.ended') {
    const meetingId = event.payload.object.id;

    // find session by Zoom meeting ID
    const sessionQuery = await adminDb
      .collection('sessions')
      .where('zoom.meetingId', '==', meetingId)
      .limit(1)
      .get();

    if (!sessionQuery.empty) {
      const sessionDoc = sessionQuery.docs[0].ref;

      // mark session as completed
      await sessionDoc.update({ status: 'completed' });

      // optionally create a notification for mentee to rate mentor
      const sessionData = sessionQuery.docs[0].data();
      await adminDb
        .collection('notifications')
        .doc(sessionData.menteeId)
        .collection('items')
        .add({
          message: `Your session with ${sessionData.mentorName} has ended. Please rate your mentor.`,
          type: 'rating',
          linkTo: `/sessions/${sessionDoc.id}/rate`,
          timestamp: new Date(),
          seen: false,
        });
    }
  }

  return NextResponse.json({ success: true });
}
