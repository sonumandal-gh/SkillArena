import api from "./api";

export const statisticsService = {
  // Get dashboard overall statistics
  async getDashboardStats() {
    const response = await api.get("/statistics/dashboard");
    return response.data;
  },

  // Get correct vs wrong statistics
  async getCorrectWrongStats() {
    const response = await api.get("/statistics/correct-wrong");
    return response.data;
  },

  // Get difficulty breakdown (Easy, Medium, Hard)
  async getDifficultyStats() {
    const response = await api.get("/statistics/difficulty");
    return response.data;
  },

  // Get category breakdown (Arrays, Strings, etc.)
  async getCategoryStats() {
    const response = await api.get("/statistics/category");
    return response.data;
  },

  // Get XP progress
  async getXPProgress() {
    const response = await api.get("/statistics/xp-progress");
    return response.data;
  },

  // Get full user progress statistics
  async getUserProgress() {
    const response = await api.get("/statistics/progress");
    return response.data;
  },

  // Admin: Get overall system overview statistics
  async getAdminStats() {
    const response = await api.get("/statistics/admin");
    return response.data;
  },

  // Public: Get overall platform statistics
  async getPublicStats() {
    const response = await api.get("/statistics/public");
    return response.data;
  },
};

export default statisticsService;
