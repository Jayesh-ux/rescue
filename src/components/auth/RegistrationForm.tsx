import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/use-toast';
import { VehicleDriverData, AmbulanceDriverData, HospitalAdminData } from '../../types/models';

export const RegistrationForm: React.FC = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Common fields
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: '' as 'vehicle_driver' | 'ambulance_driver' | 'hospital_admin' | '',
    
    // Vehicle driver specific
    vehicleNumber: '',
    vehicleType: '',
    emergencyContactNumber: '',
    clinicalHistory: '',
    
    // Hospital admin specific
    hospitalName: '',
    hospitalAddress: '',
    hospitalPhoneNumber: '',
    hospitalLatitude: '',
    hospitalLongitude: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      let userData: VehicleDriverData | AmbulanceDriverData | HospitalAdminData;
      
      const baseData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: formData.role,
      };

      switch (formData.role) {
        case 'vehicle_driver':
          userData = {
            ...baseData,
            role: 'vehicle_driver',
            vehicleNumber: formData.vehicleNumber,
            vehicleType: formData.vehicleType,
            emergencyContactNumber: formData.emergencyContactNumber,
            clinicalHistory: formData.clinicalHistory,
          } as VehicleDriverData;
          break;
          
        case 'ambulance_driver':
          userData = {
            ...baseData,
            role: 'ambulance_driver',
            vehicleNumber: formData.vehicleNumber,
          } as AmbulanceDriverData;
          break;
          
        case 'hospital_admin':
          userData = {
            ...baseData,
            role: 'hospital_admin',
            hospitalName: formData.hospitalName,
            hospitalAddress: formData.hospitalAddress,
            hospitalPhoneNumber: formData.hospitalPhoneNumber,
            hospitalLocation: {
              latitude: parseFloat(formData.hospitalLatitude),
              longitude: parseFloat(formData.hospitalLongitude),
            },
          } as HospitalAdminData;
          break;
          
        default:
          throw new Error('Invalid role selected');
      }

      await register(userData);
      
      toast({
        title: "Success",
        description: "Registration successful!",
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Registration failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.phoneNumber || !formData.password || !formData.role)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const prevStep = () => setStep(1);

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vehicle_driver">Vehicle Driver</SelectItem>
            <SelectItem value="ambulance_driver">Ambulance Driver</SelectItem>
            <SelectItem value="hospital_admin">Hospital Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={nextStep} className="w-full">
        Next
      </Button>
    </div>
  );

  const renderStep2 = () => {
    switch (formData.role) {
      case 'vehicle_driver':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleNumber">Vehicle Number</Label>
              <Input
                id="vehicleNumber"
                type="text"
                value={formData.vehicleNumber}
                onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Input
                id="vehicleType"
                type="text"
                value={formData.vehicleType}
                onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                placeholder="e.g., Car, Motorcycle, Truck"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactNumber">Emergency Contact Number</Label>
              <Input
                id="emergencyContactNumber"
                type="tel"
                value={formData.emergencyContactNumber}
                onChange={(e) => handleInputChange('emergencyContactNumber', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinicalHistory">Clinical History (Optional)</Label>
              <Textarea
                id="clinicalHistory"
                value={formData.clinicalHistory}
                onChange={(e) => handleInputChange('clinicalHistory', e.target.value)}
                placeholder="Any medical conditions, allergies, medications..."
              />
            </div>
          </div>
        );

      case 'ambulance_driver':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleNumber">Ambulance Number</Label>
              <Input
                id="vehicleNumber"
                type="text"
                value={formData.vehicleNumber}
                onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                required
              />
            </div>
          </div>
        );

      case 'hospital_admin':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hospitalName">Hospital Name</Label>
              <Input
                id="hospitalName"
                type="text"
                value={formData.hospitalName}
                onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hospitalAddress">Hospital Address</Label>
              <Textarea
                id="hospitalAddress"
                value={formData.hospitalAddress}
                onChange={(e) => handleInputChange('hospitalAddress', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hospitalPhoneNumber">Hospital Phone Number</Label>
              <Input
                id="hospitalPhoneNumber"
                type="tel"
                value={formData.hospitalPhoneNumber}
                onChange={(e) => handleInputChange('hospitalPhoneNumber', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hospitalLatitude">Latitude</Label>
                <Input
                  id="hospitalLatitude"
                  type="number"
                  step="any"
                  value={formData.hospitalLatitude}
                  onChange={(e) => handleInputChange('hospitalLatitude', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospitalLongitude">Longitude</Label>
                <Input
                  id="hospitalLongitude"
                  type="number"
                  step="any"
                  value={formData.hospitalLongitude}
                  onChange={(e) => handleInputChange('hospitalLongitude', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Register - Step {step} of 2</CardTitle>
        <CardDescription>
          {step === 1 ? 'Enter your basic information' : 'Enter role-specific details'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {step === 1 ? renderStep1() : renderStep2()}
          
          {step === 2 && (
            <div className="flex gap-2 mt-4">
              <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                Back
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};