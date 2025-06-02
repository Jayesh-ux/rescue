import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface LocationPickerProps {
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
  initialLocation?: { latitude: number; longitude: number };
  disabled?: boolean;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 28.6139, // Delhi coordinates as default
  lng: 77.2090
};

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation,
  disabled = false
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation ? { lat: initialLocation.latitude, lng: initialLocation.longitude } : null
  );
  const [mapCenter, setMapCenter] = useState(
    initialLocation ? { lat: initialLocation.latitude, lng: initialLocation.longitude } : defaultCenter
  );

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (disabled || !event.latLng) return;
    
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    setSelectedLocation({ lat, lng });
    onLocationSelect({ latitude: lat, longitude: lng });
  }, [onLocationSelect, disabled]);

  const getCurrentLocation = () => {
    if (disabled) return;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setSelectedLocation({ lat, lng });
          setMapCenter({ lat, lng });
          onLocationSelect({ latitude: lat, longitude: lng });
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Location</CardTitle>
        <Button 
          onClick={getCurrentLocation} 
          disabled={disabled}
          variant="outline"
          className="w-fit"
        >
          Use Current Location
        </Button>
      </CardHeader>
      <CardContent>
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={13}
            onClick={onMapClick}
          >
            {selectedLocation && (
              <Marker position={selectedLocation} />
            )}
          </GoogleMap>
        </LoadScript>
      </CardContent>
    </Card>
  );
};
