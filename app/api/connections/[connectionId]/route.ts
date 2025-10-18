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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { connectionId: string } }
) {
  try {
    const decodedToken = await verifyToken(request);
    const uid = decodedToken.uid;
    const { action } = await request.json();
    const { connectionId } = params;

    if (!['accept', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Get the connection request
    const connectionDoc = await adminDb.collection('connections').doc(connectionId).get();
    
    if (!connectionDoc.exists) {
      return NextResponse.json({ error: 'Connection request not found' }, { status: 404 });
    }

    const connectionData = connectionDoc.data();
    
    // Verify user is the receiver of this request
    if (connectionData?.receiverId !== uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (action === 'accept') {
      // Update connection status to accepted
      await adminDb.collection('connections').doc(connectionId).update({
        status: 'accepted',
        acceptedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      // Delete the connection request
      await adminDb.collection('connections').doc(connectionId).delete();
    }

    return NextResponse.json({ 
      message: `Connection request ${action}ed successfully` 
    });
  } catch (error) {
    console.error('Error handling connection request:', error);
    return NextResponse.json({ error: 'Failed to handle connection request' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { connectionId: string } }
) {
  try {
    const decodedToken = await verifyToken(request);
    const uid = decodedToken.uid;
    const { connectionId } = params;

    // Get the connection
    const connectionDoc = await adminDb.collection('connections').doc(connectionId).get();
    
    if (!connectionDoc.exists) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    const connectionData = connectionDoc.data();
    
    // Verify user is part of this connection
    if (connectionData?.senderId !== uid && connectionData?.receiverId !== uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the connection
    await adminDb.collection('connections').doc(connectionId).delete();

    return NextResponse.json({ 
      message: 'Connection removed successfully' 
    });
  } catch (error) {
    console.error('Error removing connection:', error);
    return NextResponse.json({ error: 'Failed to remove connection' }, { status: 500 });
  }
}
