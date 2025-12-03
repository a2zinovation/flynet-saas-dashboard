import apiClient from '../config/api';

/**
 * Helper function to extract error messages from validation errors
 * @param {Object|String} error - Error object or string
 * @returns {String} - Formatted error message
 */
const extractErrorMessage = (error) => {
  // If error is a string, return it directly
  if (typeof error === 'string') {
    return error;
  }

  // If error.Message is an object (validation errors)
  if (error.Message && typeof error.Message === 'object') {
    const validationErrors = Object.values(error.Message)
      .flat()
      .join(', ');
    return validationErrors || 'Validation failed';
  }

  // If error.Message is a string
  if (error.Message) {
    return error.Message;
  }

  // If error.message exists (standard JS error)
  if (error.message) {
    return error.message;
  }

  // Default fallback
  return 'An unexpected error occurred';
};

/**
 * Helper function to check if response indicates success
 * @param {Object} response - API response
 * @returns {Boolean} - True if successful
 */
const isSuccessResponse = (response) => {
  // Check Success field explicitly
  if (response.hasOwnProperty('Success')) {
    return response.Success === true;
  }

  // Check Status field for success codes (200-299)
  if (response.hasOwnProperty('Status')) {
    return response.Status >= 200 && response.Status < 300;
  }

  // Fallback: assume success if no error indicators
  return true;
};

const packageService = {
  // Get all packages
  getAll: async () => {
    try {
      const response = await apiClient.get('/subscription-package');
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: []
        };
      }

      return {
        success: true,
        data: response.Data || [],
        message: response.Message || 'Packages loaded successfully'
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
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: null
        };
      }

      return {
        success: true,
        data: response.Data,
        message: response.Message || 'Package loaded successfully'
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
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: null,
          validationErrors: typeof response.Message === 'object' ? response.Message : null
        };
      }

      return {
        success: true,
        data: response.Data,
        message: response.Message || 'Package created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: null,
        validationErrors: error.Message && typeof error.Message === 'object' ? error.Message : null
      };
    }
  },

  // Update package
  update: async (packageData) => {
    try {
      const response = await apiClient.post('/subscription-package-update', packageData);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: null,
          validationErrors: typeof response.Message === 'object' ? response.Message : null
        };
      }

      return {
        success: true,
        data: response.Data,
        message: response.Message || 'Package updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: null,
        validationErrors: error.Message && typeof error.Message === 'object' ? error.Message : null
      };
    }
  },

  // Toggle package status
  toggleStatus: async (id) => {
    try {
      const response = await apiClient.post('/subscription-package-status', { id });
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: response.Message || 'Package status updated successfully'
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
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: response.Message || 'Package deleted successfully'
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
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: []
        };
      }

      return {
        success: true,
        data: response.Data || [],
        message: response.Message || 'Features loaded successfully'
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
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: null
        };
      }

      return {
        success: true,
        data: response.Data,
        message: response.Message || 'Feature loaded successfully'
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
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: null,
          validationErrors: typeof response.Message === 'object' ? response.Message : null
        };
      }

      return {
        success: true,
        data: response.Data,
        message: response.Message || 'Feature created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: null,
        validationErrors: error.Message && typeof error.Message === 'object' ? error.Message : null
      };
    }
  },

  // Update feature
  updateFeature: async (featureData) => {
    try {
      const response = await apiClient.post('/subscription-package-feature-update', featureData);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: null,
          validationErrors: typeof response.Message === 'object' ? response.Message : null
        };
      }

      return {
        success: true,
        data: response.Data,
        message: response.Message || 'Feature updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: null,
        validationErrors: error.Message && typeof error.Message === 'object' ? error.Message : null
      };
    }
  },

  // Toggle feature status
  toggleFeatureStatus: async (id) => {
    try {
      const response = await apiClient.post('/subscription-package-feature-status', { id });
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: response.Message || 'Feature status updated successfully'
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
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: response.Message || 'Feature deleted successfully'
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
