import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const AUTH_REST_API_URL = `${BASE_URL}/api/auth`;
const OAUTH2_GOOGLE_URL = `${BASE_URL}/oauth2/authorization/google`;

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";

// Register API call
export const registerCallAPI = async (registerObj) => {
  try {
    const response = await axios.post(
      AUTH_REST_API_URL + "/register",
      registerObj
    );

    // Return success if registration is successful (201 Created)
    if (response.status === 201) {
      return { success: true };
    }

    throw new Error("Registration failed");
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Redirect to Google OAuth2
export const redirectToGoogleLogin = () => {
  window.location.href = OAUTH2_GOOGLE_URL;
};

// Login API call
export const loginCallAPI = async (usernameOrEmail, password) => {
  try {
    console.log("Attempting login for:", usernameOrEmail);
    const response = await axios.post(AUTH_REST_API_URL + "/login", {
      usernameOrEmail,
      password,
    });

    console.log("Login response:", response);

    // Kiểm tra response và gọi getCurrentUser để lấy thông tin user
    if (response.status === 200) {
      // Lưu trạng thái đăng nhập vào localStorage
      if (response.data && response.data.username) {
        localStorage.setItem("user", JSON.stringify(response.data));
        console.log("User info saved to localStorage:", response.data);
      }

      return {
        success: true,
        user: response.data || (await getCurrentUser()),
      };
    }

    throw new Error("Login failed");
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Logout API call
export const logout = async () => {
  try {
    console.log("Attempting logout");
    const response = await axios.post(`${AUTH_REST_API_URL}/logout`);
    console.log("Logout response:", response);

    // Clear any stored user data
    localStorage.removeItem("user");

    // Kiểm tra nếu cookie vẫn còn
    const cookies = document.cookie;
    console.log("Cookies after logout:", cookies);

    // Force xóa cookie bằng javascript nếu cần
    document.cookie =
      "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=none";
    document.cookie =
      "roles=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=none";

    return true;
  } catch (error) {
    console.error("Logout error:", error);
    // Force logout on client side even if server call fails
    localStorage.removeItem("user");
    throw error;
  }
};

// Get current user information
export const getCurrentUser = async () => {
  try {
    console.log("Fetching current user info");
    const response = await axios.get(`${AUTH_REST_API_URL}/me`);
    console.log("Current user response:", response);

    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      return null;
    }
    throw error;
  }
};

// Check if user is logged in
export const isLoggedIn = () => {
  return localStorage.getItem("user") !== null;
};
