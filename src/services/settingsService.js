import apiClient from '../config/api';
import { extractErrorMessage, isSuccessResponse, normalizeResponse, getValidationErrors } from '../utils/apiResponseHandler';

const settingsService = {
  /**
   * Get all settings
   * @returns {Object} - { success, data, message }
   */
  getAll: async () => {
    try {
      const response = await apiClient.get('/settings');
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
        message: normalized.message || 'Settings loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: null
      };
    }
  },

  /**
   * Get super admin settings
   * @returns {Object} - { success, data, message }
   */
  getSuperAdminSettings: async () => {
    try {
      const response = await apiClient.get('/settings');
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
        message: normalized.message || 'Super admin settings loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: null
      };
    }
  },

  /**
   * Update super admin settings
   * @param {Object} settingsData
   * @returns {Object} - { success, data, message }
   */
  updateSuperAdminSettings: async (settingsData) => {
    try {
      const response = await apiClient.post('/settings', settingsData);
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
        message: normalized.message || 'Settings updated successfully'
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

  /**
   * Get email/SMTP settings
   * @returns {Object} - { success, data, message }
   */
  getEmailSettings: async () => {
    try {
      const response = await apiClient.get('/settings/email');
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
        message: normalized.message || 'Email settings loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: null
      };
    }
  },

  /**
   * Update email/SMTP settings
   * @param {Object} emailData
   * @returns {Object} - { success, data, message }
   */
  updateEmailSettings: async (emailData) => {
    try {
      const response = await apiClient.post('/settings/email', emailData);
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: null,
          validationErrors: response?.data?.message || getValidationErrors(response)
        };
      }

      return {
        success: true,
        data: normalized.data,
        message: normalized.message || 'Email settings updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: null,
        validationErrors: error?.response?.data?.message || getValidationErrors(error)
      };
    }
  },


  /**
   * Get all payment gateways
   * @returns {Object} - { success, data, message }
   */
  getPaymentGateways: async () => {
    try {
      const response = await apiClient.get('/settings/payment-gateways');
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
        message: normalized.message || 'Payment gateways loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: []
      };
    }
  },

  /**
   * Get payment gateway by ID
   * @param {Number|String} id
   * @returns {Object} - { success, data, message }
   */
  getPaymentGatewayById: async (id) => {
    try {
      const response = await apiClient.get(`/settings/payment-gateways/${id}`);
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
        message: normalized.message || 'Payment gateway loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: null
      };
    }
  },

  /**
   * Create payment gateway
   * @param {Object} gatewayData
   * @returns {Object} - { success, data, message }
   */
  createPaymentGateway: async (gatewayData) => {
    try {
      const response = await apiClient.post('/settings/payment-gateways', gatewayData);
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
        message: normalized.message || 'Payment gateway created successfully'
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

  /**
   * Update payment gateway
   * @param {Number|String} id
   * @param {Object} gatewayData
   * @returns {Object} - { success, data, message }
   */
  updatePaymentGateway: async (id, gatewayData) => {
    try {
      const response = await apiClient.post(`/settings/payment-gateways/${id}`, gatewayData);
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
        message: normalized.message || 'Payment gateway updated successfully'
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

  /**
   * Delete payment gateway
   * @param {Number|String} id
   * @returns {Object} - { success, message }
   */
  deletePaymentGateway: async (id) => {
    try {
      const response = await apiClient.delete(`/settings/payment-gateways/${id}`);
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: normalized.message || 'Payment gateway deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error)
      };
    }
  },

  /**
   * Toggle payment gateway status
   * @param {Number|String} id
   * @returns {Object} - { success, message }
   */
  togglePaymentGatewayStatus: async (id) => {
    try {
      const response = await apiClient.post(`/settings/payment-gateways/${id}/toggle-status`);
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: normalized.message || 'Payment gateway status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error)
      };
    }
  }
};

export default settingsService;
