import React from 'react';
import { Input, Typography } from "@material-tailwind/react";

interface InputWithIconProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function InputWithIcon({
  label,
  type = "text",
  value,
  onChange,
  icon,
  placeholder = "",
  required = false,
  className = ""
}: InputWithIconProps) {
  return (
    <div className={className}>
      {/* Separate label positioned above input */}
      <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Typography>
      
      {/* Container for input and icon */}
      <div className="relative flex items-center">
        {/* Icon positioned absolutely inside the container */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-gray-300">
          {icon}
        </div>
        
        {/* Input with left padding to accommodate the icon */}
        <Input
          type={type}
          value={value}
          onChange={onChange}
          className="pl-10" // Add padding to prevent text overlapping with icon
          placeholder={placeholder}
          containerProps={{
            className: "w-full",
          }}
          labelProps={{
            className: "hidden", // Hide the default label since we're using a custom one
          }}
          label="" // Empty string required
          required={required}
        />
      </div>
    </div>
  );
}