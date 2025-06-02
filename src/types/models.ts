import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'vehicle_driver' | 'ambulance_driver' | 'hospital_admin';
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface VehicleDriver {
  userId: string; // FK to users.id
  name: string;
  vehicleNumber: string;
  vehicleType: string;
  emergencyContactNumber: string;
  clinicalHistory?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface AmbulanceDriver {
  userId: string; // FK to users.id
  name: string;
  vehicleNumber: string;
  hospitalId?: string; // assigned when hospital accepts
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  phoneNumber: string;
  adminUserId: string; // FK to users.id
  createdAt: Timestamp;
  updatedAt?: Timestamp;
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
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface Assignment {
  id: string;
  accidentId: string;
  ambulanceDriverId: string;
  hospitalId: string;
  acceptedAt: Timestamp;
  hospitalAcceptedAt?: Timestamp;
  status: 'pending' | 'en_route' | 'completed' | 'cancelled' | 'reassigned';
  cancellationReason?: string;
  reassignmentCount: number;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// Additional types for forms and API responses
export interface RegisterUserData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: 'vehicle_driver' | 'ambulance_driver' | 'hospital_admin';
}

export interface VehicleDriverData extends RegisterUserData {
  role: 'vehicle_driver';
  vehicleNumber: string;
  vehicleType: string;
  emergencyContactNumber: string;
  clinicalHistory?: string;
}

export interface AmbulanceDriverData extends RegisterUserData {
  role: 'ambulance_driver';
  vehicleNumber: string;
}

export interface HospitalAdminData extends RegisterUserData {
  role: 'hospital_admin';
  hospitalName: string;
  hospitalAddress: string;
  hospitalPhoneNumber: string;
  hospitalLocation: {
    latitude: number;
    longitude: number;
  };
}