import { useState, useCallback } from 'react';
import { serverTimestamp } from 'firebase/firestore'; // Add this import
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../services/databaseService';
import { useGeolocation } from './useGeolocation';
import { useToast } from './use-toast';

interface EmergencyAlertState {
  isReporting: boolean;
  isEmergencyActive: boolean;
  accidentId: string | null;
}

export const useEmergencyAlert = () => {
  const { currentUser } = useAuth();
  const { latitude, longitude } = useGeolocation();
  const { toast } = useToast();
  
  const [state, setState] = useState<EmergencyAlertState>({
    isReporting: false,
    isEmergencyActive: false,
    accidentId: null,
  });

  const reportEmergency = useCallback(async (triggerType: 'manual' | 'sensor' = 'manual') => {
    if (!currentUser || !latitude || !longitude) {
      toast({
        title: "Error",
        description: "Unable to get your location. Please enable location services.",
        variant: "destructive",
      });
      return;
    }

    setState(prev => ({ ...prev, isReporting: true }));

    try {
      const accidentData = {
        vehicleDriverId: currentUser.id,
        location: {
          latitude,
          longitude,
        },
        timestamp: serverTimestamp(), // This now works perfectly
        triggerType,
        status: 'pending' as const,
      };

      const accidentId = await DatabaseService.createAccident(accidentData);
      
      setState(prev => ({
        ...prev,
        isReporting: false,
        isEmergencyActive: true,
        accidentId,
      }));

      toast({
        title: "Emergency Reported",
        description: "Your emergency has been reported. Help is on the way!",
      });

    } catch (error) {
      console.error('Error reporting emergency:', error);
      setState(prev => ({ ...prev, isReporting: false }));
      
      toast({
        title: "Error",
        description: "Failed to report emergency. Please try again.",
        variant: "destructive",
      });
    }
  }, [currentUser, latitude, longitude, toast]);

  const cancelEmergency = useCallback(async () => {
    if (!state.accidentId) return;

    try {
      await DatabaseService.updateAccidentStatus(state.accidentId, 'cancelled');
      
      setState({
        isReporting: false,
        isEmergencyActive: false,
        accidentId: null,
      });

      toast({
        title: "Emergency Cancelled",
        description: "Your emergency report has been cancelled.",
      });

    } catch (error) {
      console.error('Error cancelling emergency:', error);
      toast({
        title: "Error",
        description: "Failed to cancel emergency.",
        variant: "destructive",
      });
    }
  }, [state.accidentId, toast]);

  return {
    ...state,
    reportEmergency,
    cancelEmergency,
    hasLocation: latitude !== null && longitude !== null,
  };
};
