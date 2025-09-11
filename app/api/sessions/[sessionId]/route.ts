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

export async function GET(
  request: NextRequest
) {
  try {
    const decodedToken = await verifyToken(request);
    const uid = decodedToken.uid;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
if(!sessionId){

  return NextResponse.json({error:"server error"},{status:500})
}
    const sessionDoc = await adminDb.collection('sessions').doc(sessionId).get();

    if (!sessionDoc.exists) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const sessionData = sessionDoc.data();
    
    // Check if user is authorized to view this session
    if (sessionData?.mentorId !== uid && sessionData?.menteeId !== uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const session = {
      id: sessionDoc.id,
      ...sessionData
    };

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
