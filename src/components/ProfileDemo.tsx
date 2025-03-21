import React, { useState } from 'react';
import { 
  ArrowLeftIcon, 
  CogIcon, 
  UserIcon, 
  CreditCardIcon, 
  BuildingLibraryIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const ProfileDemo = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [viewMode, setViewMode] = useState('view');
  
  // User data from the image
  const profile = {
    email: 'testuser@example.com',
    nickname: 'testuser',
    first_name: 'John',
    last_name: 'Doe',
    role: 'ADMIN',
    id: '9696cd13-30cd-445c-a7fa-916dd856f964',
    email_verified: true,
    created_at: '2025-03-11T17:24:23.496031Z',
    updated_at: '2025-03-11T17:24:23.496031Z',
    company: 'Theoforge'
  };
  
  // Format date for better readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Render profile view
  const renderProfileView = () => {
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-gray-800">User Information</h3>
            <button
              onClick={() => setViewMode('edit')}
              className="px-4 py-2 text-sm border border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 flex items-center gap-2"
            >
              <CogIcon className="h-4 w-4" />
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Full Name</p>
              <p className="font-medium">{profile.first_name} {profile.last_name}</p>
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
              <p className="text-sm text-gray-500 mb-1">Company</p>
              <p className="font-medium">{profile.company || 'Not specified'}</p>
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
      </div>
    );
  };
  
  // Render edit form
  const renderProfileEditForm = () => {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-800">Edit Profile</h3>
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
              defaultValue={profile.first_name}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Last Name
            </label>
            <input
              type="text"
              defaultValue={profile.last_name}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              defaultValue={profile.email}
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
              defaultValue={profile.nickname}
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6">
          <button 
            className="flex items-center text-gray-700 hover:text-teal-600 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">Back to home</span>
          </button>
        </div>

        {/* Form container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Colored bar at top */}
          <div className="h-2 bg-gradient-to-r from-teal-400 to-teal-600"></div>
          
          <div className="p-8">
            {/* Header */}
            <div className="mb-6 border-b border-gray-200 pb-4">
              <div className="flex items-center">
                <CogIcon className="h-6 w-6 text-teal-500 mr-2" />
                <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`flex items-center px-6 py-4 text-sm font-medium ${
                  activeTab === 'personal'
                    ? 'text-teal-600 border-b-2 border-teal-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('personal')}
              >
                <UserIcon className="h-5 w-5 mr-2" />
                Personal Details
              </button>
              <button
                className={`flex items-center px-6 py-4 text-sm font-medium ${
                  activeTab === 'payments'
                    ? 'text-teal-600 border-b-2 border-teal-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('payments')}
              >
                <CreditCardIcon className="h-5 w-5 mr-2" />
                Payments
              </button>
              <button
                className={`flex items-center px-6 py-4 text-sm font-medium ${
                  activeTab === 'subscriptions'
                    ? 'text-teal-600 border-b-2 border-teal-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('subscriptions')}
              >
                <BuildingLibraryIcon className="h-5 w-5 mr-2" />
                Subscriptions
              </button>
            </div>

            {/* Content based on selected tab and view mode */}
            {activeTab === 'personal' && (
              viewMode === 'view' ? renderProfileView() : renderProfileEditForm()
            )}
            
            {activeTab === 'payments' && (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium text-gray-700">Payments tab content will go here</h3>
              </div>
            )}
            
            {activeTab === 'subscriptions' && (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium text-gray-700">Subscriptions tab content will go here</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDemo;