import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import {
  UsersIcon,
  HomeIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon as MenuIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  BeakerIcon,
  ChartBarIcon,
  BellIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowPathIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { UsersTable } from './UsersTable';
import { GuestsTable } from './GuestsTable';
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Drawer,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Navbar,
  Breadcrumbs,
  Dialog,
  DialogHeader,
  DialogBody,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Input,
  Button,
  Progress,
  Avatar,
  Chip
} from "@material-tailwind/react";
import { cn } from '../lib/utils';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: ChartBarIcon,
    description: 'Overview of your activity'
  },
  { 
    name: 'Users', 
    href: '/dashboard/users', 
    icon: UsersIcon,
    description: 'Manage system users'
  },
  { 
    name: 'Guests', 
    href: '/dashboard/guests', 
    icon: HomeIcon,
    description: 'View guest accounts'
  },
  { 
    name: 'Marketplace', 
    href: '/dashboard/marketplace', 
    icon: ShoppingBagIcon,
    description: 'Browse available services'
  },
];

const TABS = [
  {
    label: "Personal Details",
    value: "personal",
    icon: UserCircleIcon,
  },
  {
    label: "Payments",
    value: "payments",
    icon: CreditCardIcon,
  },
  {
    label: "Subscriptions",
    value: "subscriptions",
    icon: BuildingLibraryIcon,
  },
];

// Mock data for dashboard metrics
const metrics = [
  { id: 1, name: 'Total Users', value: '1,204', change: '+12%', icon: UsersIcon, color: 'blue' },
  { id: 2, name: 'Active Guests', value: '423', change: '+5%', icon: HomeIcon, color: 'teal' },
  { id: 3, name: 'New Sign-ups', value: '48', change: '+18%', icon: UserCircleIcon, color: 'purple' },
  { id: 4, name: 'Marketplace Items', value: '152', change: '+7%', icon: ShoppingBagIcon, color: 'amber' }
];

// Mock data for recent activity
const recentActivity = [
  { id: 1, action: 'New user registered', user: 'Alex Johnson', time: '5 minutes ago', icon: UserCircleIcon },
  { id: 2, action: 'File uploaded', user: 'Maria Garcia', time: '1 hour ago', icon: ClipboardDocumentCheckIcon },
  { id: 3, action: 'Project updated', user: 'Sam Taylor', time: '3 hours ago', icon: ArrowPathIcon },
  { id: 4, action: 'Task completed', user: 'Robin Chen', time: '5 hours ago', icon: CheckCircleIcon },
  { id: 5, action: 'New comment added', user: 'Jamie Wilson', time: '1 day ago', icon: ChatBubbleLeftRightIcon }
];

