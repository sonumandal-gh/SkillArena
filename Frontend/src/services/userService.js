import api from "./api";

export const userService = {
  // Update user profile (Name)
  async updateProfile(profileData) {
    const response = await api.put("/users/profile", profileData);
    return response.data;
  },

  // Change password for standard accounts
  async changePassword({ currentPassword, newPassword }) {
    const response = await api.put("/users/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Set password for OAuth users who don't have a password yet
  async setPassword({ newPassword }) {
    const response = await api.post("/users/set-password", { newPassword });
    return response.data;
  },

  // Admin: Get all users with search
  async getAllUsers(search = "") {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    const response = await api.get(`/users/users${params}`);
    return response.data;
  },

  // Admin: Get user by ID
  async getUserById(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Admin: Update user role ('user' | 'admin')
  async updateUserRole(userId, role) {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  // Admin: Delete user
  async deleteUser(userId) {
    const response = await api.delete(`/users/users/${userId}`);
    return response.data;
  },
};

export default userService;
