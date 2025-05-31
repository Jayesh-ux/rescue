import { NextRequest, NextResponse } from 'next/server';
import { initializeAdminApp } from '@/lib/firebase/config';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const { email, password, role, userData } = await request.json();
    const { auth, db } = initializeAdminApp();
    
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: userData.name,
      phoneNumber: userData.phoneNumber,
    });
    
    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      id: userRecord.uid,
      email: userRecord.email,
      name: userData.name,
      phoneNumber: userData.phoneNumber,
      role: role,
      createdAt: Timestamp.now(),
    });
    
    // Create role-specific document
    if (role === 'vehicle_driver') {
      await db.collection('vehicleDrivers').doc(userRecord.uid).set({
        userId: userRecord.uid,
        name: userData.name,
        vehicleNumber: userData.vehicleNumber,
        vehicleType: userData.vehicleType,
        emergencyContactNumber: userData.emergencyContactNumber,
        clinicalHistory: userData.clinicalHistory || '',
      });
    } else if (role === 'ambulance_driver') {
      await db.collection('ambulanceDrivers').doc(userRecord.uid).set({
        userId: userRecord.uid,
        name: userData.name,
        vehicleNumber: userData.vehicleNumber,
        hospitalId: userData.hospitalId || null,
      });
    } else if (role === 'hospital_admin') {
      const hospitalRef = db.collection('hospitals').doc();
      
      await hospitalRef.set({
        id: hospitalRef.id,
        name: userData.hospitalName,
        address: userData.address,
        location: new admin.firestore.GeoPoint(
          userData.location.latitude,
          userData.location.longitude
        ),
        phoneNumber: userData.phoneNumber,
        adminUserId: userRecord.uid,
      });
    }
    
    return NextResponse.json({ success: true, userId: userRecord.uid });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}