import apiClient from '../config/api';
import { extractErrorMessage, isSuccessResponse, normalizeResponse, getValidationErrors } from '../utils/apiResponseHandler';

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
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: [],
          pagination: null,
          unread_count: 0
        };
      }

      // Handle both array and paginated response
      const responseData = normalized.data;
      const isArray = Array.isArray(responseData);

      return {
        success: true,
        data: isArray ? responseData : (responseData?.data || responseData?.notifications || []),
        pagination: isArray ? null : {
          current_page: responseData?.current_page || 1,
          last_page: responseData?.last_page || 1,
          per_page: responseData?.per_page || 25,
          total: responseData?.total || 0,
        },
        unread_count: responseData?.unread_count || 0,
        message: normalized.message || 'Notifications loaded successfully'
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
        message: normalized.message || 'Notification loaded successfully'
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
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: normalized.message || 'Notification(s) marked as read'
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
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: normalized.message || 'Notification(s) marked as unread'
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
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: normalized.message || 'All notifications marked as read'
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
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: normalized.message || 'Notification(s) deleted successfully'
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
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: normalized.message || 'All read notifications deleted'
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
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          count: 0
        };
      }

      // Normalize count: backend may return data as { count: N } or just a number
      let count = 0;
      if (normalized.data != null) {
        if (typeof normalized.data === 'object' && Object.prototype.hasOwnProperty.call(normalized.data, 'count')) {
          count = Number(normalized.data.count) || 0;
        } else if (typeof normalized.data === 'number') {
          count = Number(normalized.data) || 0;
        }
      }

      return {
        success: true,
        count,
        message: normalized.message || 'Unread count retrieved'
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
