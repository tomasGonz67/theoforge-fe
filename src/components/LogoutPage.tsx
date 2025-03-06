import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import {
  Typography,
  Button,
  Card,
  CardBody,
  CardFooter
} from "@material-tailwind/react";
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export function LogoutPage() {
  const { logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // If already logged out, redirect to login
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  const handleConfirmLogout = () => {
    logout();
    // Logout function will change isAuthenticated state, 
    // which will trigger the useEffect above
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        {isAuthenticated ? (
          <>
            <CardBody className="flex flex-col items-center">
              <Typography variant="h4" color="blue-gray" className="mb-6 text-center">
                Are you sure you want to log out?
              </Typography>
              <Typography color="gray" className="mb-8 text-center">
                You will need to log in again to access your account.
              </Typography>
            </CardBody>
            <CardFooter className="pt-0 flex justify-center gap-4">
              <Button variant="outlined" color="blue-gray" onClick={handleCancel}>
                Cancel
              </Button>
              <Button color="teal" onClick={handleConfirmLogout}>
                Confirm Logout
              </Button>
            </CardFooter>
          </>
        ) : (
          <CardBody className="flex flex-col items-center p-8">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
            <Typography variant="h4" color="blue-gray" className="mb-4 text-center">
              You have been logged out
            </Typography>
            <Typography color="gray" className="mb-8 text-center">
              Thank you for using Theoforge. You will be redirected to the login page shortly.
            </Typography>
            <Button color="teal" onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </CardBody>
        )}
      </Card>
    </div>
  );
}