import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../services/databaseService';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Truck, MapPin, Clock, AlertTriangle, Phone, Navigation, UserCheck, Building2 } from 'lucide-react';
import { Accident, Assignment } from '../types/models';
import { useToast } from '../hooks/use-toast';
import { serverTimestamp, Timestamp } from 'firebase/firestore';

const AccidentDispatchPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { toast } = useToast();
    const [pendingAccidents, setPendingAccidents] = useState<Accident[]>([]);
    const [activeAssignments, setActiveAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (currentUser?.role === 'ambulance_driver') {
            loadAmbulanceData();
        } else if (currentUser?.role === 'hospital_admin') {
            loadHospitalData();
        }
    }, [currentUser]);

    const loadAmbulanceData = async () => {
        try {
            setLoading(true);
            const [accidents, assignments] = await Promise.all([
                DatabaseService.getPendingAccidents(),
                DatabaseService.getAssignmentsByAmbulanceDriver(currentUser!.id)
            ]);
            setPendingAccidents(accidents);
            setActiveAssignments(assignments.filter(a => a.status !== 'completed' && a.status !== 'cancelled'));
        } catch (error) {
            console.error('Error loading ambulance data:', error);
            toast({
                title: "Error",
                description: "Failed to load dispatch data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const loadHospitalData = async () => {
        try {
            setLoading(true);
            // For hospital admin, get accidents and assignments for their hospital
            const accidents = await DatabaseService.getPendingAccidents();
            setPendingAccidents(accidents);

            // Get hospital assignments (you'd need to implement this based on hospital ID)
            // const assignments = await DatabaseService.getAssignmentsByHospital(hospitalId);
            // setActiveAssignments(assignments);
        } catch (error) {
            console.error('Error loading hospital data:', error);
            toast({
                title: "Error",
                description: "Failed to load hospital data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const acceptAccident = async (accidentId: string) => {
        try {
            setActionLoading(accidentId);

            // Create assignment - Fixed: Use proper typing for acceptedAt
            const assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'> = {
                accidentId,
                ambulanceDriverId: currentUser!.id,
                hospitalId: '', // This would be determined by nearest hospital logic
                acceptedAt: serverTimestamp() as Timestamp, // Fixed: Cast to Timestamp
                status: 'pending' as const,
                reassignmentCount: 0,
            };

            await DatabaseService.createAssignment(assignmentData);
            await DatabaseService.updateAccidentStatus(accidentId, 'ambulance_assigned');

            toast({
                title: "Emergency Accepted",
                description: "You have been assigned to this emergency. Navigate to the location immediately.",
            });

            // Refresh data
            await loadAmbulanceData();
        } catch (error) {
            console.error('Error accepting accident:', error);
            toast({
                title: "Error",
                description: "Failed to accept emergency assignment",
                variant: "destructive",
            });
        } finally {
            setActionLoading(null);
        }
    };

    const updateAssignmentStatus = async (assignmentId: string, status: Assignment['status']) => {
        try {
            setActionLoading(assignmentId);
            await DatabaseService.updateAssignmentStatus(assignmentId, status);

            const statusMessages = {
                'pending': 'Status updated: Pending',
                'en_route': 'Status updated: En route to emergency',
                'completed': 'Assignment completed successfully',
                'cancelled': 'Assignment cancelled',
                'reassigned': 'Assignment reassigned'
            };

            toast({
                title: "Status Updated",
                description: statusMessages[status] || "Assignment status updated",
            });

            await loadAmbulanceData();
        } catch (error) {
            console.error('Error updating assignment:', error);
            toast({
                title: "Error",
                description: "Failed to update assignment status",
                variant: "destructive",
            });
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'en_route': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'reassigned': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatTimestamp = (timestamp: any) => {
        if (!timestamp) return 'Just now';

        try {
            // Handle Firebase Timestamp
            if (timestamp.toDate) {
                return timestamp.toDate().toLocaleString();
            }
            // Handle regular Date
            if (timestamp instanceof Date) {
                return timestamp.toLocaleString();
            }
            return 'Unknown time';
        } catch (error) {
            return 'Unknown time';
        }
    };

    if (!currentUser || !['ambulance_driver', 'hospital_admin'].includes(currentUser.role)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="max-w-md">
                    <CardContent className="p-6 text-center">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
                        <p className="text-gray-600">This page is only accessible to ambulance drivers and hospital administrators.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dispatch data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Accident Dispatch Center</h1>
                            <p className="text-gray-600 mt-2">
                                {currentUser.role === 'ambulance_driver'
                                    ? 'Accept and manage emergency assignments'
                                    : 'Monitor and coordinate emergency responses'}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Badge variant="outline" className="text-sm">
                                {currentUser.role === 'ambulance_driver' ? 'Ambulance Driver' : 'Hospital Admin'}
                            </Badge>
                            <Button
                                onClick={currentUser.role === 'ambulance_driver' ? loadAmbulanceData : loadHospitalData}
                                variant="outline"
                                size="sm"
                            >
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Pending Accidents */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <AlertTriangle className="w-6 h-6 text-orange-600 mr-2" />
                                Pending Emergencies ({pendingAccidents.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pendingAccidents.length > 0 ? (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {pendingAccidents.map((accident) => (
                                        <div key={accident.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-3">
                                                <Badge variant={accident.triggerType === 'sensor' ? 'destructive' : 'default'}>
                                                    {accident.triggerType === 'sensor' ? 'Sensor Alert' : 'Manual Report'}
                                                </Badge>
                                                <span className="text-sm text-gray-500 flex items-center">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    {formatTimestamp(accident.timestamp)}
                                                </span>
                                            </div>

                                            <div className="space-y-2 text-sm mb-4">
                                                <div className="flex items-center">
                                                    <MapPin className="w-4 h-4 text-blue-600 mr-2" />
                                                    <span>
                                                        Location: {accident.location.latitude.toFixed(4)}, {accident.location.longitude.toFixed(4)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Truck className="w-4 h-4 text-green-600 mr-2" />
                                                    <span>Driver ID: {accident.vehicleDriverId.substring(0, 8)}...</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                                                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(accident.status)}`}>
                                                        {accident.status.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            {currentUser.role === 'ambulance_driver' && accident.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => acceptAccident(accident.id)}
                                                        disabled={actionLoading === accident.id}
                                                        className="bg-red-600 hover:bg-red-700 text-white flex-1"
                                                    >
                                                        {actionLoading === accident.id ? 'Accepting...' : 'Accept Emergency'}
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <Navigation className="w-4 h-4 mr-1" />
                                                        Route
                                                    </Button>
                                                </div>
                                            )}

                                            {currentUser.role === 'hospital_admin' && (
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" className="flex-1">
                                                        <Building2 className="w-4 h-4 mr-1" />
                                                        Assign Hospital
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <Phone className="w-4 h-4 mr-1" />
                                                        Contact
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Emergencies</h3>
                                    <p className="text-gray-500">All emergencies have been assigned or resolved.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Active Assignments */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <UserCheck className="w-6 h-6 text-green-600 mr-2" />
                                Active Assignments ({activeAssignments.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {activeAssignments.length > 0 ? (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {activeAssignments.map((assignment) => (
                                        <div key={assignment.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="font-medium text-green-900">Assignment #{assignment.id.substring(0, 8)}</span>
                                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(assignment.status)}`}>
                                                    {assignment.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="space-y-2 text-sm text-green-700 mb-4">
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-2" />
                                                    <span>Accepted: {formatTimestamp(assignment.acceptedAt)}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Truck className="w-4 h-4 mr-2" />
                                                    <span>Accident ID: {assignment.accidentId.substring(0, 8)}...</span>
                                                </div>
                                                {assignment.hospitalId && (
                                                    <div className="flex items-center">
                                                        <Building2 className="w-4 h-4 mr-2" />
                                                        <span>Hospital: {assignment.hospitalId.substring(0, 8)}...</span>
                                                    </div>
                                                )}
                                            </div>

                                            {currentUser.role === 'ambulance_driver' && (
                                                <div className="space-y-2">
                                                    <div className="flex gap-2">
                                                        {assignment.status === 'pending' && (
                                                            <Button
                                                                onClick={() => updateAssignmentStatus(assignment.id, 'en_route')}
                                                                disabled={actionLoading === assignment.id}
                                                                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                                                            >
                                                                {actionLoading === assignment.id ? 'Updating...' : 'Start Journey'}
                                                            </Button>
                                                        )}

                                                        {assignment.status === 'en_route' && (
                                                            <Button
                                                                onClick={() => updateAssignmentStatus(assignment.id, 'completed')}
                                                                disabled={actionLoading === assignment.id}
                                                                className="bg-green-600 hover:bg-green-700 text-white flex-1"
                                                            >
                                                                {actionLoading === assignment.id ? 'Updating...' : 'Complete Assignment'}
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm" className="flex-1">
                                                            <Navigation className="w-4 h-4 mr-1" />
                                                            Navigate
                                                        </Button>
                                                        <Button variant="outline" size="sm" className="flex-1">
                                                            <Phone className="w-4 h-4 mr-1" />
                                                            Call Patient
                                                        </Button>
                                                        {assignment.status !== 'completed' && (
                                                            <Button
                                                                onClick={() => updateAssignmentStatus(assignment.id, 'cancelled')}
                                                                disabled={actionLoading === assignment.id}
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-red-600 text-red-600 hover:bg-red-50"
                                                            >
                                                                Cancel
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {currentUser.role === 'hospital_admin' && (
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" className="flex-1">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        Track Ambulance
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="flex-1">
                                                        <Phone className="w-4 h-4 mr-1" />
                                                        Contact Driver
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Assignments</h3>
                                    <p className="text-gray-500">
                                        {currentUser.role === 'ambulance_driver'
                                            ? 'Accept emergency requests to see them here.'
                                            : 'No ongoing emergency responses at this time.'}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Statistics Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Emergencies</p>
                                    <p className="text-2xl font-bold text-gray-900">{pendingAccidents.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Truck className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                                    <p className="text-2xl font-bold text-gray-900">{activeAssignments.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                                    <p className="text-2xl font-bold text-gray-900">8 min</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                                    <MapPin className="w-6 h-6 mb-2" />
                                    View Map
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                                    <Phone className="w-6 h-6 mb-2" />
                                    Emergency Contacts
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                                    <Building2 className="w-6 h-6 mb-2" />
                                    Hospital Directory
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                                    <Clock className="w-6 h-6 mb-2" />
                                    Response History
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AccidentDispatchPage;

