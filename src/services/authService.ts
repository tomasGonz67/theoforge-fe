// src/services/authService.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'; // Update with your actual backend URL

export const authService = {
  login: async (email: string, password: string) => {
    try {
      // Create request body for login endpoint using OAuth2 password grant format
      const loginData = {
        grant_type: 'password',
        username: email,
        password: password,
        scope: '',
        client_id: '',
        client_secret: ''
      };

      // Set headers for form-urlencoded content
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      };

      // Convert object to URL encoded form data
      const formData = Object.entries(loginData)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

      // Make login request with form-urlencoded data
      const response = await axios.post(`${API_URL}/auth/login`, formData, { headers });
      
      // Check if we have a valid token response
      if (response.data.access_token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('token_type', response.data.token_type);
        
        // Fetch user details using the token
        const userResponse = await axios.get(`${API_URL}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${response.data.access_token}`
          }
        });
        
        if (userResponse.data) {
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify(userResponse.data));
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user');
  },

  register: async (userData: any) => {
    try {
      // Set headers for JSON content for registration
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const response = await axios.post(`${API_URL}/auth/register`, userData, { headers });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;