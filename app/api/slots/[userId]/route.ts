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
    await verifyToken(request);
   
     const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if(!userId){
      return NextResponse.json({message:"unAuthorized"},{status:401})
    }
    
    const slotsRef = adminDb.collection('slots').doc(userId);
    const doc = await slotsRef.get();
    
    if (!doc.exists) {
      return NextResponse.json([]);
    }
    
    const data = doc.data();
    const slots = data?.slots || [];
    
    // Filter out past slots
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentSlots = slots.filter((slot: any) => {
      const slotDate = new Date(slot.date);
      return slotDate >= today;
    });
    
    return NextResponse.json(currentSlots);
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
