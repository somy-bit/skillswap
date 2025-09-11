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
    
    const slotsRef = adminDb.collection('slots').doc(uid);
    const doc = await slotsRef.get();
    
    if (!doc.exists) {
      return NextResponse.json([]);
    }
    
    const data = doc.data();
    return NextResponse.json(data?.slots || []);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request);
    const uid = decodedToken.uid;
    const { slots } = await request.json();
    
    const slotsRef = adminDb.collection('slots').doc(uid);
    await slotsRef.set({
      slots,
      updatedAt: new Date()
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving timetable:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
