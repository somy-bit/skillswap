import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb, admin } from '@/lib/firebaseAdmin'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(token)
    const senderId = decodedToken.uid

    const { receiverId, content } = await request.json()

    if (!receiverId || !content?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const conversationId = [senderId, receiverId].sort().join('_')
    const timestamp = new Date()

    // Create message
    const messageRef = await adminDb.collection('messages').add({
      conversationId,
      senderId,
      receiverId,
      content: content.trim(),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    })

    // Update or create conversation
    const conversationRef = adminDb.collection('conversations').doc(conversationId)
    await conversationRef.set({
      participants: [senderId, receiverId],
      lastMessage: content.trim(),
      lastMessageTimestamp: admin.firestore.FieldValue.serverTimestamp(),
      lastMessageSenderId: senderId
    }, { merge: true })

    // Get the created message
    const messageDoc = await messageRef.get()
    const messageData = {
      id: messageDoc.id,
      ...messageDoc.data(),
      timestamp: timestamp
    }

    return NextResponse.json(messageData)
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
