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

// PATCH - Accept or reject connection request
export async function PATCH(
  request: NextRequest,
  { params }: { params: { connectionId: string } }
) {
  try {
    const decodedToken = await verifyToken(request);
    const uid = decodedToken.uid;
    const { action } = await request.json(); // 'accept' or 'reject'
    
    if (!['accept', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const connectionRef = adminDb.collection('connections').doc(params.connectionId);
    const connectionDoc = await connectionRef.get();

    if (!connectionDoc.exists) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    const connectionData = connectionDoc.data()!;

    // Only receiver can accept/reject
    if (connectionData.receiverId !== uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (connectionData.status !== 'pending') {
      return NextResponse.json({ error: 'Connection already processed' }, { status: 400 });
    }

    const updateData = {
      status: action === 'accept' ? 'accepted' : 'rejected',
      [action === 'accept' ? 'acceptedAt' : 'rejectedAt']: admin.firestore.FieldValue.serverTimestamp()
    };

    await connectionRef.update(updateData);

    return NextResponse.json({ 
      message: `Connection ${action}ed successfully` 
    });
  } catch (error) {
    console.error('Error updating connection:', error);
    return NextResponse.json({ error: 'Failed to update connection' }, { status: 500 });
  }
}

// DELETE - Remove connection
export async function DELETE(
  request: NextRequest,
  { params }: { params: { connectionId: string } }
) {
  try {
    const decodedToken = await verifyToken(request);
    const uid = decodedToken.uid;

    const connectionRef = adminDb.collection('connections').doc(params.connectionId);
    const connectionDoc = await connectionRef.get();

    if (!connectionDoc.exists) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    const connectionData = connectionDoc.data()!;

    // Only participants can delete
    if (connectionData.senderId !== uid && connectionData.receiverId !== uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectionRef.delete();

    return NextResponse.json({ 
      message: 'Connection removed successfully' 
    });
  } catch (error) {
    console.error('Error removing connection:', error);
    return NextResponse.json({ error: 'Failed to remove connection' }, { status: 500 });
  }
}
