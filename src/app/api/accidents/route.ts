
import { NextRequest, NextResponse } from 'next/server';
import { initializeAdminApp } from '@/lib/firebase/config';
import { Timestamp } from 'firebase-admin/firestore';
import { verifyAuth } from '@/lib/auth';

// Create a new accident
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { db, auth } = initializeAdminApp();
    const decodedToken = await auth.verifyIdToken(token);
    
    // Verify user is a vehicle driver
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'vehicle_driver') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    const { location, triggerType } = await request.json();
    
    // Create accident document
    const accidentRef = db.collection('accidents').doc();
    await accidentRef.set({
      id: accidentRef.id,
      vehicleDriverId: decodedToken.uid,
      location: location,
      timestamp: Timestamp.now(),
      triggerType: triggerType,
      status: 'pending',
    });
    
    // Find nearest ambulances and hospitals
    // This would involve geospatial queries which are complex in Firestore
    // For simplicity, we'll just get all hospitals for now
    const hospitalsSnapshot = await db.collection('hospitals').limit(5).get();
    const hospitals = hospitalsSnapshot.docs.map(doc => doc.data());
    
    // Notify hospitals (in a real app, this would use FCM or similar)
    // For now, we'll just return the accident ID
    
    return NextResponse.json({ 
      success: true, 
      accidentId: accidentRef.id,
      nearbyHospitals: hospitals 
    });
  } catch (error: any) {
    console.error('Accident creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create accident report' },
      { status: 500 }
    );
  }
}

// Get all accidents (with filtering)
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { db, auth } = initializeAdminApp();
    const decodedToken = await auth.verifyIdToken(token);
    
    // Get user role
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const userRole = userDoc.data()?.role;
    let accidentsQuery = db.collection('accidents');
    
    // Filter based on role
    if (userRole === 'vehicle_driver') {
      accidentsQuery = accidentsQuery.where('vehicleDriverId', '==', decodedToken.uid);
    } else if (userRole === 'hospital_admin') {
      // Get hospital ID for this admin
      const hospitalDoc = await db.collection('hospitals')
        .where('adminUserId', '==', decodedToken.uid)
        .limit(1)
        .get();
      
      if (hospitalDoc.empty) {
        return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
      }
      
      const hospitalId = hospitalDoc.docs[0].id;
      
      // Get assignments for this hospital
      const assignmentsSnapshot = await db.collection('assignments')
        .where('hospitalId', '==', hospitalId)
        .get();
      
      const accidentIds = assignmentsSnapshot.docs.map(doc => doc.data().accidentId);
      
      if (accidentIds.length > 0) {
        accidentsQuery = accidentsQuery.where('id', 'in', accidentIds);
      } else {
        return NextResponse.json({ accidents: [] });
      }
    }
    
    const accidentsSnapshot = await accidentsQuery.orderBy('timestamp', 'desc').get();
    const accidents = accidentsSnapshot.docs.map(doc => doc.data());
    
    return NextResponse.json({ accidents });
  } catch (error: any) {
    console.error('Get accidents error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch accidents' },
      { status: 500 }
    );
  }
}
