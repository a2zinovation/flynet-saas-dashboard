import apiClient from '../config/api';

/**
 * Helper function to extract error messages from validation errors
 * @param {Object|String} error - Error object or string
 * @returns {String} - Formatted error message
 */
const extractErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }

  if (error.Message && typeof error.Message === 'object') {
    const validationErrors = Object.values(error.Message)
      .flat()
      .join(', ');
    return validationErrors || 'Validation failed';
  }

  if (error.Message) {
    return error.Message;
  }

  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

/**
 * Helper function to check if response indicates success
 * @param {Object} response - API response
 * @returns {Boolean} - True if successful
 */
const isSuccessResponse = (response) => {
  if (response.hasOwnProperty('Success')) {
    return response.Success === true;
  }

  if (response.hasOwnProperty('Status')) {
    return response.Status >= 200 && response.Status < 300;
  }

  return true;
};

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
        message: response.Message || 'Message sent successfully'
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
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: [],
          pagination: null
        };
      }

      // Backend has reversed structure: Message contains pagination data, Data contains success message
      const paginationData = response.Message || response.Data;
      const successMessage = response.Data || response.Message;

      return {
        success: true,
        data: paginationData?.data || [],
        pagination: paginationData?.current_page ? {
          current_page: paginationData.current_page,
          last_page: paginationData.last_page,
          per_page: paginationData.per_page,
          total: paginationData.total,
        } : null,
        message: typeof successMessage === 'string' ? successMessage : 'Message history loaded successfully'
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
        message: response.Message || 'Message loaded successfully'
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
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: { businesses: [], users: [], groups: [] }
        };
      }

      return {
        success: true,
        data: response.Data || { businesses: [], users: [], groups: [] },
        message: response.Message || 'Recipient options loaded successfully'
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
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: response.Message || 'Message deleted successfully'
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
