import { adminDb } from '@/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '12');
    const lastDocId = searchParams.get('lastDoc');

    let query = adminDb.collection('profiles').orderBy('name').limit(limit);
    
    if (lastDocId) {
      const lastDocSnap = await adminDb.collection('profiles').doc(lastDocId).get();
      if (lastDocSnap.exists) {
        query = query.startAfter(lastDocSnap);
      }
    }

    const snapshot = await query.get();
    
    const profiles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null;
    const hasMore = snapshot.docs.length === limit;

    return NextResponse.json({
      profiles,
      lastDoc,
      hasMore
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }
}
