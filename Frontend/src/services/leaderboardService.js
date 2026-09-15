import api from "./api";

export const leaderboardService = {
  // Get all leaderboard rankings
  async getLeaderboard() {
    const response = await api.get("/leaderboard");
    return response.data;
  },

  // Get paginated leaderboard
  async getLeaderboardPagination(page = 1, limit = 10) {
    const response = await api.get(`/leaderboard/pagination?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Search leaderboard by user name
  async searchLeaderboard(search = "") {
    const response = await api.get(`/leaderboard/search?search=${encodeURIComponent(search)}`);
    return response.data;
  },

  // Get current logged-in user's rank
  async getMyRank() {
    const response = await api.get("/leaderboard/my-rank");
    return response.data;
  },

  // Calculate rank for specific user
  async calculateRank(userId) {
    const response = await api.get(`/leaderboard/rank/${userId}`);
    return response.data;
  },
};

export default leaderboardService;
