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
    console.log("Notification doc:",  doc.data());
    const data = doc.data();
    const notifications = data?.notifications || [];
    
    // Only return unseen notifications
    const unseenNotifications = notifications.filter((notif: any) => !notif.seen);
    console.log("Unseen notifications:", unseenNotifications);
    // Sort by timestamp (newest first)
    unseenNotifications.sort((a: any, b: any) => b.timestamp.toDate() - a.timestamp.toDate());
    
    return NextResponse.json(unseenNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request);
    const uid = decodedToken.uid;
    const { notificationIndex } = await request.json();
    
    const notifRef = adminDb.collection('notifications').doc(uid);
    const doc = await notifRef.get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: 'Notifications not found' }, { status: 404 });
    }
    
    const data = doc.data();
    const notifications = data?.notifications || [];
    
    // Find the notification by index in the unseen notifications array
    const unseenNotifications = notifications.filter((notif: any) => !notif.seen);
    
    if (notificationIndex >= 0 && notificationIndex < unseenNotifications.length) {
      const targetNotification = unseenNotifications[notificationIndex];
      
      // Remove the notification from the array instead of marking as seen
      const updatedNotifications = notifications.filter((notif: any) => 
        notif.timestamp !== targetNotification.timestamp || 
        notif.message !== targetNotification.message
      );
      
      await notifRef.update({
        notifications: updatedNotifications,
        updatedAt: new Date()
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
