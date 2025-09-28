import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebaseAdmin'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(token)
    const userId = decodedToken.uid

    // Get all conversations for the user
    const conversationsRef = adminDb.collection('conversations')
    const snapshot = await conversationsRef
      .where('participants', 'array-contains', userId)
      .orderBy('lastMessageTimestamp', 'desc')
      .get()

    const conversations = []
    
    for (const doc of snapshot.docs) {
      const data = doc.data()
      const otherUserId = data.participants.find((id: string) => id !== userId)
      
      // Get other user's profile
      const userDoc = await adminDb.collection('profiles').doc(otherUserId).get()
      const userData = userDoc.data()
      
      // Count unread messages
      const unreadSnapshot = await adminDb.collection('messages')
        .where('conversationId', '==', doc.id)
        .where('senderId', '!=', userId)
        .where('read', '==', false)
        .get()

      conversations.push({
        id: doc.id,
        otherUser: {
          id: otherUserId,
          name: userData?.name || 'Unknown User',
          avatar: userData?.avatar || null
        },
        lastMessage: {
          content: data.lastMessage,
          timestamp: data.lastMessageTimestamp?.toDate(),
          senderId: data.lastMessageSenderId
        },
        unreadCount: unreadSnapshot.size
      })
    }

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
