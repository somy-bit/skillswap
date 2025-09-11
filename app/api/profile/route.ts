import { adminAuth, adminDb, adminBucket } from '@/lib/firebaseAdmin';
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
    
    const profilesRef = adminDb.collection('profiles').doc(uid);
    const snapshot = await profilesRef.get();
    
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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request);
    const uid = decodedToken.uid;
    
    const formData = await request.formData();
    const profileDataString = formData.get('profileData') as string;
    const profileData = JSON.parse(profileDataString);
    const imageFile = formData.get('image') as File | null;

    // Find existing profile
    const profilesRef = adminDb.collection('profiles').doc(uid)
    const snapshot = await profilesRef.get();
    
    if (!snapshot.exists) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const profileDoc = snapshot;
    let avatarUrl = profileData.avatar;

    // Handle image upload if provided
    if (imageFile) {
      const fileName = `profiles/${uid}-${Date.now()}.${imageFile.name.split('.').pop()}`;
      const file = adminBucket.file(fileName);
      
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      await file.save(buffer, {
        metadata: {
          contentType: imageFile.type,
        },
      });

      await file.makePublic();
      avatarUrl = `https://storage.googleapis.com/${adminBucket.name}/${fileName}`;
    }

    // Update profile
    const updatedProfile = {
      ...profileData,
      avatar: avatarUrl,
      userId: uid,
      updatedAt: new Date(),
    };

    await profileDoc.ref.set(updatedProfile,{merge:true})

    return NextResponse.json({
      id: profileDoc.id,
      ...updatedProfile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
