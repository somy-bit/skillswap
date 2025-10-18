import { adminAuth, adminDb, admin } from '@/lib/firebaseAdmin';
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

// GET - Get user's connections and connection requests
export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request);
    const uid = decodedToken.uid;

    // Get connections where user is sender or receiver and status is 'accepted'
    const connectionsSnap = await adminDb.collection('connections')
      .where('status', '==', 'accepted')
      .get();

    const connections = connectionsSnap.docs
      .filter(doc => {
        const data = doc.data();
        return data.senderId === uid || data.receiverId === uid;
      })
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          connectedUserId: data.senderId === uid ? data.receiverId : data.senderId,
          connectedAt: data.acceptedAt
        };
      });

    // Get pending requests sent by user
    const sentRequestsSnap = await adminDb.collection('connections')
      .where('senderId', '==', uid)
      .where('status', '==', 'pending')
      .get();

    const sentRequests = sentRequestsSnap.docs.map(doc => ({
      id: doc.id,
      receiverId: doc.data().receiverId,
      sentAt: doc.data().createdAt
    }));

    // Get pending requests received by user with profile data
    const receivedRequestsSnap = await adminDb.collection('connections')
      .where('receiverId', '==', uid)
      .where('status', '==', 'pending')
      .get();

    const receivedRequests = await Promise.all(
      receivedRequestsSnap.docs.map(async (doc) => {
        const connectionData = doc.data();
        const profileDoc = await adminDb.collection('profiles').doc(connectionData.senderId).get();
        const profile = profileDoc.exists ? profileDoc.data() : null;
        
        return {
          id: doc.id,
          senderId: connectionData.senderId,
          senderName: profile?.name || 'Unknown User',
          senderAvatar: profile?.avatar,
          sentAt: connectionData.createdAt
        };
      })
    );

    return NextResponse.json({
      connections,
      sentRequests,
      receivedRequests
    });
  } catch (error) {
    console.error('Error fetching connections:', error);
    return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 });
  }
}

// POST - Send connection request
export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request);
    const senderId = decodedToken.uid;
    const { receiverId } = await request.json();

    if (!receiverId || receiverId === senderId) {
      return NextResponse.json({ error: 'Invalid receiver ID' }, { status: 400 });
    }

    // Check if connection already exists
    const existingConnection = await adminDb.collection('connections')
      .where('senderId', 'in', [senderId, receiverId])
      .where('receiverId', 'in', [senderId, receiverId])
      .get();

    if (!existingConnection.empty) {
      return NextResponse.json({ error: 'Connection already exists' }, { status: 400 });
    }

    // Create connection request
    const connectionData = {
      senderId,
      receiverId,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await adminDb.collection('connections').add(connectionData);

    return NextResponse.json({ 
      id: docRef.id,
      message: 'Connection request sent successfully' 
    });
  } catch (error) {
    console.error('Error sending connection request:', error);
    return NextResponse.json({ error: 'Failed to send connection request' }, { status: 500 });
  }
}
