import { fetchWithAuth, getCookie, logout } from "./utils";

const API_BASE_URL = "http://localhost:8000";

/**
 * Checks user authentication status by verifying token and making an API call
 * @returns {Promise<{success: boolean, data: object|null, message: string}>}
 */
export async function checkAuthentication() {
  try {
    const token = getCookie("access_token");
    
    if (!token) {
      return {
        success: false,
        data: null,
        message: "Not authenticated: No token found"
      };
    }
    
    // Call auth endpoint
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/auth`);
    
    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data,
      message: `Authentication successful!`
    };
  } catch (error) {
    console.error("Authentication check failed:", error);
    
    // Handle expired token
    if (error.message.includes("401")) {
      setTimeout(() => {
        alert("Your session has expired. Please log in again.");
        logout();
      }, 1000);
    }
    
    return {
      success: false,
      data: null,
      message: `Authentication failed: ${error.message}`
    };
  }
}

/**
 * Redirects to login page
export function redirectToLogin() {
  window.location.href = "/login";
}
*/

/**
 * Verify token on app initialization
 * @returns {Promise<boolean>}
 */
export async function verifyAuthOnLoad() {
  const result = await checkAuthentication();
  return result.success;
}