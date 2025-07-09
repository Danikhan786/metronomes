import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as path from 'path';

// Initialize Firebase Admin for server-side
const apps = getApps();

if (!apps.length) {
  // Try to use service account file first, fall back to environment variables
  try {
    const serviceAccountPath = path.join(process.cwd(), 'circular-metronome-firebase-adminsdk-fbsvc-076526b958.json');
    initializeApp({
      credential: cert(serviceAccountPath),
    });
  } catch (error) {
    // Fall back to environment variables
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
}

const adminDb = getFirestore();
const adminAuth = getAuth();

export { adminDb, adminAuth }; 