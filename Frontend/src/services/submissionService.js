import api from "./api";

export const submissionService = {
  // Dry run code test cases without recording submission
  async runCode({ challengeId, code, language }) {
    const response = await api.post("/submissions/run", {
      challengeId,
      code,
      language,
    });
    return response.data;
  },

  // Submit MCQ answer or code solution
  async submitAnswer({ challengeId, answer, code, language }) {
    const response = await api.post("/submissions/submit", {
      challengeId,
      answer,
      code,
      language,
    });
    return response.data;
  },

  // Get current user's past submissions
  async getMySubmissions() {
    const response = await api.get("/submissions/my");
    return response.data;
  },

  // Get single submission by ID
  async getSubmissionById(id) {
    const response = await api.get(`/submissions/${id}`);
    return response.data;
  },
};

export default submissionService;
