import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, Church } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access
  const from = location.state?.from?.pathname || '/member-portal';

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      console.log('Attempting login with:', data.email);
      const result = await login(data.email, data.password);
      
      console.log('Login result:', result);
      
      if (result.success && result.user) {
        console.log('Login successful, user role:', result.user.role);
        console.log('Token stored:', !!localStorage.getItem('authToken'));
        
        // Determine redirect path based on user role
        let redirectPath = from;
        if (result.user.role === 'admin') {
          redirectPath = '/admin';
        } else if (result.user.role === 'member') {
          redirectPath = '/member-portal';
        } else {
          redirectPath = '/';
        }
        
        console.log('Redirecting to:', redirectPath);
        
        // Redirect to appropriate page
        navigate(redirectPath, { replace: true });
      } else {
        console.log('Login failed:', result.message);
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Church className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Member Login</h1>
            <p className="text-gray-600 dark:text-gray-300">Access your church member portal</p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="form-input pl-10"
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.email.message as string}</p>}
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className="form-input pl-10 pr-12"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.password.message as string}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="w-4 h-4 text-emerald-500 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 rounded focus:ring-emerald-500"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">Remember me</span>
              </label>
              <a href="#" className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Additional Options */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">Don't have an account?</p>
            <Link
              to="/contact"
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
            >
              Contact church office for membership
            </Link>
          </div>

          {/* Quick Access */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">Quick Access</p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/e-giving"
                className="bg-gray-100 dark:bg-slate-700/50 text-gray-700 dark:text-white px-4 py-2 rounded-lg text-sm text-center hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              >
                E-Giving
              </Link>
              <Link
                to="/events"
                className="bg-gray-100 dark:bg-slate-700/50 text-gray-700 dark:text-white px-4 py-2 rounded-lg text-sm text-center hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              >
                Events
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};