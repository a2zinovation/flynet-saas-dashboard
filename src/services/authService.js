import apiClient from '../config/api';

const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/login', { email, password });
      
      if (response.Success && response.Data.token) {
        // Store token and user data
        localStorage.setItem('jwt_token', response.Data.token);
        localStorage.setItem('flynet_user', JSON.stringify(response.Data));
        return { success: true, data: response.Data };
      }
      
      return { success: false, message: response.Message || 'Login failed' };
    } catch (error) {
      return { 
        success: false, 
        message: error.Message || 'Invalid credentials' 
      };
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await apiClient.post('/refresh');
      if (response.Success && response.Data.token) {
        localStorage.setItem('jwt_token', response.Data.token);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  },

  // Logout
  logout: async () => {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('flynet_user');
    }
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('flynet_user');
    return user ? JSON.parse(user) : null;
  },

  // Test API connection
  testConnection: async () => {
    try {
      const response = await apiClient.get('/hello-world');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.Message || 'Connection failed' };
    }
  },
};

export default authService;
