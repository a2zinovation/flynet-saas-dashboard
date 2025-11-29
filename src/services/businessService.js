import apiClient from '../config/api';

const businessService = {
  // Get all businesses
  getAll: async () => {
    try {
      const response = await apiClient.get('/business');
      return { success: true, data: response.Data || [] };
    } catch (error) {
      return { success: false, message: error.Message, data: [] };
    }
  },

  // Get business by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/business-by-id/${id}`);
      return { success: true, data: response.Data };
    } catch (error) {
      return { success: false, message: error.Message };
    }
  },

  // Create business
  create: async (formData) => {
    try {
      const response = await apiClient.post('/business-save', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { success: true, data: response.Data, message: response.Message };
    } catch (error) {
      return { success: false, message: error.Message };
    }
  },

  // Update business
  update: async (formData) => {
    try {
      const response = await apiClient.post('/business-update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { success: true, data: response.Data, message: response.Message };
    } catch (error) {
      return { success: false, message: error.Message };
    }
  },

  // Toggle business status
  toggleStatus: async (id) => {
    try {
      const response = await apiClient.post('/business-status', { id });
      return { success: true, message: response.Message };
    } catch (error) {
      return { success: false, message: error.Message };
    }
  },

  // Delete business
  delete: async (id) => {
    try {
      const response = await apiClient.post('/business-delete', { id });
      return { success: true, message: response.Message };
    } catch (error) {
      return { success: false, message: error.Message };
    }
  },
};

export default businessService;
