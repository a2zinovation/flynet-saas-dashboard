import apiClient from '../config/api';
import { extractErrorMessage, isSuccessResponse, normalizeResponse, getValidationErrors } from '../utils/apiResponseHandler';

const communicatorService = {
  /**
   * Send message/notification to users
   * @param {Object} messageData
   * @param {String} messageData.subject - Message subject
   * @param {String} messageData.message - Message content (HTML)
   * @param {String} messageData.recipient_type - 'all', 'super_admins', 'businesses', 'business_users', 'specific'
   * @param {Array} messageData.recipient_ids - Array of user IDs (for specific recipients)
   * @param {String} messageData.notification_type - 'info', 'warning', 'alert', 'system'
   * @param {Boolean} messageData.send_email - Also send email notification
   * @returns {Object} - { success, data, message }
   */
  sendMessage: async (messageData) => {
    try {
      const response = await apiClient.post('/notifications/send', messageData);
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
        message: normalized.message || 'Message sent successfully'
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
   * Get message history (sent messages)
   * @param {Object} params - Query parameters
   * @param {Number} params.page - Page number
   * @param {Number} params.per_page - Items per page
   * @param {String} params.search - Search query
   * @returns {Object} - { success, data, message, pagination }
   */
  getMessageHistory: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      if (params.search) queryParams.append('search', params.search);

      const url = `/notifications/sent${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await apiClient.get(url);
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: [],
          pagination: null
        };
      }

      // Handle both array and paginated response
      const responseData = normalized.data;
      const isArray = Array.isArray(responseData);

      return {
        success: true,
        data: isArray ? responseData : (responseData?.data || []),
        pagination: isArray ? null : {
          current_page: responseData?.current_page || 1,
          last_page: responseData?.last_page || 1,
          per_page: responseData?.per_page || 25,
          total: responseData?.total || 0,
        },
        message: normalized.message || 'Message history loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: [],
        pagination: null
      };
    }
  },

  /**
   * Get message details by ID
   * @param {Number|String} id - Message ID
   * @returns {Object} - { success, data, message }
   */
  getMessageById: async (id) => {
    try {
      const response = await apiClient.get(`/notifications/sent/${id}`);
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
        message: normalized.message || 'Message loaded successfully'
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
   * Get recipient options (for dropdown)
   * @returns {Object} - { success, data: { businesses, users, groups }, message }
   */
  getRecipientOptions: async () => {
    try {
      const response = await apiClient.get('/notifications/recipients');
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: { businesses: [], users: [], groups: [] }
        };
      }

      return {
        success: true,
        data: normalized.data || { businesses: [], users: [], groups: [] },
        message: normalized.message || 'Recipient options loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: { businesses: [], users: [], groups: [] }
      };
    }
  },

  /**
   * Delete sent message from history
   * @param {Number|String} id - Message ID
   * @returns {Object} - { success, message }
   */
  deleteMessage: async (id) => {
    try {
      const response = await apiClient.post('/notifications/delete', { id });
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: normalized.message || 'Message deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error)
      };
    }
  }
};

export default communicatorService;
