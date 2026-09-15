import api from "./api";

export const challengeService = {
  // Get all challenges with optional search and filters
  async getAllChallenges({ search = "", category = "", difficulty = "" } = {}) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (difficulty) params.append("difficulty", difficulty);

    const response = await api.get(`/challenges?${params.toString()}`);
    return response.data;
  },

  // Get challenge by ID
  async getChallengeById(challengeId) {
    const response = await api.get(`/challenges/${challengeId}`);
    return response.data;
  },

  // Create challenge (Admin only)
  async createChallenge(challengeData) {
    const response = await api.post("/challenges", challengeData);
    return response.data;
  },

  // Update challenge (Admin only)
  async updateChallenge(challengeId, updateData) {
    const response = await api.put(`/challenges/${challengeId}`, updateData);
    return response.data;
  },

  // Delete challenge (Admin only)
  async deleteChallenge(challengeId) {
    const response = await api.delete(`/challenges/${challengeId}`);
    return response.data;
  },
};

export default challengeService;
