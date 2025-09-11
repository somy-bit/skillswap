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
    
    const profilesRef = adminDb.collection('profiles');
    const snapshot = await profilesRef.where('userId', '==', uid).get();
    
    if (snapshot.empty) {
      return NextResponse.json({ 
        name: decodedToken.name || 'User',
        avatar: null 
      });
    }
    
    const profileData = snapshot.docs[0].data();
    
    return NextResponse.json({
      name: profileData.name || decodedToken.name || 'User',
      avatar: profileData.avatar || null
    });
  } catch (error) {
    console.error('Error fetching user avatar:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
