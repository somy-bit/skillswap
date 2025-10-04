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

    const url = new URL(request.url);

    const segments = url.pathname.split("/");
    const userId = segments[segments.length - 1];
    console.log('user in slot route ', userId)
    if (!userId) {
      return NextResponse.json({ message: "unAuthorized" }, { status: 401 })
    }

    const slotsRef = adminDb.collection('slots').doc(userId);
    const doc = await slotsRef.get();

    if (!doc.exists) {
      console.log("no slot for user ", userId)
      return NextResponse.json([]);
    }

    const data = doc.data();
    const slots = data?.slots || [];

    // Filter out past slots based on local timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentSlots = slots.filter((slot: any) => {
      const slotDate = new Date(slot.date + 'T00:00:00');
      return slotDate >= today;
    });
    console.log(currentSlots)
    return NextResponse.json(currentSlots);
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
