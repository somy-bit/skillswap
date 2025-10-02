import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebaseAdmin'

export async function GET(
  request: NextRequest
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(token)
    const currentUserId = decodedToken.uid
   

     const url = new URL(request.url);                // safe in all runtimes
     const segments = url.pathname.split("/").filter(Boolean);
     const id = segments[segments.length - 1]; // get the last segment
     console.log("otherUserId", id);
     console.log("id", id);
    // Find or create conversation
    const conversationId = [currentUserId, id].sort().join('_')
    
    // Get messages for this conversation
    const messagesSnapshot = await adminDb.collection('messages')
      .where('conversationId', '==', conversationId)
      .orderBy('timestamp', 'asc')
      .get()

    const messages = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }))

    // Mark messages as read
    const batch = adminDb.batch()
    messagesSnapshot.docs.forEach(doc => {
      if (doc.data().senderId !== currentUserId && !doc.data().read) {
        batch.update(doc.ref, { read: true })
      }
    })
    await batch.commit()

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
