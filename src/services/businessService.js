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

const businessService = {
  // Get all businesses
  getAll: async () => {
    try {
      const response = await apiClient.get('/business');
      
      // Check if response indicates success
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
        message: response.Message || 'Businesses loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: []
      };
    }
  },

  // Get business by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/business-by-id/${id}`);
      
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
        message: response.Message || 'Business loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: null
      };
    }
  },

  // Create business
  create: async (formData) => {
    try {
      const response = await apiClient.post('/business-save', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Check Success field and Status code
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
        message: response.Message || 'Business created successfully'
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

  // Update business
  update: async (formData) => {
    try {
      const response = await apiClient.post('/business-update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Check Success field and Status code
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
        message: response.Message || 'Business updated successfully'
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

  // Toggle business status
  toggleStatus: async (id) => {
    try {
      const response = await apiClient.post('/business-status', { id });
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: response.Message || 'Business status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error)
      };
    }
  },

  // Delete business
  delete: async (id) => {
    try {
      const response = await apiClient.post('/business-delete', { id });
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: response.Message || 'Business deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error)
      };
    }
  },
};

export default businessService;
