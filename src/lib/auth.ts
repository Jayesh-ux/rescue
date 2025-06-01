
import { initializeAdminApp } from './firebase/config';

export async function verifyAuth(token: string) {
  try {
    const { auth } = initializeAdminApp();
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
}
