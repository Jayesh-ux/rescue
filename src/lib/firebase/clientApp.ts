
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyA9wjTyMBy6vflmYJ4CqunrsHhYa2apb7I",
  authDomain: "ambulance-dispatch-syste-f9714.firebaseapp.com",
  projectId: "ambulance-dispatch-syste-f9714",
  storageBucket: "ambulance-dispatch-syste-f9714.firebasestorage.app",
  messagingSenderId: "950623243397",
  appId: "1:950623243397:web:7eb52dbc8544f392bdedec",
  measurementId: "G-P3MV5NTK92"
};

// Client-side Firebase initialization
export const initializeClientApp = () => {
  const apps = getApps();
  
  if (!apps.length) {
    const app = initializeApp(firebaseConfig);
    
    // Initialize Analytics only in browser environment
    let analytics: Analytics | null = null;
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
    }
    
    return {
      app,
      auth: getAuth(app),
      db: getFirestore(app),
      analytics,
    };
  }
  
  return {
    app: apps[0],
    auth: getAuth(apps[0]),
    db: getFirestore(apps[0]),
    analytics: typeof window !== 'undefined' ? getAnalytics(apps[0]) : null,
  };
};

// Export initialized Firebase instances
export const { app, auth, db, analytics } = initializeClientApp();
