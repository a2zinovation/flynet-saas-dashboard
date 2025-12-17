import apiClient from '../config/api';
import { extractErrorMessage, isSuccessResponse, normalizeResponse, getValidationErrors } from '../utils/apiResponseHandler';

const businessService = {
  // Get all businesses
  getAll: async () => {
    try {
      const response = await apiClient.get('/business');
      const normalized = normalizeResponse(response);
      
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
        data: normalized.data || [],
        message: normalized.message || 'Businesses loaded successfully'
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
        message: normalized.message || 'Business loaded successfully'
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
      const normalized = normalizeResponse(response);

      // Check Success field and Status code
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
        message: normalized.message || 'Business created successfully'
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

  // Update business
  update: async (formData) => {
    try {
      const response = await apiClient.post('/business-update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const normalized = normalizeResponse(response);
      
      // Check Success field and Status code
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
        message: normalized.message || 'Business updated successfully'
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

  // Toggle business status
  toggleStatus: async (id) => {
    try {
      const response = await apiClient.post('/business-status', { id });
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: normalized.message || 'Business status updated successfully'
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
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: normalized.message || 'Business deleted successfully'
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
