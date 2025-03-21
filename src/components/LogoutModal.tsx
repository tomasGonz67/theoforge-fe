import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography
} from "@material-tailwind/react";
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleConfirmLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  return (
    <Dialog
      open={isOpen}
      handler={onClose}
      size="xs"
      className="z-[70]" // Set a higher z-index than the backdrop
    >
      <DialogHeader className="justify-center">
        <Typography variant="h5" color="blue-gray">
          Confirm Logout
        </Typography>
      </DialogHeader>
      
      <DialogBody className="text-center">
        <div className="flex flex-col items-center">
          <CheckCircleIcon className="h-16 w-16 text-teal-500 mb-4" />
          <Typography color="gray" className="mb-2">
            Are you sure you want to log out?
          </Typography>
          <Typography color="gray" variant="small">
            You will need to log in again to access your account.
          </Typography>
        </div>
      </DialogBody>
      
      <DialogFooter className="flex justify-center gap-3">
        <Button 
          variant="outlined" 
          color="blue-gray" 
          onClick={onClose}
          className="min-w-24"
        >
          Cancel
        </Button>
        <Button 
          color="teal" 
          onClick={handleConfirmLogout}
          className="min-w-24"
        >
          Logout
        </Button>
      </DialogFooter>
    </Dialog>
  );
}