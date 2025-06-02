import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  GeoPoint,
  FieldValue,
  Timestamp
} from 'firebase/firestore';
// Change this import:
// import { db } from '../config/firebase';
import { db } from '../config/firebase';import { 
  Accident, 
  Assignment, 
  Hospital, 
  VehicleDriver, 
  AmbulanceDriver 
} from '../types/models';

// Create a type for accident creation that accepts FieldValue for timestamp
type AccidentCreateData = Omit<Accident, 'id' | 'createdAt' | 'updatedAt' | 'timestamp'> & {
  timestamp: FieldValue | Timestamp;
};

export class DatabaseService {
  // Accident operations
  static async createAccident(accidentData: AccidentCreateData) {
    try {
      const docRef = await addDoc(collection(db, 'accidents'), {
        ...accidentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating accident:', error);
      throw error;
    }
  }

  static async getAccident(accidentId: string): Promise<Accident | null> {
    try {
      const docRef = doc(db, 'accidents', accidentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Accident;
      }
      return null;
    } catch (error) {
      console.error('Error getting accident:', error);
      throw error;
    }
  }

  static async updateAccidentStatus(accidentId: string, status: Accident['status']) {
    try {
      const docRef = doc(db, 'accidents', accidentId);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating accident status:', error);
      throw error;
    }
  }

  static async getPendingAccidents(): Promise<Accident[]> {
    try {
      const q = query(
        collection(db, 'accidents'),
        where('status', '==', 'pending'),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Accident[];
    } catch (error) {
      console.error('Error getting pending accidents:', error);
      throw error;
    }
  }

  // Hospital operations
  static async getNearbyHospitals(latitude: number, longitude: number, radiusKm: number = 50): Promise<Hospital[]> {
    try {
      // Note: For production, you'd want to use GeoFirestore for proper geospatial queries
      // For now, we'll get all hospitals and filter client-side
      const querySnapshot = await getDocs(collection(db, 'hospitals'));
      
      const hospitals = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Hospital[];

      // Simple distance calculation (you might want to use a proper geospatial library)
      return hospitals.filter(hospital => {
        const distance = this.calculateDistance(
          latitude, 
          longitude, 
          hospital.location.latitude, 
          hospital.location.longitude
        );
        return distance <= radiusKm;
      });
    } catch (error) {
      console.error('Error getting nearby hospitals:', error);
      throw error;
    }
  }

  // Assignment operations
  static async createAssignment(assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'assignments'), {
        ...assignmentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  }

  static async updateAssignmentStatus(assignmentId: string, status: Assignment['status'], cancellationReason?: string) {
    try {
      const docRef = doc(db, 'assignments', assignmentId);
      const updateData: any = {
        status,
        updatedAt: serverTimestamp(),
      };
      
      if (cancellationReason) {
        updateData.cancellationReason = cancellationReason;
      }
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating assignment status:', error);
      throw error;
    }
  }

  static async getAssignmentsByAmbulanceDriver(ambulanceDriverId: string): Promise<Assignment[]> {
    try {
      const q = query(
        collection(db, 'assignments'),
        where('ambulanceDriverId', '==', ambulanceDriverId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Assignment[];
    } catch (error) {
      console.error('Error getting assignments:', error);
      throw error;
    }
  }

  static async getAssignmentsByHospital(hospitalId: string): Promise<Assignment[]> {
    try {
      const q = query(
        collection(db, 'assignments'),
        where('hospitalId', '==', hospitalId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Assignment[];
    } catch (error) {
      console.error('Error getting hospital assignments:', error);
      throw error;
    }
  }

  // Get available ambulance drivers for a hospital
  static async getAvailableAmbulanceDrivers(hospitalId: string): Promise<AmbulanceDriver[]> {
    try {
      const q = query(
        collection(db, 'ambulance_drivers'),
        where('hospitalId', '==', hospitalId)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        userId: doc.id,
        ...doc.data()
      })) as AmbulanceDriver[];
    } catch (error) {
      console.error('Error getting available ambulance drivers:', error);
      throw error;
    }
  }

  // Get vehicle driver details
  static async getVehicleDriver(userId: string): Promise<VehicleDriver | null> {
    try {
      const docRef = doc(db, 'vehicle_drivers', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { userId: docSnap.id, ...docSnap.data() } as VehicleDriver;
      }
      return null;
    } catch (error) {
      console.error('Error getting vehicle driver:', error);
      throw error;
    }
  }

  // Utility function to calculate distance between two points
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in kilometers
    return d;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}