export function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [viewMode, setViewMode] = useState('view');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Set current page based on location path
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (lastSegment === 'dashboard' || lastSegment === '') {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage(lastSegment);
    }
  }, [location.pathname]);

  // User profile data
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "testuser@example.com",
    nickname: "testuser",
    role: "ADMIN",
    id: "9696cd13-30cd-445c-a7fa-916dd856f964",
    email_verified: true,
    created_at: "2025-03-11T17:24:23.496031Z",
    updated_at: "2025-03-11T17:24:23.496031Z",
    company: "Theoforge",
    phone: "+1 (555) 123-4567",
    address: "123 Main St",
    city: "Newark",
    state: "NJ",
    zipCode: "07102",
    country: "United States",
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    const page = path.split('/').pop() || 'dashboard';
    setCurrentPage(page);
    navigate(path);
    setIsDrawerOpen(false); // Close drawer on navigation
  };

  // Format date for better readability
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle profile form changes
  const handleProfileChange = (field, value) => {
    setProfile({
      ...profile,
      [field]: value
    });
  };

  // Render profile view mode - Using styles from ProfileDemo
  const renderProfileView = () => {
    if (profile.role === "ADMIN") {
      // Admin Profile View
      return (
        <div className="space-y-6 px-1 py-4">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-800">User Information</h3>
              <button
                onClick={() => setViewMode('edit')}
                className="px-4 py-2 text-sm border border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 flex items-center gap-2"
              >
                <Cog6ToothIcon className="h-4 w-4" />
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Full Name</p>
                <p className="font-medium">{profile.firstName} {profile.lastName}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium flex items-center">
                  {profile.email}
                  {profile.email_verified && (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 ml-2" />
                  )}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Username</p>
                <p className="font-medium">{profile.nickname}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Role</p>
                <p className="font-medium">
                  <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs font-bold">
                    {profile.role}
                  </span>
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="font-medium">{profile.phone}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Company</p>
                <p className="font-medium">{profile.company || 'Not specified'}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Account Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">User ID</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                  {profile.id}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="font-medium">{profile.address}, {profile.city}, {profile.state} {profile.zipCode}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Created At</p>
                <p className="font-medium flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                  {formatDate(profile.created_at)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                <p className="font-medium flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                  {formatDate(profile.updated_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Admin-only section */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-medium text-blue-800 mb-4">Administrative Privileges</h3>
            <p className="text-blue-700 mb-4">
              As an administrator, you have full access to all platform features, user management, and system settings.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg border border-blue-100 flex items-center">
                <UsersIcon className="h-5 w-5 text-blue-500 mr-3" />
                <span className="text-sm text-gray-700">User Management</span>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-blue-100 flex items-center">
                <Cog6ToothIcon className="h-5 w-5 text-blue-500 mr-3" />
                <span className="text-sm text-gray-700">System Settings</span>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-blue-100 flex items-center">
                <ShoppingBagIcon className="h-5 w-5 text-blue-500 mr-3" />
                <span className="text-sm text-gray-700">Product Management</span>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-blue-100 flex items-center">
                <ChartBarIcon className="h-5 w-5 text-blue-500 mr-3" />
                <span className="text-sm text-gray-700">Analytics Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // Regular User Profile View
      return (
        <div className="space-y-6 px-1 py-4">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-800">Your Profile</h3>
              <button
                onClick={() => setViewMode('edit')}
                className="px-4 py-2 text-sm border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center gap-2"
              >
                <UserCircleIcon className="h-4 w-4" />
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Full Name</p>
                <p className="font-medium">{profile.firstName} {profile.lastName}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium flex items-center">
                  {profile.email}
                  {profile.email_verified && (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 ml-2" />
                  )}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Username</p>
                <p className="font-medium">{profile.nickname}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Account Type</p>
                <p className="font-medium">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">
                    Basic User
                  </span>
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="font-medium">{profile.phone}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Company</p>
                <p className="font-medium">{profile.company || 'Not specified'}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Account Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Member Since</p>
                <p className="font-medium flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                  {formatDate(profile.created_at)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="font-medium">{profile.address}, {profile.city}, {profile.state} {profile.zipCode}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Subscription</p>
                <p className="font-medium">Basic Plan</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Credits Remaining</p>
                <div className="mt-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-500">385 of 500 used</p>
                    <p className="text-xs text-teal-600">77%</p>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: '77%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Regular user additional section */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-medium text-blue-800 mb-4">Getting Started</h3>
            <p className="text-blue-700 mb-4">
              Welcome to your account dashboard! Here are a few things you can do to get started:
            </p>
            
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg border border-blue-100 flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium text-gray-700">Complete your profile</span>
                  <p className="text-xs text-gray-500 mt-1">Add all your personal information to make the most of our platform.</p>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-blue-100 flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-gray-300 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium text-gray-700">Explore our marketplace</span>
                  <p className="text-xs text-gray-500 mt-1">Check out available applications and services for your needs.</p>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-blue-100 flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-gray-300 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium text-gray-700">Connect with your team</span>
                  <p className="text-xs text-gray-500 mt-1">Invite colleagues to collaborate on your projects and share resources.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
  
  // Render profile edit form - Using styles from ProfileDemo
  const renderProfileEditForm = () => {
    if (profile.role === "ADMIN") {
      // Admin Edit Form
      return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 my-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-800">Edit Admin Profile</h3>
            <button
              onClick={() => setViewMode('view')}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => handleProfileChange('firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => handleProfileChange('lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Username
              </label>
              <input
                type="text"
                value={profile.nickname}
                onChange={(e) => handleProfileChange('nickname', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Company
              </label>
              <input
                type="text"
                value={profile.company}
                onChange={(e) => handleProfileChange('company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Address
              </label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => handleProfileChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                City
              </label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => handleProfileChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setViewMode('view')}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      );
    } else {
      // Regular User Edit Form
      return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 my-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-800">Edit Your Profile</h3>
            <button
              onClick={() => setViewMode('view')}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => handleProfileChange('firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => handleProfileChange('lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <div className="flex items-center">
                <input
                  type="email"
                  value={profile.email}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                  readOnly
                />
                {profile.email_verified && (
                  <CheckCircleIcon className="h-5 w-5 text-green-500 ml-2 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Contact support to change your email</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Username
              </label>
              <input
                type="text"
                value={profile.nickname}
                onChange={(e) => handleProfileChange('nickname', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Company
              </label>
              <input
                type="text"
                value={profile.company}
                onChange={(e) => handleProfileChange('company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Notification Preferences
              </label>
              <div className="mt-3 space-y-3">
                <div className="flex items-start">
                  <input
                    id="email-notifications"
                    name="email-notifications"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <div className="ml-3">
                    <label htmlFor="email-notifications" className="text-sm font-medium text-gray-700">
                      Email Notifications
                    </label>
                    <p className="text-xs text-gray-500">Receive email updates about your account activity</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <input
                    id="marketing-emails"
                    name="marketing-emails"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <label htmlFor="marketing-emails" className="text-sm font-medium text-gray-700">
                      Marketing Emails
                    </label>
                    <p className="text-xs text-gray-500">Receive promotional offers and updates about new features</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => setViewMode('view')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
            <button
              onClick={() => setViewMode('view')}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Reset
            </button>
          </div>
        </div>
      );
    }
  };

  // Render payments tab
  const renderPaymentsTab = () => {
    return (
      <div className="mt-8">
        <Typography variant="h6" color="blue-gray" className="mb-4">
          Payment Methods
        </Typography>
        <div className="space-y-4">
          <Card className="p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-10 w-16 rounded-md flex items-center justify-center text-white">
                  <CreditCardIcon className="h-6 w-6" />
                </div>
                <div>
                  <Typography variant="h6">•••• •••• •••• 4242</Typography>
                  <Typography variant="small" color="gray">
                    Expires 12/24
                  </Typography>
                </div>
              </div>
              <Button variant="text" color="teal">Edit</Button>
            </div>
          </Card>
          <Button color="teal" variant="outlined" className="w-full">
            Add New Payment Method
          </Button>
        </div>

        {/* Admin-only payment analytics */}
        {profile.role === "ADMIN" && (
          <div className="mt-8">
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Payment Analytics
            </Typography>
            <Card className="p-4 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Typography variant="small" color="gray" className="mb-1">Total Revenue</Typography>
                  <Typography variant="h5">$24,568.12</Typography>
                  <Typography variant="small" color="green-500">+15.3% vs last month</Typography>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Typography variant="small" color="gray" className="mb-1">Active Subscriptions</Typography>
                  <Typography variant="h5">843</Typography>
                  <Typography variant="small" color="green-500">+5.2% vs last month</Typography>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Typography variant="small" color="gray" className="mb-1">Avg. Transaction</Typography>
                  <Typography variant="h5">$89.42</Typography>
                  <Typography variant="small" color="gray">-2.1% vs last month</Typography>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  };

  // Render subscriptions tab
  const renderSubscriptionsTab = () => {
    return (
      <div className="mt-8">
        <Typography variant="h6" color="blue-gray" className="mb-4">
          Active Subscriptions
        </Typography>
        <Card className="p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Typography variant="h6">Enterprise Plan</Typography>
                <Chip size="sm" value="Active" color="teal" className="rounded-full" />
              </div>
              <Typography variant="small" color="gray">
                $499/month • Renews on March 31, 2025
              </Typography>
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <Typography variant="small">Usage: 65%</Typography>
                  <Typography variant="small" color="teal">8,450 / 13,000 credits</Typography>
                </div>
                <Progress value={65} color="teal" className="h-1" />
              </div>
            </div>
            <Button variant="text" color="teal">Manage</Button>
          </div>
        </Card>

        {/* Admin-only subscription management */}
        {profile.role === "ADMIN" && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" color="blue-gray">
                Organization Subscriptions
              </Typography>
              <Button size="sm" color="teal" className="flex items-center gap-2">
                <SparklesIcon className="h-4 w-4" />
                Add Plan
              </Button>
            </div>
            
            <div className="space-y-4">
              <Card className="p-4 border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Typography variant="h6">Team Pro</Typography>
                      <Chip size="sm" value="12 users" color="blue" className="rounded-full" />
                    </div>
                    <Typography variant="small" color="gray">
                      $199/month • Managed by Finance department
                    </Typography>
                    <div className="mt-2">
                      <Progress value={42} color="blue" className="h-1" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="text" size="sm" color="blue">Details</Button>
                    <Button variant="text" size="sm" color="red">Revoke</Button>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Typography variant="h6">Developer Suite</Typography>
                      <Chip size="sm" value="8 users" color="purple" className="rounded-full" />
                    </div>
                    <Typography variant="small" color="gray">
                      $149/month • Managed by Engineering team
                    </Typography>
                    <div className="mt-2">
                      <Progress value={78} color="purple" className="h-1" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="text" size="sm" color="blue">Details</Button>
                    <Button variant="text" size="sm" color="red">Revoke</Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render sidebar
  const Sidebar = () => (
    <Card className={cn(
      "h-screen p-4 shadow-xl shadow-blue-gray-900/5 relative overflow-hidden transition-all duration-300",
      isSidebarCollapsed ? "w-20" : "w-full max-w-[20rem]"
    )}>
      {/* Decorative elements similar to landing page */}
      <div className="absolute top-20 right-0 w-32 h-32 bg-teal-50 rounded-full blur-3xl opacity-50 z-0"></div>
      <div className="absolute bottom-20 left-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50 z-0"></div>
      
      <div className="mb-6 p-4 flex items-center justify-between relative z-10">
        <div className={cn("flex items-center gap-2 transition-opacity duration-300", 
                          isSidebarCollapsed ? "opacity-0" : "opacity-100")}>
          <img src="/logo.png" alt="Theoforge Logo" className="h-12 w-12" />
          <Typography variant="h5" color="blue-gray">
            Theoforge
          </Typography>
        </div>
        <IconButton 
          variant="text" 
          color="teal" 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="z-10"
        >
          {isSidebarCollapsed ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}
        </IconButton>
      </div>
      
      <div className="relative z-10">
        <List>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
                            (item.href === '/dashboard' && location.pathname === '/dashboard') || 
                            (location.pathname.includes(item.href) && item.href !== '/dashboard');
            return (
              <ListItem
                key={item.name}
                className={cn(
                  "mb-2 hover:bg-teal-50/80 transition-all duration-200",
                  isActive && "bg-teal-50/80 text-teal-500 font-medium"
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <ListItemPrefix>
                  <item.icon className={cn(
                    "h-5 w-5",
                    isActive ? "text-teal-500" : "text-blue-gray-500"
                  )} />
                </ListItemPrefix>
                {!isSidebarCollapsed && (
                  <div>
                    <Typography variant="small" className={isActive ? "font-medium" : ""}>
                      {item.name}
                    </Typography>
                    {!isActive && (
                      <Typography variant="small" className="text-xs text-gray-500">
                        {item.description}
                      </Typography>
                    )}
                  </div>
                )}
              </ListItem>
            );
          })}
        </List>
        
        {!isSidebarCollapsed && (
          <div className="mt-auto pt-8">
            <Card className="mt-6 bg-gradient-to-br from-teal-500 to-teal-700 text-white p-4 rounded-xl">
              <Typography variant="h6" className="mb-2">Need Help?</Typography>
              <Typography variant="small" className="mb-4 opacity-80">
                Contact our support team for assistance with any issues.
              </Typography>
              <Button 
                size="sm" 
                className="bg-white text-teal-800 flex items-center gap-2 shadow-md hover:shadow-lg"
                fullWidth
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                Contact Support
              </Button>
            </Card>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar className="sticky top-0 z-10 max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 border-b border-gray-100 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between text-blue-gray-900">
          <div className="flex items-center gap-4">
            <IconButton
              variant="text"
              color="teal"
              className="lg:hidden"
              onClick={() => setIsDrawerOpen(true)}
            >
              <MenuIcon className="h-6 w-6" />
            </IconButton>
            <div className="flex items-center gap-2 lg:hidden">
              <img src="/logo.png" alt="Theoforge Logo" className="h-10 w-10" />
              <Typography variant="h5" color="blue-gray" className="font-medium">
                Theoforge
              </Typography>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <IconButton variant="text" color="blue-gray" className="relative">
              <BellIcon className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-teal-500 flex items-center justify-center text-[10px] text-white">
                3
              </span>
            </IconButton>
            
            <Menu>
              <MenuHandler>
                <Button 
                  variant="text" 
                  color="blue-gray" 
                  className="flex items-center gap-2 normal-case shadow-none px-2"
                >
                  <Avatar 
                    src="/api/placeholder/40/40" 
                    alt="User" 
                    size="sm" 
                    className="border border-gray-200" 
                  />
                  <div className="hidden sm:block text-left">
                    <Typography variant="small" className="font-medium">
                      {profile.firstName} {profile.lastName}
                    </Typography>
                    <Typography variant="small" className="text-xs text-gray-500">
                      {profile.role}
                    </Typography>
                  </div>
                </Button>
              </MenuHandler>
              <MenuList className="p-1">
                <MenuItem 
                  className="flex items-center gap-2 rounded hover:bg-teal-50/80"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Cog6ToothIcon className="h-4 w-4 text-teal-500" />
                  <Typography variant="small" className="font-normal">
                    Account Settings
                  </Typography>
                </MenuItem>
                <MenuItem 
                  className="flex items-center gap-2 rounded hover:bg-red-50 text-red-500"
                  onClick={handleLogout}
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <Typography variant="small" className="font-normal">
                    Sign Out
                  </Typography>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </Navbar>

      {/* Account Settings Dialog with ProfileDemo styling */}
      <Dialog
        size="xl"
        open={isSettingsOpen}
        handler={() => setIsSettingsOpen(false)}
        className="bg-white"
      >
        <DialogHeader className="text-teal-500 border-b pb-4">
          <div className="flex items-center gap-3">
            <Cog6ToothIcon className="h-6 w-6" />
            Account Settings
          </div>
        </DialogHeader>
        <DialogBody className="overflow-y-auto">
          {/* Tabs navigation with styling from ProfileDemo */}
          <div className="flex border-b border-gray-200 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                className={`flex items-center px-6 py-4 text-sm font-medium ${
                  activeTab === tab.value
                    ? 'text-teal-600 border-b-2 border-teal-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.value)}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'personal' && (
            viewMode === 'view' ? renderProfileView() : renderProfileEditForm()
          )}
          
          {activeTab === 'payments' && renderPaymentsTab()}
          
          {activeTab === 'subscriptions' && renderSubscriptionsTab()}
        </DialogBody>
      </Dialog>

      <div className="flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <Drawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          className="lg:hidden"
        >
          <Sidebar />
        </Drawer>

        <div className="flex-1 p-4 lg:p-6 max-w-full">
          <Breadcrumbs className="bg-white rounded-lg p-3 mb-4 border border-gray-100">
            {location.pathname.split('/')
              .filter(Boolean)
              .map((path, index, array) => ({
                name: path.charAt(0).toUpperCase() + path.slice(1),
                href: '/' + array.slice(0, index + 1).join('/'),
                current: index === array.length - 1,
              })).map((breadcrumb, index) => (
                <a
                  key={breadcrumb.href}
                  href={breadcrumb.href}
                  className={cn(
                    "opacity-60",
                    breadcrumb.current && "opacity-100 text-teal-500 font-medium"
                  )}
                >
                  <span>{breadcrumb.name}</span>
                </a>
              ))}
          </Breadcrumbs>

          <div className={cn(
            "transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            {/* Dashboard content - different view based on user role */}
            {currentPage === 'dashboard' && (
              <>
                {/* Admin Dashboard View */}
                {profile.role === "ADMIN" && (
                  <div className="space-y-6">
                    {/* Welcome Header for Admin */}
                    <Card className="p-6 border border-gray-100 relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-500 mb-4">
                              <SparklesIcon className="h-4 w-4 mr-2" />
                              <span className="text-sm font-medium">Admin Dashboard</span>
                            </div>
                            <Typography variant="h3" color="blue-gray" className="mb-2">
                              Welcome back, {profile.firstName}!
                            </Typography>
                            <Typography color="gray">
                              Here's what's happening across your organization today.
                            </Typography>
                          </div>
                          <Button 
                            color="teal" 
                            className="flex items-center gap-2"
                            size="sm"
                          >
                            <SparklesIcon className="h-4 w-4" /> 
                            Generate Report
                          </Button>
                        </div>
                      </div>
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 -z-10"></div>
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
                    </Card>

                    {/* Metrics Cards - Only visible for admin users */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {metrics.map((metric) => (
                        <Card key={metric.id} className="p-4 border border-gray-100 transition-all duration-300 hover:shadow-md">
                          <div className="flex items-start justify-between">
                            <div>
                              <Typography variant="small" color="gray" className="mb-2">
                                {metric.name}
                              </Typography>
                              <Typography variant="h4">
                                {metric.value}
                              </Typography>
                              <div className="flex items-center mt-1">
                                <Typography variant="small" color="teal" className="font-medium">
                                  {metric.change}
                                </Typography>
                                <Typography variant="small" color="gray" className="ml-1">
                                  vs. last month
                                </Typography>
                              </div>
                            </div>
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
                              <metric.icon className="h-6 w-6" />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Recent Activity - Only visible for admin users */}
                    <Card className="border border-gray-100 overflow-hidden">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <Typography variant="h6" color="blue-gray">
                          Recent Activity
                        </Typography>
                      </div>
                      <List>
                        {recentActivity.map((activity) => (
                          <ListItem 
                            key={activity.id}
                            className="py-3 px-4 hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-full bg-teal-50">
                                <activity.icon className="h-5 w-5 text-teal-500" />
                              </div>
                              <div className="flex-grow">
                                <Typography variant="small" className="font-medium">
                                  {activity.action}
                                </Typography>
                                <Typography variant="small" color="gray">
                                  {activity.user}
                                </Typography>
                              </div>
                              <Typography variant="small" color="gray">
                                {activity.time}
                              </Typography>
                            </div>
                          </ListItem>
                        ))}
                      </List>
                      <div className="px-6 py-3 border-t border-gray-100 text-center">
                        <Button variant="text" color="teal" size="sm">
                          View All Activity
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Regular User Dashboard View */}
                {profile.role !== "ADMIN" && (
                  <div className="space-y-6">
                    {/* Welcome Header for Regular User */}
                    <Card className="p-6 border border-gray-100 relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-500 mb-4">
                              <UserCircleIcon className="h-4 w-4 mr-2" />
                              <span className="text-sm font-medium">My Dashboard</span>
                            </div>
                            <Typography variant="h3" color="blue-gray" className="mb-2">
                              Welcome back, {profile.firstName}!
                            </Typography>
                            <Typography color="gray">
                              Here's a summary of your recent activity and account status.
                            </Typography>
                          </div>
                          <Button 
                            color="blue" 
                            className="flex items-center gap-2"
                            size="sm"
                          >
                            <SparklesIcon className="h-4 w-4" /> 
                            Get Started
                          </Button>
                        </div>
                      </div>
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10"></div>
                    </Card>

                    {/* User Account Summary */}
                    <Card className="p-6 border border-gray-100">
                      <Typography variant="h5" color="blue-gray" className="mb-4">
                        Account Summary
                      </Typography>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Current Plan */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                          <div className="flex items-center mb-2">
                            <BuildingLibraryIcon className="h-5 w-5 mr-2 text-blue-500" />
                            <Typography variant="h6" color="blue-gray">
                              Current Plan
                            </Typography>
                          </div>
                          <div className="mb-3">
                            <Typography variant="h5" color="blue-gray">
                              Basic
                            </Typography>
                            <Typography variant="small" color="gray">
                              Next billing: April 15, 2025
                            </Typography>
                          </div>
                          <Button variant="outlined" color="blue" size="sm" fullWidth>
                            Upgrade Plan
                          </Button>
                        </div>
                        
                        {/* Usage */}
                        <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl">
                          <div className="flex items-center mb-2">
                            <ChartBarIcon className="h-5 w-5 mr-2 text-teal-500" />
                            <Typography variant="h6" color="blue-gray">
                              Usage
                            </Typography>
                          </div>
                          <div className="mb-2">
                            <div className="flex justify-between items-center mb-1">
                              <Typography variant="small" color="gray">Credits Used</Typography>
                              <Typography variant="small" color="gray" className="font-medium">
                                385 / 500
                              </Typography>
                            </div>
                            <Progress value={77} color="teal" className="h-1" />
                          </div>
                          <Button variant="text" color="teal" size="sm" fullWidth>
                            View Details
                          </Button>
                        </div>
                        
                        {/* Support */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                          <div className="flex items-center mb-2">
                            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-purple-500" />
                            <Typography variant="h6" color="blue-gray">
                              Support
                            </Typography>
                          </div>
                          <div className="mb-3">
                            <Typography variant="small" color="gray">
                              Need help with our platform? Contact our support team.
                            </Typography>
                          </div>
                          <Button variant="text" color="purple" size="sm" fullWidth>
                            Get Help
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Recent Activity for Regular User */}
                    <Card className="border border-gray-100 overflow-hidden">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <Typography variant="h6" color="blue-gray">
                          Your Recent Activity
                        </Typography>
                      </div>
                      <List>
                        <ListItem className="py-3 px-4 hover:bg-gray-50">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-blue-50">
                              <UserCircleIcon className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="flex-grow">
                              <Typography variant="small" className="font-medium">
                                Profile updated
                              </Typography>
                              <Typography variant="small" color="gray">
                                You updated your profile information
                              </Typography>
                            </div>
                            <Typography variant="small" color="gray">
                              2 days ago
                            </Typography>
                          </div>
                        </ListItem>
                        <ListItem className="py-3 px-4 hover:bg-gray-50">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-teal-50">
                              <BuildingLibraryIcon className="h-5 w-5 text-teal-500" />
                            </div>
                            <div className="flex-grow">
                              <Typography variant="small" className="font-medium">
                                Subscription renewed
                              </Typography>
                              <Typography variant="small" color="gray">
                                Your basic subscription was renewed
                              </Typography>
                            </div>
                            <Typography variant="small" color="gray">
                              1 week ago
                            </Typography>
                          </div>
                        </ListItem>
                        <ListItem className="py-3 px-4 hover:bg-gray-50">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-purple-50">
                              <CreditCardIcon className="h-5 w-5 text-purple-500" />
                            </div>
                            <div className="flex-grow">
                              <Typography variant="small" className="font-medium">
                                Payment processed
                              </Typography>
                              <Typography variant="small" color="gray">
                                Monthly subscription payment
                              </Typography>
                            </div>
                            <Typography variant="small" color="gray">
                              2 weeks ago
                            </Typography>
                          </div>
                        </ListItem>
                      </List>
                    </Card>

                    {/* Resources */}
                    <Card className="p-6 border border-gray-100">
                      <Typography variant="h5" color="blue-gray" className="mb-4">
                        Resources & Quick Links
                      </Typography>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button variant="outlined" color="blue" className="flex items-center justify-center gap-2 py-4 h-auto normal-case">
                          <SparklesIcon className="h-5 w-5" />
                          <div className="text-left">
                            <Typography variant="small" className="font-medium">Documentation</Typography>
                            <Typography variant="small" color="gray" className="text-xs">
                              Learn how to use our platform
                            </Typography>
                          </div>
                        </Button>
                        
                        <Button variant="outlined" color="teal" className="flex items-center justify-center gap-2 py-4 h-auto normal-case">
                          <BeakerIcon className="h-5 w-5" />
                          <div className="text-left">
                            <Typography variant="small" className="font-medium">Tutorials</Typography>
                            <Typography variant="small" color="gray" className="text-xs">
                              Step-by-step guides
                            </Typography>
                          </div>
                        </Button>
                        
                        <Button variant="outlined" color="purple" className="flex items-center justify-center gap-2 py-4 h-auto normal-case">
                          <ChatBubbleLeftRightIcon className="h-5 w-5" />
                          <div className="text-left">
                            <Typography variant="small" className="font-medium">Community</Typography>
                            <Typography variant="small" color="gray" className="text-xs">
                              Join our user forum
                            </Typography>
                          </div>
                        </Button>
                        
                        <Button variant="outlined" color="amber" className="flex items-center justify-center gap-2 py-4 h-auto normal-case">
                          <ShoppingBagIcon className="h-5 w-5" />
                          <div className="text-left">
                            <Typography variant="small" className="font-medium">Marketplace</Typography>
                            <Typography variant="small" color="gray" className="text-xs">
                              Explore available apps
                            </Typography>
                          </div>
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}
              </>
            )}

            {/* Other pages content remains the same */}
            {/* ... */}
          </div>
        </div>
      </div>
    </div>
  );
}