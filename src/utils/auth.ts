// src/utils/auth.ts
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

// Constants for cookie names
const AUTH_TOKEN = 'theoforge_auth_token';
const USER_DATA = 'theoforge_user_data';

// Cookie options for security
const cookieOptions = {
  expires: 7, // Cookie expires after 7 days
  secure: process.env.NODE_ENV === 'production', // Secure in production
  sameSite: 'strict' as const, // Strict same-site policy
  path: '/' // Available across the site
};

// Interface for decoded JWT payload
interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

// Interface for user data
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Set authentication cookies after successful login
 * @param {string} token - JWT token from server
 * @returns The decoded user data from the token
 */
export const setAuthCookies = (token: string): UserData | null => {
  // Store the token
  Cookies.set(AUTH_TOKEN, token, cookieOptions);
  
  try {
    const decoded = jwt_decode<JwtPayload>(token);
    
    // Create a user object from the decoded token
    const userData: UserData = {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role
    };
    
    // Store the user data
    Cookies.set(USER_DATA, JSON.stringify(userData), cookieOptions);
    
    return userData;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

/**
 * Get the current authentication token
 * @returns The JWT token or null if not authenticated
 */
export const getAuthToken = (): string | null => {
  return Cookies.get(AUTH_TOKEN) || null;
};

/**
 * Get the current user data
 * @returns The user data or null if not authenticated
 */
export const getUserData = (): UserData | null => {
  const userDataCookie = Cookies.get(USER_DATA);
  
  if (!userDataCookie) {
    return null;
  }
  
  try {
    return JSON.parse(userDataCookie);
  } catch (error) {
    console.error('Error parsing user data from cookie:', error);
    return null;
  }
};

/**
 * Check if the user is authenticated
 * @returns True if authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  
  if (!token) {
    return false;
  }
  
  // Check if token is expired
  try {
    const decoded = jwt_decode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

/**
 * Check if the user is an admin
 * @returns True if user is an admin
 */
export const isAdmin = (): boolean => {
  const userData = getUserData();
  return userData?.role === 'ADMIN';
};

/**
 * Clear all authentication cookies (logout)
 */
export const clearAuthCookies = (): void => {
  Cookies.remove(AUTH_TOKEN, { path: '/' });
  Cookies.remove(USER_DATA, { path: '/' });
};