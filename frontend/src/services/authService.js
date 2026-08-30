import api from './api';

export const authService = {
  /**
   * Register a new citizen account
   */
  async signup(name, email, password) {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  },

  /**
   * Authenticate user (Citizen or Officer)
   */
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Refresh JWT token
   */
  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  /**
   * Fetch current authenticated user's profile
   */
  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default authService;
