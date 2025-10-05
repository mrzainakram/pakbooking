'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft,
  User, Shield, Sparkles, Star, Heart, Zap
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

type AuthMode = 'login' | 'register';

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  const router = useRouter();

  const loginForm = useForm<LoginForm>();
  const registerForm = useForm<RegisterForm>();

  // Simple validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateName = (name: string) => {
    return name.length >= 2;
  };

  const handleLogin = async (data: LoginForm) => {
    // Simple validation
    if (!validateEmail(data.email)) {
      alert('Please enter a valid email address');
      return;
    }
    if (!validatePassword(data.password)) {
      alert('Password must be at least 6 characters');
      return;
    }
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (error) {
      // Error handled by auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    // Simple validation
    if (!validateEmail(data.email)) {
      alert('Please enter a valid email address');
      return;
    }
    if (!validatePassword(data.password)) {
      alert('Password must be at least 6 characters');
      return;
    }
    if (!validateName(data.first_name)) {
      alert('First name must be at least 2 characters');
      return;
    }
    if (!validateName(data.last_name)) {
      alert('Last name must be at least 2 characters');
      return;
    }
    
    try {
      setIsLoading(true);
      await register(data);
      setAuthMode('login');
    } catch (error) {
      // Error handled by auth context
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: <Shield className="w-6 h-6" />, text: "Secure Authentication", color: "text-primary-500" },
    { icon: <Star className="w-6 h-6" />, text: "Premium Experience", color: "text-accent-500" },
    { icon: <Heart className="w-6 h-6" />, text: "Trusted by Thousands", color: "text-secondary-500" },
    { icon: <Zap className="w-6 h-6" />, text: "Instant Access", color: "text-primary-500" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600" />
        <div className="absolute inset-0 bg-mesh opacity-30" />
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <div className="flex items-center space-x-4 mb-12">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                <span className="text-white font-black text-2xl">P</span>
              </div>
              <div>
                <h1 className="text-4xl font-display font-black text-gradient">PakBooking</h1>
                <div className="h-1 bg-gradient-to-r from-white to-transparent rounded-full mt-2" />
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-black mb-6 text-3d">
              Welcome to the Future of Booking
            </h2>

            <p className="text-xl mb-8 leading-relaxed opacity-90">
              Experience seamless hotel booking with cutting-edge technology, stunning interfaces, and unmatched security.
            </p>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-4 p-4 rounded-2xl glass hover:bg-white/10 transition-all duration-300"
                >
                  <div className={`p-3 rounded-xl ${feature.color} bg-white/20`}>
                    {feature.icon}
                  </div>
                  <span className="text-lg font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              {[
                { number: '50K+', label: 'Happy Users' },
                { number: '1000+', label: 'Properties' },
                { number: '99%', label: 'Satisfaction' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-black mb-1">{stat.number}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-black text-xl">P</span>
              </div>
              <span className="text-2xl font-display font-black text-gradient">PakBooking</span>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mb-8">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </motion.button>
            </Link>
          </div>
          
          {/* Auth Mode Tabs */}
          <div className="flex glass-dark rounded-2xl p-2 mb-8">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                authMode === 'login'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-2xl btn-3d' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                authMode === 'register'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-2xl btn-3d' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Auth Card */}
          <div className="card-dark p-8">
            <AnimatePresence mode="wait">
              {/* Login Form */}
              {authMode === 'login' && (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={loginForm.handleSubmit(handleLogin)}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-black mb-3 text-white text-3d">
                      Welcome Back!
                    </h2>
                    <p className="text-gray-400 text-lg">
                      Sign in to continue your journey
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-500 w-5 h-5" />
                      <input
                        {...loginForm.register('email')}
                        type="email"
                        className="input-3d-dark pl-12 w-full"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-500 w-5 h-5" />
                      <input
                        {...loginForm.register('password')}
                        type={showPassword ? 'text' : 'password'}
                        className="input-3d-dark pl-12 pr-12 w-full"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-2 border-gray-600 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-sm text-gray-400">Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="text-sm font-bold text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-3d w-full py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <div className="spinner" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}

              {/* Register Form */}
              {authMode === 'register' && (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={registerForm.handleSubmit(handleRegister)}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-black mb-3 text-white text-3d">
                      Join Us Today!
                    </h2>
                    <p className="text-gray-400 text-lg">
                      Create your account and start exploring
                    </p>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500 w-4 h-4" />
                        <input
                          {...registerForm.register('first_name')}
                          type="text"
                          className="input-3d-dark pl-10 w-full"
                          placeholder="First name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500 w-4 h-4" />
                        <input
                          {...registerForm.register('last_name')}
                          type="text"
                          className="input-3d-dark pl-10 w-full"
                          placeholder="Last name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500 w-4 h-4" />
                      <input
                        {...registerForm.register('email')}
                        type="email"
                        className="input-3d-dark pl-10 w-full"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-500 w-4 h-4" />
                      <input
                        {...registerForm.register('password')}
                        type={showPassword ? 'text' : 'password'}
                        className="input-3d-dark pl-10 pr-10 w-full"
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-3d w-full py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <div className="spinner" />
                    ) : (
                      <>
                        <User className="w-5 h-5" />
                        <span>Create Account</span>
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Social Login */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-dark-900 text-gray-500 font-bold">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-dark p-4 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <div className="w-5 h-5 bg-white rounded" />
                  <span className="font-medium text-white">Google</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-dark p-4 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <div className="w-5 h-5 bg-blue-600 rounded" />
                  <span className="font-medium text-white">Facebook</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 