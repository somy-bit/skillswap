import { adminDb } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

function getVancouverDate(): Date {
  return new Date(new Date().toLocaleString("en-US", {timeZone: 'America/Vancouver'}));
}

export async function POST() {
  try {
    const today = getVancouverDate();
    today.setHours(0, 0, 0, 0);
    
    // Calculate cutoff date (1 day ago)
    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() - 1);
    
    // Get all slot documents
    const slotsSnapshot = await adminDb.collection('slots').get();
    let cleanedCount = 0;
    
    const batch = adminDb.batch();
    
    slotsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.slots) {
        const filteredSlots = data.slots.filter((slot: any) => {
          const slotDate = new Date(slot.date + 'T00:00:00');
          return slotDate >= cutoffDate;
        });
        
        if (filteredSlots.length !== data.slots.length) {
          cleanedCount += data.slots.length - filteredSlots.length;
          batch.update(doc.ref, {
            slots: filteredSlots,
            updatedAt: new Date()
          });
        }
      }
    });
    
    await batch.commit();
    
    return NextResponse.json({ 
      success: true, 
      message: `Cleaned up ${cleanedCount} expired slots` 
    });
  } catch (error) {
    console.error('Error cleaning up slots:', error);
    return NextResponse.json({ 
      error: 'Failed to cleanup slots' 
    }, { status: 500 });
  }
}
