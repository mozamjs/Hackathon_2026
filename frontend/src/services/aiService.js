import api from './api';

export const aiService = {
  /**
   * Generate an AI operational summary/briefing for government officers
   */
  async getOfficerSummary() {
    const response = await api.post('/ai/officer-summary');
    return response.data;
  },
};

export default aiService;
