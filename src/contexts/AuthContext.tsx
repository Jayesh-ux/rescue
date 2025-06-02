import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '../config/firebase';import { AuthService } from '../services/authService';
import { User, VehicleDriverData, AmbulanceDriverData, HospitalAdminData } from '../types/models';

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  userRole: string | null;
  loading: boolean;
  register: (userData: VehicleDriverData | AmbulanceDriverData | HospitalAdminData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const register = async (userData: VehicleDriverData | AmbulanceDriverData | HospitalAdminData) => {
    setLoading(true);
    try {
      await AuthService.registerUser(userData);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await AuthService.loginUser(email, password);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AuthService.logoutUser();
      setCurrentUser(null);
      setFirebaseUser(null);
      setUserRole(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setFirebaseUser(user);
        const userData = await AuthService.getCurrentUserData(user.uid);
        if (userData) {
          setCurrentUser(userData);
          setUserRole(userData.role);
        }
      } else {
        setFirebaseUser(null);
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    firebaseUser,
    userRole,
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};