import { adminDb } from '@/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest
) {
  try {
   
    const url = new URL(req.url)

    // pathname looks like: /api/profile/view/123
    const segments = url.pathname.split('/')
    const userId = segments[segments.length - 1]

   const profileRef = adminDb.collection('profiles').doc(userId)
    const snapshot = await profileRef.get()
    
  

    if (!snapshot.exists) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    const profile = {
      id: snapshot.id,
      ...snapshot.data()
    };

    return NextResponse.json(profile,{status:200});
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
