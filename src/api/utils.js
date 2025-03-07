const API_BASE_URL = "http://localhost:8000";
const COOKIE_EXPIRATION = 60; // 60 minutes until cookie expires

export async function login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      });
  
      if (!response.ok) throw new Error("Login failed");
  
      const data = await response.json();

      setCookie("access_token", data.access_token, COOKIE_EXPIRATION);
  
      console.log("Login successful", data);
    } catch (error) {
      console.error("Error:", error);
    }
}

function setCookie(name, value, minutes) {
  const expires = new Date();
  expires.setTime(expires.getTime() + minutes * 60 * 1000);
  document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}; Secure; SameSite=Strict`;
}

// Function to get cookie value by name
export function getCookie(name) {
  const cookieName = `${name}=`;
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
}

// Function to add auth token from cookie to request headers
export function addAuthHeader(headers = {}) {
  const token = getCookie("access_token");
  
  if (token) {
    return {
      ...headers,
      "Authorization": `Bearer ${token}`
    };
  }
  
  return headers;
}

// Function for authenticated API requests
export async function fetchWithAuth(url, options = {}) {
  const headers = addAuthHeader(options.headers || {});
  
  return fetch(url, {
    ...options,
    headers
  });
}

export async function fetchProtectedData() {
    const token = localStorage.getItem("access_token");
  
    if (!token) {
      console.error("No access token found");
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/auth`, {
        method: "GET",
        //credentials: "include"
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      console.log("Protected data:", data);
    } catch (error) {
      console.error("Error:", error);
    }
}

function deleteCookie(name) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}

export function logout() {
    localStorage.removeItem("access_token");
    deleteCookie("access_token")
    console.log("Logged out successfully");
  }
  
  
