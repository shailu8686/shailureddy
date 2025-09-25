import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Smartphone, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn(formData.email, formData.password);
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Illustration */}
          <div className="lg:w-1/2 bg-gradient-to-br from-purple-50 to-blue-50 p-12 flex items-center justify-center relative overflow-hidden">
            <div className="relative z-10 text-center w-full max-w-md">
              {/* ATM and Person Illustration */}
              <div className="relative mb-8">
                {/* Background Elements */}
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-purple-200 rounded-3xl opacity-50 transform rotate-12"></div>
                <div className="absolute -top-4 right-8 w-16 h-16 bg-blue-200 rounded-2xl opacity-50 transform -rotate-12"></div>
                <div className="absolute bottom-8 -left-4 w-12 h-12 bg-pink-200 rounded-xl opacity-50"></div>
                <div className="absolute bottom-6 right-6 w-10 h-10 bg-green-200 rounded-lg opacity-50 transform rotate-45"></div>
                
                {/* ATM Machine */}
                <div className="relative mb-6">
                  {/* ATM Base */}
                  <div className="mx-auto w-48 h-64 bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg relative shadow-lg">
                    {/* ATM Screen */}
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-gradient-to-b from-blue-900 to-blue-800 rounded border-4 border-gray-600">
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center">
                        <div className="text-white text-xs font-bold">UPI READY</div>
                      </div>
                    </div>
                    
                    {/* ATM Keypad */}
                    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 grid grid-cols-3 gap-1 w-20">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-5 h-4 bg-gray-500 rounded-sm"></div>
                      ))}
                    </div>
                    
                    {/* Card Slot */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-gray-900 rounded"></div>
                    
                    {/* Cash Dispenser */}
                    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-gray-900 rounded"></div>
                    
                    {/* ATM Logo */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded"></div>
                  </div>
                </div>

                {/* Person with Phone */}
                <div className="relative -mt-16 flex justify-center">
                  {/* Person Figure */}
                  <div className="relative">
                    {/* Head */}
                    <div className="w-16 h-16 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full mx-auto mb-2 relative">
                      {/* Hair */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-18 h-12 bg-gradient-to-b from-amber-800 to-amber-700 rounded-t-full"></div>
                      {/* Eyes */}
                      <div className="absolute top-5 left-4 w-2 h-1 bg-gray-800 rounded-full"></div>
                      <div className="absolute top-5 right-4 w-2 h-1 bg-gray-800 rounded-full"></div>
                      {/* Mouth */}
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-gray-600 rounded-full"></div>
                    </div>

                    {/* Body */}
                    <div className="w-12 h-24 bg-gradient-to-b from-blue-500 to-blue-600 rounded-lg mx-auto relative">
                      {/* Arms */}
                      <div className="absolute top-4 -left-4 w-8 h-3 bg-orange-300 rounded-full transform -rotate-12"></div>
                      <div className="absolute top-4 -right-4 w-8 h-3 bg-orange-300 rounded-full transform rotate-12"></div>
                      
                      {/* Phone in Hand */}
                      <div className="absolute top-2 -right-6 w-4 h-6 bg-gradient-to-b from-gray-800 to-gray-900 rounded transform rotate-12">
                        <div className="w-3 h-4 bg-gradient-to-b from-blue-400 to-blue-500 rounded m-0.5 mt-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full mx-auto mt-1"></div>
                          <div className="w-2 h-0.5 bg-white rounded mx-auto mt-1"></div>
                          <div className="w-1.5 h-0.5 bg-white rounded mx-auto"></div>
                        </div>
                      </div>
                      
                      {/* Shirt Details */}
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-8 bg-blue-400 rounded"></div>
                    </div>

                    {/* Legs */}
                    <div className="flex justify-center gap-1 mt-1">
                      <div className="w-4 h-16 bg-gradient-to-b from-gray-600 to-gray-700 rounded-lg"></div>
                      <div className="w-4 h-16 bg-gradient-to-b from-gray-600 to-gray-700 rounded-lg"></div>
                    </div>

                    {/* Feet */}
                    <div className="flex justify-center gap-2 mt-1">
                      <div className="w-6 h-3 bg-gray-800 rounded-lg"></div>
                      <div className="w-6 h-3 bg-gray-800 rounded-lg"></div>
                    </div>
                  </div>
                </div>

                {/* Digital Elements Floating Around */}
                <div className="absolute top-16 left-8 w-8 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded flex items-center justify-center opacity-80">
                  <div className="text-white text-xs font-bold">₹</div>
                </div>
                <div className="absolute top-24 right-12 w-10 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded opacity-80">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                  </div>
                </div>
                <div className="absolute top-32 left-12 w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-80 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded"></div>
                </div>
                <div className="absolute bottom-24 right-8 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg opacity-80"></div>
                
                {/* UPI Transaction Elements */}
                <div className="absolute top-20 right-16 w-12 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded opacity-80 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">UPI</span>
                </div>
                <div className="absolute bottom-32 left-16 w-10 h-6 bg-gradient-to-r from-teal-400 to-cyan-400 rounded opacity-80 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="flex justify-center space-x-4 mb-6">
                <div className="w-4 h-4 bg-purple-400 rounded-full opacity-60 animate-pulse"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-5 h-5 bg-pink-400 rounded-full opacity-60 animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>

              {/* Title */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Secure UPI Payments</h3>
                <p className="text-gray-600 text-sm">Manage your transactions with confidence</p>
              </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600"></div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="lg:w-1/2 p-12 flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Hello,
                </h1>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Welcome back
                </h2>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Username or email"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  
                  <button
                    type="button"
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Login'}
                </button>
              </form>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </div>

              {/* App Store Badges */}
              <div className="flex justify-center space-x-4 mt-8">
                <div className="flex items-center bg-black text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <Smartphone className="w-5 h-5 mr-2" />
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </div>
                <div className="flex items-center bg-black text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <Download className="w-5 h-5 mr-2" />
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
