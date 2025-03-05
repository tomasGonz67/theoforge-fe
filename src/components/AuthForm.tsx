import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../App';
import {
  Button,
  Typography,
  Alert
} from "@material-tailwind/react";

interface AuthFormProps {
  type: 'login' | 'register';
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useContext(AuthContext);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!email || !password) {
      setError('Please fill out all fields');
      return;
    }
    let pattern = /^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/;
    if(!pattern.test(email)) {
      setError('Invalid email');
      return;
    }
    if(password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    pattern = /[A-Z]/;
    if(!pattern.test(password)){
      setError('Password must contain at least 1 uppercase character');
      return;
    }
    pattern = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/
    if(!pattern.test(password)){
      setError('Password must contain at least 1 special character');
      return;
    }

    if (type === 'login') {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } else {
      const response = await register(email, password);
      if (response === 200) {
        navigate('/dashboard');
      } else if (response === 400) {
        setError('Email already taken');
      } else {
        setError('Failed to contact server. Please try again later.')
      }
    }
  };

  const handleGuestLogin = async () => {
    const success = await login('guest', 'guest');
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Background decorative elements */}
      <div className="fixed top-0 right-0 h-64 w-64 bg-teal-400 rounded-bl-full opacity-10"></div>
      <div className="fixed bottom-0 left-0 h-64 w-64 bg-teal-400 rounded-tr-full opacity-10"></div>
      
      <div className={`w-full max-w-md transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Back button */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center text-gray-700 hover:text-teal-600 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">Back to home</span>
          </button>
        </div>

        {/* Form container with subtle shadow and border */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Colored bar at top */}
          <div className="h-2 bg-gradient-to-r from-teal-400 to-teal-600"></div>
          
          <div className="p-8">
            {/* Form header */}
            <div className="text-center mb-8">
              <Typography variant="h3" className="text-gray-800 font-bold text-2xl mb-2">
                {type === 'login' ? 'Welcome Back' : 'Create Account'}
              </Typography>
              <Typography className="text-gray-500">
                {type === 'login' ? 'Sign in to your account' : 'Join Theoforge today'}
              </Typography>
            </div>
            
            {/* Error alert */}
            {error && (
              <Alert
                color="red"
                variant="outlined"
                className="mb-6 border border-red-200"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              >
                {error}
              </Alert>
            )}

            {/* Login/Register form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {type === 'login' && (
                <div className="flex justify-end">
                  <button type="button" className="text-sm text-teal-600 hover:text-teal-800 transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                color="teal"
                className="w-full py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-98 mt-4"
                fullWidth
              >
                {type === 'login' ? 'Login' : 'Register'}
              </Button>
            </form>

            {/* Divider */}
            {type === 'login' && (
              <div className="relative mt-8 mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
            )}

            {/* Test account button */}
            {type === 'login' && (
              <Button
                variant="outlined"
                color="teal"
                size="lg"
                onClick={handleGuestLogin}
                className="w-full flex items-center justify-center gap-2 shadow-sm hover:bg-teal-50 transition-all duration-200"
                fullWidth
              >
                <SparklesIcon className="h-5 w-5" />
                Guest Account
              </Button>
            )}

            {/* Toggle between login and register */}
            <div className="text-center mt-8">
              <Typography className="text-gray-600">
                {type === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  type="button"
                  className="text-teal-600 font-medium hover:text-teal-800 hover:underline transition-colors"
                  onClick={() => navigate(type === 'login' ? '/register' : '/login')}
                >
                  {type === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}