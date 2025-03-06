import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Button } from "@material-tailwind/react";
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

interface AdminLogoutButtonProps {
  variant?: 'text' | 'gradient' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export function AdminLogoutButton({
  variant = 'filled',
  size = 'md',
  fullWidth = false,
  className = ''
}: AdminLogoutButtonProps) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <Button
      variant={variant}
      color="red"
      size={size}
      className={`flex items-center gap-2 ${className}`}
      fullWidth={fullWidth}
      onClick={handleLogout}
    >
      <ArrowRightOnRectangleIcon className="h-4 w-4" />
      Logout
    </Button>
  );
}