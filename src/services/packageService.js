import apiClient from '../config/api';
import { extractErrorMessage, isSuccessResponse, normalizeResponse, getValidationErrors } from '../utils/apiResponseHandler';

const packageService = {
  // Get all packages
  getAll: async () => {
    try {
      const response = await apiClient.get('/subscription-package');
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: []
        };
      }

      return {
        success: true,
        data: normalized.data || [],
        message: normalized.message || 'Packages loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: []
      };
    }
  },

  // Get package by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/subscription-package-by-id/${id}`);
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: null
        };
      }

      return {
        success: true,
        data: normalized.data,
        message: normalized.message || 'Package loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: null
      };
    }
  },

  // Create package
  create: async (packageData) => {
    try {
      const response = await apiClient.post('/subscription-package-save', packageData);
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: null,
          validationErrors: getValidationErrors(response)
        };
      }

      return {
        success: true,
        data: normalized.data,
        message: normalized.message || 'Package created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: null,
        validationErrors: getValidationErrors(error)
      };
    }
  },

  // Update package
  update: async (packageData) => {
    try {
      const response = await apiClient.post('/subscription-package-update', packageData);
      
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: null,
          validationErrors: getValidationErrors(response)
        };
      }

      return {
        success: true,
        data: normalized.data,
        message: normalized.message || 'Package updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: null,
        validationErrors: getValidationErrors(error)
      };
    }
  },

  // Toggle package status
  toggleStatus: async (id) => {
    try {
      const response = await apiClient.post('/subscription-package-status', { id });
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: normalized.message || 'Package status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error)
      };
    }
  },

  // Delete package
  delete: async (id) => {
    try {
      const response = await apiClient.post('/subscription-package-delete', { id });
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: normalized.message || 'Package deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error)
      };
    }
  },

  // Get all features
  getAllFeatures: async () => {
    try {
      const response = await apiClient.get('/subscription-package-feature');
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: []
        };
      }

      return {
        success: true,
        data: normalized.data || [],
        message: normalized.message || 'Features loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: []
      };
    }
  },

  // Get feature by ID
  getFeatureById: async (id) => {
    try {
      const response = await apiClient.get(`/subscription-package-feature-by-id/${id}`);
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: null
        };
      }

      return {
        success: true,
        data: normalized.data,
        message: normalized.message || 'Feature loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: null
      };
    }
  },

  // Create feature
  createFeature: async (featureData) => {
    try {
      const response = await apiClient.post('/subscription-package-feature-save', featureData);
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: null,
          validationErrors: getValidationErrors(response)
        };
      }

      return {
        success: true,
        data: normalized.data,
        message: normalized.message || 'Feature created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: null,
        validationErrors: getValidationErrors(error)
      };
    }
  },

  // Update feature
  updateFeature: async (featureData) => {
    try {
      const response = await apiClient.post('/subscription-package-feature-update', featureData);
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: null,
          validationErrors: getValidationErrors(response)
        };
      }

      return {
        success: true,
        data: normalized.data,
        message: normalized.message || 'Feature updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: null,
        validationErrors: getValidationErrors(error)
      };
    }
  },

  // Toggle feature status
  toggleFeatureStatus: async (id) => {
    try {
      const response = await apiClient.post('/subscription-package-feature-status', { id });
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: normalized.message || 'Feature status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error)
      };
    }
  },

  // Delete feature
  deleteFeature: async (id) => {
    try {
      const response = await apiClient.post('/subscription-package-feature-delete', { id });
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: normalized.message || 'Feature deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error)
      };
    }
  },

  // Get deleted packages (soft deleted)
  getDeleted: async () => {
    try {
      const response = await apiClient.get('/subscription-package-deleted');
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: []
        };
      }

      return {
        success: true,
        data: normalized.data || [],
        message: normalized.message || 'Deleted packages loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: []
      };
    }
  },

  // Restore package
  restore: async (id) => {
    try {
      const response = await apiClient.post('/subscription-package-restore', { id });
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: normalized.message || 'Package restored successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error)
      };
    }
  },
};

export default packageService;
