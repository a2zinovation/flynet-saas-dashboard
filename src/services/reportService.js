import apiClient from '../config/api';
import { extractErrorMessage, isSuccessResponse, normalizeResponse, getValidationErrors } from '../utils/apiResponseHandler';

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
          from: responseData?.from || 0,
          to: responseData?.to || 0
        },
        message: normalized.message || 'Reports loaded successfully'
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
        message: normalized.message || 'Report loaded successfully'
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
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: { categories: [], actions: [], users: [] }
        };
      }

      return {
        success: true,
        data: normalized.data || { categories: [], actions: [], users: [] },
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
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        message: normalized.message || 'Logs cleaned up successfully'
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
