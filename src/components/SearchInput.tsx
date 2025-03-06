import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input } from "@material-tailwind/react";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = ""
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-gray-300">
        <MagnifyingGlassIcon className="h-5 w-5" />
      </div>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        className="pl-10" // Add padding to prevent text overlapping with icon
        placeholder={placeholder}
        containerProps={{
          className: "w-full",
        }}
        labelProps={{
          className: "hidden", // Hide the default label
        }}
        label="" // Use empty string for label
      />
    </div>
  );
}