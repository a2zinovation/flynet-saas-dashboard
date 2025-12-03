import apiClient from '../config/api';

/**
 * Helper function to extract error messages from validation errors
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

const notificationService = {
  /**
   * Get all notifications for current user
   * @param {Object} params - Query parameters
   * @param {Number} params.page - Page number
   * @param {Number} params.per_page - Items per page
   * @param {String} params.search - Search query
   * @param {String} params.status - Filter by status ('read', 'unread', 'all')
   * @param {String} params.type - Filter by type ('Alarm', 'System', 'Message', etc.)
   * @returns {Object} - { success, data, message, pagination, unread_count }
   */
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.type) queryParams.append('type', params.type);

      const url = `/notifications${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await apiClient.get(url);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: [],
          pagination: null,
          unread_count: 0
        };
      }

      // Backend may have reversed structure: Message contains data, Data contains message
      const paginationData = response.Message || response.Data;
      const successMessage = response.Data || response.Message;

      return {
        success: true,
        data: paginationData?.data || paginationData?.notifications || [],
        pagination: paginationData?.current_page ? {
          current_page: paginationData.current_page,
          last_page: paginationData.last_page,
          per_page: paginationData.per_page,
          total: paginationData.total,
        } : null,
        unread_count: paginationData?.unread_count || 0,
        message: typeof successMessage === 'string' ? successMessage : 'Notifications loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: [],
        pagination: null,
        unread_count: 0
      };
    }
  },

  /**
   * Get notification by ID
   * @param {Number|String} id - Notification ID
   * @returns {Object} - { success, data, message }
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/notifications/${id}`);
      
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
        message: response.Message || 'Notification loaded successfully'
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
   * Mark notification(s) as read
   * @param {Number|String|Array} ids - Notification ID(s)
   * @returns {Object} - { success, message }
   */
  markAsRead: async (ids) => {
    try {
      const payload = Array.isArray(ids) ? { ids } : { id: ids };
      const response = await apiClient.post('/notifications/mark-read', payload);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: response.Message || 'Notification(s) marked as read'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error)
      };
    }
  },

  /**
   * Mark notification(s) as unread
   * @param {Number|String|Array} ids - Notification ID(s)
   * @returns {Object} - { success, message }
   */
  markAsUnread: async (ids) => {
    try {
      const payload = Array.isArray(ids) ? { ids } : { id: ids };
      const response = await apiClient.post('/notifications/mark-unread', payload);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: response.Message || 'Notification(s) marked as unread'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error)
      };
    }
  },

  /**
   * Mark all notifications as read
   * @returns {Object} - { success, message }
   */
  markAllAsRead: async () => {
    try {
      const response = await apiClient.post('/notifications/mark-all-read');
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: response.Message || 'All notifications marked as read'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error)
      };
    }
  },

  /**
   * Delete notification(s)
   * @param {Number|String|Array} ids - Notification ID(s)
   * @returns {Object} - { success, message }
   */
  delete: async (ids) => {
    try {
      const payload = Array.isArray(ids) ? { ids } : { id: ids };
      const response = await apiClient.post('/notifications/delete', payload);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: response.Message || 'Notification(s) deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error)
      };
    }
  },

  /**
   * Delete all read notifications
   * @returns {Object} - { success, message }
   */
  deleteAllRead: async () => {
    try {
      const response = await apiClient.post('/notifications/delete-all-read');
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: response.Message || 'All read notifications deleted'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error)
      };
    }
  },

  /**
   * Get unread notification count
   * @returns {Object} - { success, count, message }
   */
  getUnreadCount: async () => {
    try {
      const response = await apiClient.get('/notifications/unread-count');
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          count: 0
        };
      }

      return {
        success: true,
        count: response.Data?.count || response.Data || 0,
        message: response.Message || 'Unread count retrieved'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        count: 0
      };
    }
  }
};

export default notificationService;
