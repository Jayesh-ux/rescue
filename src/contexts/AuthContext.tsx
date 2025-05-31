import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/clientApp';

interface AuthContextType {
  currentUser: User | null;
  userRole: string | null;
  loading: boolean;
  register: (email: string, password: string, role: string, userData: any) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function register(email: string, password: string, role: string, userData: any) {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email: user.email,
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        role: role,
        createdAt: Timestamp.now(),
      });
      
      // Create role-specific document
      if (role === 'vehicle_driver') {
        await setDoc(doc(db, 'vehicleDrivers', user.uid), {
          userId: user.uid,
          name: userData.name,
          vehicleNumber: userData.vehicleNumber,
          vehicleType: userData.vehicleType,
          emergencyContactNumber: userData.emergencyContactNumber,
          clinicalHistory: userData.clinicalHistory || '',
        });
      } else if (role === 'ambulance_driver') {
        await setDoc(doc(db, 'ambulanceDrivers', user.uid), {
          userId: user.uid,
          name: userData.name,
          vehicleNumber: userData.vehicleNumber,
          hospitalId: userData.hospitalId || null,
        });
      } else if (role === 'hospital_admin') {
        const hospitalId = doc(db, 'hospitals', 'temp').id; // Generate a new ID
        
        await setDoc(doc(db, 'hospitals', hospitalId), {
          id: hospitalId,
          name: userData.hospitalName,
          address: userData.address,
          location: userData.location,
          phoneNumber: userData.phoneNumber,
          adminUserId: user.uid,
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}