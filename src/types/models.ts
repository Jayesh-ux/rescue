import { Timestamp, GeoPoint } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'vehicle_driver' | 'ambulance_driver' | 'hospital_admin';
  createdAt: Timestamp;
}

export interface VehicleDriver {
  userId: string;
  name: string;
  vehicleNumber: string;
  vehicleType: string;
  emergencyContactNumber: string;
  clinicalHistory?: string;
}

export interface AmbulanceDriver {
  userId: string;
  name: string;
  vehicleNumber: string;
  hospitalId?: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  location: GeoPoint;
  phoneNumber: string;
  adminUserId: string;
}

export interface Accident {
  id: string;
  vehicleDriverId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: Timestamp;
  triggerType: 'manual' | 'sensor';
  status: 'pending' | 'ambulance_assigned' | 'completed' | 'cancelled';
}

export interface Assignment {
  id: string;
  accidentId: string;
  ambulanceDriverId: string;
  hospitalId: string;
  acceptedAt: Timestamp;
  hospitalAcceptedAt: Timestamp;
  status: 'pending' | 'en_route' | 'completed' | 'cancelled' | 'reassigned';
  cancellationReason?: string;
  reassignmentCount: number;
}