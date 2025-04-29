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

// Login API call
export const loginCallAPI = async (usernameOrEmail, password) => {
  try {
    const response = await axios.post(AUTH_REST_API_URL + "/login", {
      usernameOrEmail,
      password,
    });

    // Kiểm tra response và gọi getCurrentUser để lấy thông tin user
    if (response.status === 200) {
      const user = await getCurrentUser();
      return { success: true, user };
    }

    throw new Error("Login failed");
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Redirect to Google OAuth2
export const redirectToGoogleLogin = () => {
  window.location.href = OAUTH2_GOOGLE_URL;
};

// Logout API call
export const logout = async () => {
  try {
    await axios.post(`${AUTH_REST_API_URL}/logout`);
    // Clear any stored user data
    localStorage.removeItem("user");
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
    const response = await axios.get(`${AUTH_REST_API_URL}/me`);
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    }
    return null;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      return null;
    }
    throw error;
  }
};
