import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Client-side Firebase initialization
export const initializeClientApp = () => {
  const apps = getApps();
  
  if (!apps.length) {
    const app = initializeApp(firebaseConfig);
    return {
      app,
      auth: getAuth(app),
      db: getFirestore(app),
    };
  }
  
  return {
    app: apps[0],
    auth: getAuth(apps[0]),
    db: getFirestore(apps[0]),
  };
};

// Export initialized Firebase instances
export const { app, auth, db } = initializeClientApp();