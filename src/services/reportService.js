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

const reportService = {
  /**
   * Get all activity logs/reports
   * @param {Object} params - Query parameters for filtering
   * @param {Number} params.page - Page number (default: 1)
   * @param {Number} params.per_page - Items per page (default: 25)
   * @param {String} params.search - Search query
   * @param {String} params.category - Filter by category (Business, Package, Settings, User, etc.)
   * @param {String} params.action - Filter by action type
   * @param {String} params.date_from - Filter by start date (YYYY-MM-DD)
   * @param {String} params.date_to - Filter by end date (YYYY-MM-DD)
   * @returns {Object} - { success, data, message, pagination }
   */
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      
      // Add filters
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.action) queryParams.append('action', params.action);
      if (params.date_from) queryParams.append('date_from', params.date_from);
      if (params.date_to) queryParams.append('date_to', params.date_to);

      const url = `/activity-logs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await apiClient.get(url);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: [],
          pagination: null
        };
      }

      return {
        success: true,
        data: response.Data?.data || response.Data || [],
        pagination: {
          current_page: response.Data?.current_page || 1,
          last_page: response.Data?.last_page || 1,
          per_page: response.Data?.per_page || 25,
          total: response.Data?.total || 0,
          from: response.Data?.from || 0,
          to: response.Data?.to || 0
        },
        message: response.Message || 'Reports loaded successfully'
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
   * Get activity log by ID
   * @param {Number|String} id - Log ID
   * @returns {Object} - { success, data, message }
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/activity-log/${id}`);
      
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
        message: response.Message || 'Report loaded successfully'
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
   * Export reports to CSV
   * @param {Object} params - Same filters as getAll
   * @returns {Object} - { success, data (blob or url), message }
   */
  exportCSV: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.action) queryParams.append('action', params.action);
      if (params.date_from) queryParams.append('date_from', params.date_from);
      if (params.date_to) queryParams.append('date_to', params.date_to);

      const url = `/activity-logs/export${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await apiClient.get(url, {
        responseType: 'blob', // Important for file download
      });
      
      // For blob responses, create download link
      const blob = new Blob([response], { type: 'text/csv' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `activity_logs_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return {
        success: true,
        message: 'CSV exported successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error)
      };
    }
  },

  /**
   * Get available filter options (categories, actions, users)
   * @returns {Object} - { success, data: { categories, actions, users }, message }
   */
  getFilterOptions: async () => {
    try {
      const response = await apiClient.get('/activity-logs/filters');
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: { categories: [], actions: [], users: [] }
        };
      }

      return {
        success: true,
        data: response.Data || { categories: [], actions: [], users: [] },
        message: 'Filter options loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: { categories: [], actions: [], users: [] }
      };
    }
  },

  /**
   * Delete old logs (cleanup)
   * @param {String} before_date - Delete logs before this date (YYYY-MM-DD)
   * @returns {Object} - { success, message }
   */
  cleanup: async (before_date) => {
    try {
      const response = await apiClient.post('/activity-logs/cleanup', { before_date });
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: response.Message || 'Logs cleaned up successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error)
      };
    }
  }
};

export default reportService;
