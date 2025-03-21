import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  UserCircleIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  UserIcon,
  PhotoIcon,
  CheckIcon,
  XMarkIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Tooltip,
  Avatar,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Alert
} from "@material-tailwind/react";
import { AuthContext } from '../App';
import axiosInstance from '../utils/axiosConfig';

interface ProfileInfo {
  name: string;
  email: string;
  role: string;
  department: string;
  avatarUrl: string;
}

export function ProfileSettings() {
  const { user } = useContext(AuthContext);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Administrator',
    department: 'IT Department',
    avatarUrl: '/api/placeholder/150/150'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState<ProfileInfo>(profileInfo);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState({ show: false, message: "", type: "success" });
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user profile data on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      try {
        // Get the current user from localStorage if available
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          
          // If we have user data in localStorage, use it to update the profile
          setProfileInfo({
            name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'John Doe',
            email: userData.email || 'john.doe@example.com',
            role: userData.role || 'User',
            department: userData.department || 'IT Department',
            avatarUrl: userData.avatarUrl || '/api/placeholder/150/150'
          });
        } else {
          // Otherwise, try to fetch from the API
          try {
            const response = await axiosInstance.get('/users/profile');
            const userData = response.data;
            
            setProfileInfo({
              name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'John Doe',
              email: userData.email || 'john.doe@example.com',
              role: userData.role || 'User',
              department: userData.department || 'IT Department',
              avatarUrl: userData.avatarUrl || '/api/placeholder/150/150'
            });
          } catch (apiError) {
            console.error('Failed to fetch profile from API:', apiError);
            // Use default profile data if API call fails
          }
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
        showAlert({
          show: true,
          message: "Failed to load profile data. Using defaults.",
          type: "error"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [user]);

  // Update editedInfo when profileInfo changes
  useEffect(() => {
    setEditedInfo(profileInfo);
  }, [profileInfo]);

  // Handle edit mode toggle
  const toggleEditMode = () => {
    if (isEditing) {
      // Save changes
      saveChanges();
    }
    setIsEditing(!isEditing);
  };

  // Save profile changes
  const saveChanges = async () => {
    setIsLoading(true);
    try {
      // Extract first name and last name from full name
      const nameParts = editedInfo.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Prepare the update data
      const updateData = {
        firstName,
        lastName,
        email: editedInfo.email,
        department: editedInfo.department
      };

      // Send the update to the API
      try {
        const response = await axiosInstance.put('/users/profile', updateData);
        
        // Update profile info with the saved data
        setProfileInfo(editedInfo);
        
        // Update the user data in localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          const updatedUserData = {
            ...userData,
            firstName,
            lastName,
            email: editedInfo.email,
            department: editedInfo.department
          };
          localStorage.setItem('user', JSON.stringify(updatedUserData));
        }
        
        showSuccessAlert("Profile information updated successfully!");
      } catch (apiError) {
        console.error('Failed to update profile:', apiError);
        showErrorAlert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error('Error saving profile changes:', error);
      showErrorAlert("An error occurred while saving changes.");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditedInfo(profileInfo);
    setIsEditing(false);
  };

  // Handle profile info changes
  const handleInfoChange = (key: keyof ProfileInfo, value: string) => {
    setEditedInfo(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Show success alert
  const showSuccessAlert = (message: string) => {
    setShowAlert({
      show: true,
      message,
      type: "success"
    });
    
    setTimeout(() => {
      setShowAlert(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Show error alert
  const showErrorAlert = (message: string) => {
    setShowAlert({
      show: true,
      message,
      type: "error"
    });
    
    setTimeout(() => {
      setShowAlert(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Handle avatar upload via input
  const handleAvatarInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTempAvatarUrl(URL.createObjectURL(file));
      setIsAvatarModalOpen(true);
    }
  };

  // Handle avatar drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setTempAvatarUrl(URL.createObjectURL(file));
      setIsAvatarModalOpen(true);
    }
  };

  // Apply new avatar
  const applyNewAvatar = async () => {
    if (tempAvatarUrl) {
      setIsLoading(true);
      try {
        // In a real implementation, you would upload the image to the server
        // and get back the URL to the uploaded image
        
        // For this example, we'll just update the avatar URL locally
        setProfileInfo(prev => ({
          ...prev,
          avatarUrl: tempAvatarUrl
        }));
        
        // Update the user data in localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          const updatedUserData = {
            ...userData,
            avatarUrl: tempAvatarUrl
          };
          localStorage.setItem('user', JSON.stringify(updatedUserData));
        }
        
        // Close the modal and show success message
        setIsAvatarModalOpen(false);
        showSuccessAlert("Profile picture updated successfully!");
      } catch (error) {
        console.error('Error updating avatar:', error);
        showErrorAlert("Failed to update profile picture. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Cancel avatar update
  const cancelAvatarUpdate = () => {
    setTempAvatarUrl(null);
    setIsAvatarModalOpen(false);
  };

  return (
    <div className="w-full">
      {/* Success/Error Alert */}
      {showAlert.show && (
        <Alert
          open={showAlert.show}
          onClose={() => setShowAlert(prev => ({ ...prev, show: false }))}
          animate={{
            mount: { y: 0 },
            unmount: { y: -100 },
          }}
          className="fixed top-4 right-4 z-50 max-w-md"
          color={showAlert.type === "success" ? "green" : "red"}
          icon={showAlert.type === "success" ? <CheckIcon className="h-6 w-6" /> : <XMarkIcon className="h-6 w-6" />}
        >
          {showAlert.message}
        </Alert>
      )}

      <Card className="w-full shadow-sm border border-gray-100 mb-6">
        <CardHeader
          floated={false}
          shadow={false}
          className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white"
        >
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar
                src={profileInfo.avatarUrl}
                alt={profileInfo.name}
                withBorder={true}
                className="p-0.5 w-24 h-24"
                color="teal"
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => setIsAvatarModalOpen(true)}
              >
                <CameraIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <Typography variant="h4" color="blue-gray">
                {profileInfo.name}
              </Typography>
              <Typography color="teal" className="font-medium">
                {profileInfo.role}
              </Typography>
              <Typography color="gray" className="font-normal text-sm">
                {profileInfo.department}
              </Typography>
            </div>
          </div>
          <div>
            <Button
              color={isEditing ? "teal" : "blue-gray"}
              className="flex items-center gap-2"
              size="sm"
              onClick={toggleEditMode}
              disabled={isLoading}
            >
              {isEditing ? (
                <>
                  <CheckIcon className="h-4 w-4" /> Save Changes
                </>
              ) : (
                <>
                  <UserCircleIcon className="h-4 w-4" /> Edit Profile
                </>
              )}
            </Button>
            {isEditing && (
              <Button
                color="red"
                variant="text"
                className="flex items-center gap-2 mt-2"
                size="sm"
                onClick={cancelEdit}
                disabled={isLoading}
              >
                <XMarkIcon className="h-4 w-4" /> Cancel
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Full Name
                </Typography>
                {isEditing ? (
                  <Input
                    icon={<UserIcon className="h-5 w-5 text-blue-gray-300" />}
                    value={editedInfo.name}
                    onChange={(e) => handleInfoChange("name", e.target.value)}
                    label="Name"
                  />
                ) : (
                  <Typography>{profileInfo.name}</Typography>
                )}
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Email Address
                </Typography>
                {isEditing ? (
                  <Input
                    icon={<EnvelopeIcon className="h-5 w-5 text-blue-gray-300" />}
                    value={editedInfo.email}
                    onChange={(e) => handleInfoChange("email", e.target.value)}
                    label="Email"
                  />
                ) : (
                  <Typography>{profileInfo.email}</Typography>
                )}
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Role
                </Typography>
                {isEditing ? (
                  <Input
                    icon={<UserCircleIcon className="h-5 w-5 text-blue-gray-300" />}
                    value={editedInfo.role}
                    onChange={(e) => handleInfoChange("role", e.target.value)}
                    label="Role"
                    disabled
                  />
                ) : (
                  <Typography>{profileInfo.role}</Typography>
                )}
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Department
                </Typography>
                {isEditing ? (
                  <Input
                    icon={<BriefcaseIcon className="h-5 w-5 text-blue-gray-300" />}
                    value={editedInfo.department}
                    onChange={(e) => handleInfoChange("department", e.target.value)}
                    label="Department"
                  />
                ) : (
                  <Typography>{profileInfo.department}</Typography>
                )}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Avatar Upload Modal */}
      <Dialog
        open={isAvatarModalOpen}
        handler={() => setIsAvatarModalOpen(false)}
        size="xs"
      >
        <DialogHeader>Update Profile Picture</DialogHeader>
        <DialogBody divider>
          <div className="flex flex-col items-center">
            {tempAvatarUrl ? (
              <div className="mb-4">
                <Avatar
                  src={tempAvatarUrl}
                  alt="New profile picture"
                  size="xxl"
                  className="h-40 w-40"
                />
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer text-center w-full mb-4 ${
                  dragActive ? "border-teal-500 bg-teal-50" : "border-blue-gray-200"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <PhotoIcon className="h-12 w-12 text-blue-gray-300 mx-auto mb-4" />
                <Typography color="blue-gray" className="font-medium mb-1">
                  Drag and drop an image here
                </Typography>
                <Typography color="gray" className="text-sm">
                  or <span className="text-teal-500 font-medium">browse</span> to upload
                </Typography>
                <Typography color="gray" className="text-xs mt-4">
                  Supported formats: JPEG, PNG, GIF
                </Typography>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleAvatarInputChange}
                  accept="image/*"
                />
              </div>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={cancelAvatarUpdate}
            className="mr-2"
            disabled={isLoading}
          >
            Cancel
          </Button>
          {tempAvatarUrl && (
            <Button
              color="teal"
              onClick={applyNewAvatar}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-t-transparent border-teal-500 animate-spin"></span>
                  Processing...
                </span>
              ) : (
                "Apply"
              )}
            </Button>
          )}
        </DialogFooter>
      </Dialog>
    </div>
  );
}