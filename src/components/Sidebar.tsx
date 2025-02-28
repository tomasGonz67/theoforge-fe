import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { UserIcon, HomeIcon, ShoppingBagIcon, ChartBarIcon } from '@heroicons/react/24/outline';

// Assuming you have some form of auth context or user context
import { useAuth } from '../context/AuthContext'; // Adjust import based on your actual auth implementation

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth(); // Replace with your actual auth hook
  
  // Check if user is admin - adjust based on your user roles structure
  const isAdmin = user?.role === 'admin';
  
  // Define navigation items based on user role
  let navItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: ChartBarIcon
    },
    {
      path: '/marketplace',
      name: 'Marketplace',
      icon: ShoppingBagIcon
    }
  ];
  
  // Add admin-only items if user is an admin
  if (isAdmin) {
    navItems = [
      navItems[0],  // Keep Dashboard as first item
      {
        path: '/users',
        name: 'Users',
        icon: UserIcon
      },
      {
        path: '/guests',
        name: 'Guests',
        icon: HomeIcon
      },
      navItems[1]   // Add Marketplace at the end
    ];
  }
  
  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200">
      <div className="flex items-center p-4">
        <img src="/logo.png" alt="Theoforge" className="h-10 w-10 mr-2" />
        <h1 className="text-xl font-semibold">Theoforge</h1>
      </div>
      
      <nav className="mt-8">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-2">
              <Link 
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-2 mx-2 rounded-md transition-colors",
                  location.pathname === item.path 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;