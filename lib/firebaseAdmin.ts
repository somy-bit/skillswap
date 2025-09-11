// lib/firebaseAdmin.ts
import admin from "firebase-admin";
import {getAuth} from 'firebase-admin/auth'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
       storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}



const adminDb = admin.firestore();
 const adminAuth = getAuth();
 const adminBucket = admin.storage().bucket(); 

export { admin, adminDb , adminAuth , adminBucket};
