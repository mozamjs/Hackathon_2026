import api from './api';

export const complaintService = {
  /**
   * Get all complaints with query parameters (search, category, status, area, sort)
   */
  async getComplaints(params = {}) {
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      if (params[key] && params[key] !== 'all') {
        cleanParams[key] = params[key];
      }
    });
    const response = await api.get('/complaints', { params: cleanParams });
    return response.data;
  },

  /**
   * Get complaints submitted by the authenticated citizen
   */
  async getMyComplaints() {
    const response = await api.get('/complaints/mine');
    return response.data;
  },

  /**
   * Get single complaint by ID
   */
  async getComplaintById(id) {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },

  /**
   * Create a new complaint (Citizen only)
   */
  async createComplaint(data) {
    const response = await api.post('/complaints', data);
    return response.data;
  },

  /**
   * Upvote a complaint (Citizen only)
   */
  async upvoteComplaint(id) {
    const response = await api.patch(`/complaints/${id}/upvote`);
    return response.data;
  },

  /**
   * Update complaint status and remarks (Officer only)
   */
  async updateComplaintStatus(id, { status, remark }) {
    const response = await api.patch(`/complaints/${id}/status`, { status, remark });
    return response.data;
  },

  /**
   * Submit citizen feedback on a resolved complaint (Citizen author only)
   */
  async submitFeedback(id, { rating, comment }) {
    const response = await api.patch(`/complaints/${id}/feedback`, { rating, comment });
    return response.data;
  },

  /**
   * Detect duplicate complaints in the same area & category
   */
  async detectDuplicates(category, area) {
    if (!category || !area) return { data: { duplicates: [] } };
    const response = await api.get('/complaints/duplicates', {
      params: { category, area },
    });
    return response.data;
  },

  /**
   * Get aggregated operational statistics for officer dashboard
   */
  async getOfficerStats() {
    const response = await api.get('/complaints/stats');
    return response.data;
  },
};

export default complaintService;
