
import { NextRequest, NextResponse } from 'next/server';
import {adminAuth} from '@/lib/firebaseAdmin'; // Adjust the import path

export async function POST(req: NextRequest) {
  // Extract the authorization header from the incoming request
  const authHeader = req.headers.get('Authorization');

  // Check for the presence of a bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { message: 'Unauthorized: No bearer token provided.' },
      { status: 403 }
    );
  }

  // Extract the ID token
  const idToken = authHeader.split('Bearer ')[1];

  try {
    // Verify the ID token using the Firebase Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Return a success response with the user data
    return NextResponse.json(
      {
        message: `Welcome, user with UID: ${decodedToken.uid}! Token is valid.`,
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    // Return an error response for an invalid or expired token
    return NextResponse.json(
      { message: 'Unauthorized: Invalid or expired token.' },
      { status: 403 }
    );
  }
}

