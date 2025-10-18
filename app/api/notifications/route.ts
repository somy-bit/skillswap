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
    
    const notifRef = adminDb.collection('notifications').doc(uid);
    const doc = await notifRef.get();
    
    if (!doc.exists) {
      return NextResponse.json([]);
    }
    // console.log("Notification doc:",  doc.data());
    const data = doc.data();
    const notifications = data?.notifications || [];
    
    // Return all notifications with read status based on seen
    const allNotifications = notifications.map((notif: any) => ({
      ...notif,
      read: notif.seen || false
    }));
    
    // Sort by timestamp (newest first)
    allNotifications.sort((a: any, b: any) => b.timestamp.toDate() - a.timestamp.toDate());
    
    return NextResponse.json(allNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request);
    const uid = decodedToken.uid;
    
    const notifRef = adminDb.collection('notifications').doc(uid);
    const doc = await notifRef.get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: 'Notifications not found' }, { status: 404 });
    }
    
    const data = doc.data();
    const notifications = data?.notifications || [];
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
    
    // Mark all notifications as seen and filter out old seen ones
    const updatedNotifications = notifications
      .map((notif: any) => ({ ...notif, seen: true }))
      .filter((notif: any) => {
        const notifDate = notif.timestamp.toDate();
        return !notif.seen || notifDate > threeDaysAgo;
      });
    
    await notifRef.update({
      notifications: updatedNotifications,
      updatedAt: now
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
