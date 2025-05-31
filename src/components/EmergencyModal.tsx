
import { useState } from "react";
import { Phone, MapPin, User, Clock, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencyModal = ({ isOpen, onClose }: EmergencyModalProps) => {
  const [emergencyType, setEmergencyType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [isLocationSharing, setIsLocationSharing] = useState(false);

  const emergencyTypes = [
    { id: "accident", label: "Vehicle Accident", icon: AlertTriangle, color: "bg-red-500" },
    { id: "medical", label: "Medical Emergency", icon: Phone, color: "bg-blue-500" },
    { id: "breakdown", label: "Vehicle Breakdown", icon: MapPin, color: "bg-yellow-500" },
  ];

  const handleGetLocation = () => {
    setIsLocationSharing(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setIsLocationSharing(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation("Location unavailable");
          setIsLocationSharing(false);
        }
      );
    } else {
      setLocation("Geolocation not supported");
      setIsLocationSharing(false);
    }
  };

  const handleEmergencyCall = () => {
    if (emergencyType && location) {
      // Simulate emergency dispatch
      alert(`Emergency dispatched!\nType: ${emergencyTypes.find(t => t.id === emergencyType)?.label}\nLocation: ${location}\n\nHelp is on the way!`);
      onClose();
    } else {
      alert("Please select emergency type and share location first.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-red-600 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Emergency Help
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Type
            </label>
            <div className="space-y-2">
              {emergencyTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setEmergencyType(type.id)}
                  className={`w-full flex items-center p-3 rounded-lg border-2 transition-colors ${
                    emergencyType === type.id
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${type.color} flex items-center justify-center mr-3`}>
                    <type.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="flex space-x-2">
              <Button
                onClick={handleGetLocation}
                disabled={isLocationSharing}
                variant="outline"
                className="flex-1"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {isLocationSharing ? "Getting Location..." : "Share Location"}
              </Button>
            </div>
            {location && (
              <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                📍 {location}
              </p>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Quick Response</p>
                <p>Average response time: 8-12 minutes</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleEmergencyCall}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              disabled={!emergencyType || !location}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call for Help
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              For life-threatening emergencies, call 911 immediately
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyModal;
