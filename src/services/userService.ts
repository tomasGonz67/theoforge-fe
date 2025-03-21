// src/services/userService.ts
import axiosInstance from '../utils/axiosConfig';

const userService = {
  // Get the current user's profile
  getProfile: async () => {
    try {
      const response = await axiosInstance.get('/users/profile');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user profile'
      };
    }
  },

  // Updatethe current user's profile
  updateProfile: async (profileData: any) => {
    try {
      const response = await axiosInstance.put('/users/profile', profileData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user profile'
      };
    }
  },

  // Get all users (for admin)
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get('/users');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch users'
      };
    }
  },

  // Get a specific user by ID (for admin)
  getUserById: async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user'
      };
    }
  },

  // Update a specific user by ID (for admin)
  updateUser: async (userId: string, userData: any) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user'
      };
    }
  },

  // Delete a specific user by ID (for admin)
  deleteUser: async (userId: string) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete user'
      };
    }
  }
};

export default userService;