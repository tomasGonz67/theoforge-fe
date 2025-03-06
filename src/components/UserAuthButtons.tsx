import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Button } from "@material-tailwind/react";
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

interface UserAuthButtonsProps {
  variant?: 'desktop' | 'mobile';
  onMobileItemClick?: () => void;
}

export function UserAuthButtons({ 
  variant = 'desktop', 
  onMobileItemClick 
}: UserAuthButtonsProps) {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/logout');
    if (onMobileItemClick) {
      onMobileItemClick();
    }
  };

  if (variant === 'desktop') {
    return (
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">
              <Button variant="text" color="blue-gray">Dashboard</Button>
            </Link>
            <Button 
              variant="outlined" 
              color="red"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="text" color="blue-gray">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button variant="gradient" color="teal">Get Started</Button>
            </Link>
          </>
        )}
      </div>
    );
  }
  
  // Mobile variant
  return (
    <div className="flex flex-col gap-4">
      {isAuthenticated ? (
        <>
          <Link 
            to="/dashboard" 
            className="block py-2 px-4 text-blue-gray-900 hover:bg-gray-100 rounded"
            onClick={onMobileItemClick}
          >
            Dashboard
          </Link>
          <button 
            className="flex items-center gap-2 w-full text-left py-2 px-4 text-red-500 hover:bg-red-50 rounded"
            onClick={handleLogout}
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            Sign Out
          </button>
        </>
      ) : (
        <>
          <Link 
            to="/login" 
            className="block py-2 px-4 text-blue-gray-900 hover:bg-gray-100 rounded"
            onClick={onMobileItemClick}
          >
            Sign in
          </Link>
          <Link 
            to="/register" 
            className="block py-2 px-4 text-teal-500 hover:bg-teal-50 rounded"
            onClick={onMobileItemClick}
          >
            Get Started
          </Link>
        </>
      )}
    </div>
  );
}