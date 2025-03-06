const API_BASE_URL = "http://localhost:8000";

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
      
      // Store the JWT in localStorage or sessionStorage
      localStorage.setItem("access_token", data.access_token);
  
      console.log("Login successful", data);
    } catch (error) {
      console.error("Error:", error);
    }
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

export function logout() {
    localStorage.removeItem("access_token");
    console.log("Logged out successfully");
  }
  
  
