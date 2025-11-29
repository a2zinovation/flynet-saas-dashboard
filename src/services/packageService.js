import apiClient from '../config/api';

const packageService = {
  // Get all packages
  getAll: async () => {
    try {
      const response = await apiClient.get('/subscription-package');
      return { success: true, data: response.Data || [] };
    } catch (error) {
      return { success: false, message: error.Message, data: [] };
    }
  },

  // Get package by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/subscription-package-by-id/${id}`);
      return { success: true, data: response.Data };
    } catch (error) {
      return { success: false, message: error.Message };
    }
  },

  // Create package
  create: async (packageData) => {
    try {
      const response = await apiClient.post('/subscription-package-save', packageData);
      return { success: true, data: response.Data, message: response.Message };
    } catch (error) {
      return { success: false, message: error.Message };
    }
  },

  // Update package
  update: async (packageData) => {
    try {
      const response = await apiClient.post('/subscription-package-update', packageData);
      return { success: true, data: response.Data, message: response.Message };
    } catch (error) {
      return { success: false, message: error.Message };
    }
  },

  // Toggle package status
  toggleStatus: async (id) => {
    try {
      const response = await apiClient.post('/subscription-package-status', { id });
      return { success: true, message: response.Message };
    } catch (error) {
      return { success: false, message: error.Message };
    }
  },

  // Delete package
  delete: async (id) => {
    try {
      const response = await apiClient.post('/subscription-package-delete', { id });
      return { success: true, message: response.Message };
    } catch (error) {
      return { success: false, message: error.Message };
    }
  },

  // Get all features
  getAllFeatures: async () => {
    try {
      const response = await apiClient.get('/subscription-package-feature');
      return { success: true, data: response.Data || [] };
    } catch (error) {
      return { success: false, message: error.Message, data: [] };
    }
  },

  // Get feature by ID
  getFeatureById: async (id) => {
    try {
      const response = await apiClient.get(`/subscription-package-feature-by-id/${id}`);
      return { success: true, data: response.Data };
    } catch (error) {
      return { success: false, message: error.Message };
    }
  },

  // Create feature
  createFeature: async (featureData) => {
    try {
      const response = await apiClient.post('/subscription-package-feature-save', featureData);
      return { success: true, data: response.Data, message: response.Message };
    } catch (error) {
      return { success: false, message: error.Message };
    }
  },

  // Update feature
  updateFeature: async (featureData) => {
    try {
      const response = await apiClient.post('/subscription-package-feature-update', featureData);
      return { success: true, data: response.Data, message: response.Message };
    } catch (error) {
      return { success: false, message: error.Message };
    }
  },

  // Toggle feature status
  toggleFeatureStatus: async (id) => {
    try {
      const response = await apiClient.post('/subscription-package-feature-status', { id });
      return { success: true, message: response.Message };
    } catch (error) {
      return { success: false, message: error.Message };
    }
  },

  // Delete feature
  deleteFeature: async (id) => {
    try {
      const response = await apiClient.post('/subscription-package-feature-delete', { id });
      return { success: true, message: response.Message };
    } catch (error) {
      return { success: false, message: error.Message };
    }
  },
};

export default packageService;
