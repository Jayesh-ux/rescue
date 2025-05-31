
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Phone, AlertTriangle, Clock, Shield, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DriverDashboard = () => {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const triggerEmergency = () => {
    setEmergencyActive(true);
    // Simulate emergency alert
    console.log("Emergency triggered!");
  };

  const cancelEmergency = () => {
    setEmergencyActive(false);
    console.log("Emergency cancelled");
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
              <span className="text-gray-700">Welcome, Driver</span>
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
                <span className="text-gray-700 px-3 py-2">Welcome, Driver</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
          <p className="text-gray-600 mt-2">Emergency response system for vehicle drivers</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Emergency Panel */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
                  Emergency Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!emergencyActive ? (
                  <div className="text-center py-8">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertTriangle className="w-12 h-12 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Emergency Alert</h3>
                    <p className="text-gray-600 mb-6">Press the button below if you need immediate assistance</p>
                    <Button
                      onClick={triggerEmergency}
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg"
                    >
                      TRIGGER EMERGENCY
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
                    <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <AlertTriangle className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-red-900 mb-2">EMERGENCY ACTIVE</h3>
                    <p className="text-red-700 mb-4">Help is on the way! Ambulance has been notified.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={cancelEmergency}
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-50"
                      >
                        Cancel Emergency
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Family
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Status Panel */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 text-green-600 mr-2" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Connection</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">GPS</span>
                    <span className="text-green-600 font-medium">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Emergency</span>
                    <span className={emergencyActive ? "text-red-600 font-medium" : "text-gray-400"}>
                      {emergencyActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Current Location:</p>
                  <p className="font-medium">Downtown Main Street</p>
                  <p className="text-sm text-gray-500">Coordinates: 40.7128, -74.0060</p>
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
                    <span className="text-gray-600">System Check</span>
                    <span className="text-gray-400">10:30 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GPS Updated</span>
                    <span className="text-gray-400">10:15 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Login</span>
                    <span className="text-gray-400">10:00 AM</span>
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

export default DriverDashboard;
