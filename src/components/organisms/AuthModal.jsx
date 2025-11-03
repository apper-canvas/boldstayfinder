import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { toast } from "react-toastify";

const AuthModal = ({ isOpen, onClose, bookingData = null }) => {
  const [mode, setMode] = useState("login"); // login or signup
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: ""
  });

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate auth process
    toast.success(`Welcome to StayFinder!`);
    onClose();
  };

  const benefits = [
    {
      icon: "Heart",
      title: "Save your favorites",
      description: "Keep track of places you love and want to visit"
    },
    {
      icon: "Clock",
      title: "Faster booking",
      description: "Skip the forms with saved payment and personal info"
    },
    {
      icon: "Shield",
      title: "Secure booking",
      description: "Your payment information is protected and encrypted"
    },
    {
      icon: "MessageCircle",
      title: "24/7 Support",
      description: "Get help whenever you need it during your stay"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          {/* Benefits Side */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {bookingData ? "Complete your booking" : "Join StayFinder"}
              </h2>
              <p className="text-gray-600">
                Create an account to unlock exclusive features and secure your perfect stay
              </p>
            </div>

{/* Sign up/Login Benefits */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Why create an account?</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Check" size={14} className="text-secondary" />
                  <span>Save your favorite properties</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Check" size={14} className="text-secondary" />
                  <span>Faster booking process</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Check" size={14} className="text-secondary" />
                  <span>Access exclusive member rates</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Check" size={14} className="text-secondary" />
                  <span>Trip management and history</span>
                </div>
              </div>
            </div>

            {bookingData && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Your Selection</h3>
                <p className="text-sm text-gray-600 mb-1">{bookingData.propertyTitle}</p>
                <p className="text-sm text-gray-600 mb-2">
                  {bookingData.checkIn} - {bookingData.checkOut}
                </p>
                <p className="font-semibold text-primary">${bookingData.totalPrice} total</p>
              </div>
            )}

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <ApperIcon name={benefit.icon} size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setMode("login")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mode === "login" 
                      ? "bg-primary text-white" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Log in
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mode === "signup" 
                      ? "bg-primary text-white" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Sign up
                </button>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                  />
                  <Input
                    label="Last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                  />
                </div>
              )}

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />

              <Button type="submit" className="w-full">
                {mode === "login" ? "Log in" : "Create account"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center mb-4">
                <span className="text-gray-500 text-sm">Or continue with</span>
              </div>
              <div className="space-y-3">
<button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-5 h-5 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  <span className="font-medium text-gray-700">Continue with Google</span>
                </button>
                <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">f</span>
                  </div>
                  <span className="font-medium text-gray-700">Continue with Facebook</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;