// src/services/userService.ts
import axiosInstance from '../utils/axiosConfig';

interface ServiceResponse {
  success: boolean;
  data?: any;
  message?: string;
}

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  status?: string;
  [key: string]: any; // For other properties that might exist
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    }
  };
  message: string;
}

const userService = {
  // Get the current user's profile
  getProfile: async (): Promise<ServiceResponse> => {
    try {
      const response = await axiosInstance.get('/users/profile');
      return { success: true, data: response.data };
    } catch (error) {
      const err = error as ErrorResponse;
      console.error('Error fetching user profile:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to fetch user profile'
      };
    }
  },

  // Update the current user's profile
  updateProfile: async (profileData: UserData): Promise<ServiceResponse> => {
    try {
      const response = await axiosInstance.put('/users/profile', profileData);
      return { success: true, data: response.data };
    } catch (error) {
      const err = error as ErrorResponse;
      console.error('Error updating user profile:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update user profile'
      };
    }
  },

  // Get all users (for admin)
  getAllUsers: async (): Promise<ServiceResponse> => {
    try {
      const response = await axiosInstance.get('/users');
      return { success: true, data: response.data };
    } catch (error) {
      const err = error as ErrorResponse;
      console.error('Error fetching users:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to fetch users'
      };
    }
  },

  // Get a specific user by ID (for admin)
  getUserById: async (userId: string): Promise<ServiceResponse> => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      const err = error as ErrorResponse;
      console.error(`Error fetching user ${userId}:`, err);
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to fetch user'
      };
    }
  },

  // Update a specific user by ID (for admin)
  updateUser: async (userId: string, userData: UserData): Promise<ServiceResponse> => {
    try {
      const response = await axiosInstance.put(`/users/${userId}`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      const err = error as ErrorResponse;
      console.error(`Error updating user ${userId}:`, err);
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update user'
      };
    }
  },

  // Delete a specific user by ID (for admin)
  deleteUser: async (userId: string): Promise<ServiceResponse> => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      return { success: true };
    } catch (error) {
      const err = error as ErrorResponse;
      console.error(`Error deleting user ${userId}:`, err);
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to delete user'
      };
    }
  }
};

export default userService;