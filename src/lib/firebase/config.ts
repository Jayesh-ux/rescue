
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Admin SDK setup (server-side)
export const initializeAdminApp = () => {
  const apps = getApps();
  
  if (!apps.length) {
    initializeApp({
      credential: cert({
        projectId: "ambulance-dispatch-syste-f9714",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      databaseURL: `https://ambulance-dispatch-syste-f9714-default-rtdb.firebaseapp.com/`,
    });
  }
  
  return {
    db: getFirestore(),
    auth: getAuth(),
  };
};
