
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Phone, Truck, Clock, CheckCircle, LogOut, Menu, X, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AmbulanceDashboard = () => {
  const [activeEmergency, setActiveEmergency] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const emergencyAlerts = [
    {
      id: 1,
      location: "Downtown Main Street",
      distance: "2.3 km",
      time: "2 min ago",
      severity: "High",
      coordinates: "40.7128, -74.0060"
    },
    {
      id: 2,
      location: "Highway 101 Exit 15",
      distance: "5.1 km",
      time: "5 min ago",
      severity: "Medium",
      coordinates: "40.7589, -73.9851"
    }
  ];

  const acceptEmergency = (emergency: any) => {
    setActiveEmergency(emergency);
    console.log("Emergency accepted:", emergency);
  };

  const completeEmergency = () => {
    setActiveEmergency(null);
    console.log("Emergency completed");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">LifeLine</span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <span className="text-gray-700">Welcome, Ambulance Team</span>
              <Link to="/">
                <Button variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </Link>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-2">
                <span className="text-gray-700 px-3 py-2">Welcome, Ambulance Team</span>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ambulance Dashboard</h1>
          <p className="text-gray-600 mt-2">Emergency response dispatch system</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Emergency Alerts */}
          <div className="lg:col-span-2">
            {activeEmergency ? (
              <Card className="border-0 shadow-lg border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-600">
                    <Truck className="w-6 h-6 mr-2" />
                    Active Emergency
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-red-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-red-900">En Route to Emergency</h3>
                      <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">Active</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-red-700"><strong>Location:</strong> {activeEmergency.location}</p>
                        <p className="text-red-700"><strong>Distance:</strong> {activeEmergency.distance}</p>
                        <p className="text-red-700"><strong>Coordinates:</strong> {activeEmergency.coordinates}</p>
                      </div>
                      <div>
                        <p className="text-red-700"><strong>Severity:</strong> {activeEmergency.severity}</p>
                        <p className="text-red-700"><strong>Time:</strong> {activeEmergency.time}</p>
                        <p className="text-red-700"><strong>ETA:</strong> 8 minutes</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Navigation className="w-4 h-4 mr-2" />
                      Open Navigation
                    </Button>
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Hospital
                    </Button>
                    <Button onClick={completeEmergency} className="bg-gray-600 hover:bg-gray-700 text-white">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="w-6 h-6 text-blue-600 mr-2" />
                    Emergency Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {emergencyAlerts.length > 0 ? (
                    <div className="space-y-4">
                      {emergencyAlerts.map((emergency) => (
                        <div key={emergency.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">{emergency.location}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              emergency.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {emergency.severity}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                            <div>
                              <p><strong>Distance:</strong> {emergency.distance}</p>
                              <p><strong>Time:</strong> {emergency.time}</p>
                            </div>
                            <div>
                              <p><strong>Coordinates:</strong> {emergency.coordinates}</p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => acceptEmergency(emergency)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                          >
                            Accept Emergency
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Emergencies</h3>
                      <p className="text-gray-500">Waiting for emergency alerts...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Status Panel */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Vehicle Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Availability</span>
                    <span className="text-green-600 font-medium">Available</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Fuel Level</span>
                    <span className="text-green-600 font-medium">85%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Medical Supplies</span>
                    <span className="text-green-600 font-medium">Full</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">GPS Signal</span>
                    <span className="text-green-600 font-medium">Strong</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                  Current Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Station Location:</p>
                  <p className="font-medium">Central Emergency Station</p>
                  <p className="text-sm text-gray-500">Coordinates: 40.7589, -73.9851</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 text-purple-600 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Emergency Completed</span>
                    <span className="text-gray-400">1 hour ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle Check</span>
                    <span className="text-gray-400">2 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shift Started</span>
                    <span className="text-gray-400">6:00 AM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AmbulanceDashboard;
