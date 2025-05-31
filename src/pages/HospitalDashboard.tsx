
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Phone, Building2, Clock, UserCheck, LogOut, Menu, X, Truck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HospitalDashboard = () => {
  const [incomingRequests, setIncomingRequests] = useState([
    {
      id: 1,
      patientLocation: "Downtown Main Street",
      ambulanceETA: "12 minutes",
      severity: "Critical",
      patientInfo: "Male, 45 years, Car Accident",
      ambulanceId: "AMB-001"
    },
    {
      id: 2,
      patientLocation: "Highway 101 Exit 15",
      ambulanceETA: "18 minutes",
      severity: "Moderate",
      patientInfo: "Female, 32 years, Minor Injuries",
      ambulanceId: "AMB-003"
    }
  ]);
  const [acceptedPatients, setAcceptedPatients] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const acceptPatient = (request: any) => {
    setAcceptedPatients([...acceptedPatients, request]);
    setIncomingRequests(incomingRequests.filter(req => req.id !== request.id));
    console.log("Patient accepted:", request);
  };

  const rejectRequest = (requestId: number) => {
    setIncomingRequests(incomingRequests.filter(req => req.id !== requestId));
    console.log("Request rejected:", requestId);
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
              <span className="text-gray-700">Welcome, Hospital Admin</span>
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
                <span className="text-gray-700 px-3 py-2">Welcome, Hospital Admin</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Hospital Dashboard</h1>
          <p className="text-gray-600 mt-2">Emergency patient management system</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Incoming Requests */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-6 h-6 text-orange-600 mr-2" />
                  Incoming Patient Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {incomingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {incomingRequests.map((request) => (
                      <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">{request.ambulanceId}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            request.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {request.severity}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                          <div>
                            <p><strong>Location:</strong> {request.patientLocation}</p>
                            <p><strong>ETA:</strong> {request.ambulanceETA}</p>
                          </div>
                          <div>
                            <p><strong>Patient:</strong> {request.patientInfo}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            onClick={() => acceptPatient(request)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Accept Patient
                          </Button>
                          <Button 
                            onClick={() => rejectRequest(request.id)}
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-50"
                          >
                            Reject
                          </Button>
                          <Button 
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call Ambulance
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Incoming Requests</h3>
                    <p className="text-gray-500">Waiting for patient transfer requests...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Accepted Patients */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="w-6 h-6 text-green-600 mr-2" />
                  Accepted Patients ({acceptedPatients.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {acceptedPatients.length > 0 ? (
                  <div className="space-y-4">
                    {acceptedPatients.map((patient) => (
                      <div key={patient.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-green-900">{patient.ambulanceId}</h4>
                          <span className="px-2 py-1 text-xs bg-green-600 text-white rounded-full">
                            En Route
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700 mb-4">
                          <div>
                            <p><strong>Location:</strong> {patient.patientLocation}</p>
                            <p><strong>ETA:</strong> {patient.ambulanceETA}</p>
                          </div>
                          <div>
                            <p><strong>Patient:</strong> {patient.patientInfo}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <MapPin className="w-4 h-4 mr-2" />
                            Track Ambulance
                          </Button>
                          <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-100">
                            <Phone className="w-4 h-4 mr-2" />
                            Call Ambulance
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Accepted Patients</h3>
                    <p className="text-gray-500">Accept incoming requests to see them here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Hospital Status */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 text-blue-600 mr-2" />
                  Hospital Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Emergency Beds</span>
                    <span className="text-green-600 font-medium">12 Available</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">ICU Beds</span>
                    <span className="text-yellow-600 font-medium">3 Available</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Operating Rooms</span>
                    <span className="text-green-600 font-medium">2 Available</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Staff on Duty</span>
                    <span className="text-green-600 font-medium">24 Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 text-purple-600 mr-2" />
                  Hospital Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Hospital Name:</p>
                  <p className="font-medium">Central General Hospital</p>
                  <p className="text-sm text-gray-600 mt-3">Address:</p>
                  <p className="text-sm text-gray-500">123 Medical Center Dr<br />Healthcare City, HC 12345</p>
                  <p className="text-sm text-gray-600 mt-3">Emergency Contact:</p>
                  <p className="text-sm text-gray-500">(555) 123-4567</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 text-green-600 mr-2" />
                  Today's Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Patients Received</span>
                    <span className="text-gray-900 font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Emergency Cases</span>
                    <span className="text-gray-900 font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Wait Time</span>
                    <span className="text-gray-900 font-medium">15 min</span>
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

export default HospitalDashboard;
