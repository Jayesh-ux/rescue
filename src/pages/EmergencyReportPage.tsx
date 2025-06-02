import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEmergencyAlert } from '../hooks/useEmergencyAlert';
import { useGeolocation } from '../hooks/useGeolocation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertTriangle, MapPin, Phone, Clock } from 'lucide-react';

const EmergencyReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { reportEmergency, isReporting, isEmergencyActive, cancelEmergency } = useEmergencyAlert();
  const { latitude, longitude, loading: locationLoading, error: locationError } = useGeolocation();
  const [emergencyType, setEmergencyType] = useState<'manual' | 'sensor'>('manual');

  const handleEmergencyReport = async () => {
    await reportEmergency(emergencyType);
  };

  const handleCancel = async () => {
    await cancelEmergency();
    navigate('/driver-dashboard');
  };

  if (!currentUser || currentUser.role !== 'vehicle_driver') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Access denied. Vehicle drivers only.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-6 h-6 mr-2" />
              Emergency Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isEmergencyActive ? (
              <>
                {/* Location Status */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="font-medium text-blue-900">Location Status</h3>
                  </div>
                  {locationLoading ? (
                    <p className="text-blue-700">Getting your location...</p>
                  ) : locationError ? (
                    <p className="text-red-600">Location error: {locationError}</p>
                  ) : latitude && longitude ? (
                    <p className="text-green-600">
                      Location acquired: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                    </p>
                  ) : (
                    <p className="text-yellow-600">Location not available</p>
                  )}
                </div>

                {/* Emergency Type Selection */}
                <div>
                  <h3 className="font-medium mb-3">Emergency Type</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="manual"
                        checked={emergencyType === 'manual'}
                        onChange={(e) => setEmergencyType(e.target.value as 'manual')}
                        className="mr-2"
                      />
                      Manual Emergency Report
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="sensor"
                        checked={emergencyType === 'sensor'}
                        onChange={(e) => setEmergencyType(e.target.value as 'sensor')}
                        className="mr-2"
                      />
                      Sensor-Triggered Emergency
                    </label>
                  </div>
                </div>

                {/* Emergency Button */}
                <div className="text-center py-6">
                  <Button
                    onClick={handleEmergencyReport}
                    disabled={isReporting || !latitude || !longitude}
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg"
                  >
                    {isReporting ? 'Reporting Emergency...' : 'REPORT EMERGENCY'}
                  </Button>
                </div>

                {/* Info */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium">Response Information</p>
                      <p>Average ambulance response time: 8-12 minutes</p>
                      <p>Your emergency will be immediately dispatched to nearby ambulances</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Emergency Active State */
              <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
                <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <AlertTriangle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-red-900 mb-2">EMERGENCY ACTIVE</h3>
                <p className="text-red-700 mb-6">
                  Your emergency has been reported. Ambulance dispatch is in progress.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    Cancel Emergency
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Emergency Contact
                  </Button>
                </div>
              </div>
            )}

            {/* Back Button */}
            <div className="text-center">
              <Button
                onClick={() => navigate('/driver-dashboard')}
                variant="outline"
                className="mt-4"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyReportPage;
