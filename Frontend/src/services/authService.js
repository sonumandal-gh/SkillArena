import api from "./api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5003/api";

export const authService = {
  // Register a new user
  async register(userData) {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Login user with email & password
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Get current authenticated user profile
  async getMe() {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Refresh access token
  async refreshToken(refreshToken) {
    const response = await api.post("/auth/refresh-token", { refreshToken });
    return response.data;
  },

  // Logout current user
  async logout() {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch {
      // Even if network fails, logout locally
      return { message: "Logged out locally" };
    }
  },

  // Google OAuth URL for direct redirection
  getGoogleAuthUrl() {
    return `${API_BASE_URL}/auth/google`;
  },
};

export default authService;
