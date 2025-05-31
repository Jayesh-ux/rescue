
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "vehicle_driver" as "vehicle_driver" | "ambulance_driver" | "hospital_admin",
    // Vehicle Driver specific
    vehicleNumber: "",
    vehicleType: "",
    emergencyContactNumber: "",
    clinicalHistory: "",
    // Hospital specific
    hospitalName: "",
    hospitalAddress: "",
    hospitalPhoneNumber: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    // Here you would integrate with Firebase Auth and Firestore
    console.log("Registration data:", {
      // Base User object
      user: {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        // password will be handled by Firebase Auth
      },
      // Role-specific data
      roleSpecificData: getRoleSpecificData()
    });
    
    // Simulate registration - redirect to login
    window.location.href = "/login";
  };

  const getRoleSpecificData = () => {
    switch (formData.role) {
      case "vehicle_driver":
        return {
          vehicleNumber: formData.vehicleNumber,
          vehicleType: formData.vehicleType,
          emergencyContactNumber: formData.emergencyContactNumber,
          clinicalHistory: formData.clinicalHistory || undefined
        };
      case "ambulance_driver":
        return {
          vehicleNumber: formData.vehicleNumber,
          hospitalId: undefined // Will be assigned when accepting requests
        };
      case "hospital_admin":
        return {
          name: formData.hospitalName,
          address: formData.hospitalAddress,
          phoneNumber: formData.hospitalPhoneNumber,
          // location (GeoPoint) would be set via geocoding the address
        };
      default:
        return {};
    }
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case "vehicle_driver":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="vehicleNumber">Vehicle Number</Label>
              <Input
                id="vehicleNumber"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="Enter vehicle number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Input
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                placeholder="e.g., Car, Motorcycle, Truck"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactNumber">Emergency Contact Number</Label>
              <Input
                id="emergencyContactNumber"
                name="emergencyContactNumber"
                type="tel"
                value={formData.emergencyContactNumber}
                onChange={handleChange}
                placeholder="Family member emergency contact"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinicalHistory">Clinical History (Optional)</Label>
              <Textarea
                id="clinicalHistory"
                name="clinicalHistory"
                value={formData.clinicalHistory}
                onChange={handleChange}
                placeholder="Any relevant medical history"
                className="min-h-[80px]"
              />
            </div>
          </>
        );
      case "ambulance_driver":
        return (
          <div className="space-y-2">
            <Label htmlFor="vehicleNumber">Ambulance Number</Label>
            <Input
              id="vehicleNumber"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              placeholder="Enter ambulance number"
              required
            />
          </div>
        );
      case "hospital_admin":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="hospitalName">Hospital Name</Label>
              <Input
                id="hospitalName"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                placeholder="Enter hospital name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hospitalAddress">Hospital Address</Label>
              <Textarea
                id="hospitalAddress"
                name="hospitalAddress"
                value={formData.hospitalAddress}
                onChange={handleChange}
                placeholder="Enter complete hospital address"
                className="min-h-[80px]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hospitalPhoneNumber">Hospital Phone Number</Label>
              <Input
                id="hospitalPhoneNumber"
                name="hospitalPhoneNumber"
                type="tel"
                value={formData.hospitalPhoneNumber}
                onChange={handleChange}
                placeholder="Hospital contact number"
                required
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900">LifeLine</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-6">Join LifeLine</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        {/* Register Form */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Register</h2>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">Register as</Label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="vehicle_driver">Vehicle Driver</option>
                  <option value="ambulance_driver">Ambulance Driver</option>
                  <option value="hospital_admin">Hospital Admin</option>
                </select>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {/* Role-specific fields */}
              {renderRoleSpecificFields()}

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2"
              >
                Create Account
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-red-600 hover:text-red-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
