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

      // Handle the Laravel paginated response structure
      const responseData = normalized.data;
      
      // Check if it's a paginated response (has data, current_page, last_page, etc.)
      if (responseData && typeof responseData === 'object' && responseData.data && Array.isArray(responseData.data)) {
        return {
          success: true,
          data: responseData.data, // The actual records array
          pagination: {
            current_page: parseInt(responseData.current_page) || 1,
            last_page: parseInt(responseData.last_page) || 1,
            per_page: parseInt(responseData.per_page) || 25,
            total: parseInt(responseData.total) || 0,
            from: parseInt(responseData.from) || 0,
            to: parseInt(responseData.to) || 0
          },
          message: normalized.message || 'Reports loaded successfully'
        };
      }
      
      // Fallback for simple array response
      const dataArray = Array.isArray(responseData) ? responseData : [];
      return {
        success: true,
        data: dataArray,
        pagination: null,
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
   * Get aggregated summary stats for reports page
   * @param {Object} params - Optional filters (e.g., date_from, date_to)
   * @returns {Object} - { success, data, message }
   */
  getSummary: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.date_from) queryParams.append('date_from', params.date_from);
      if (params.date_to) queryParams.append('date_to', params.date_to);

      const url = `/reports/summary${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await apiClient.get(url);
      const normalized = normalizeResponse(response);

      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: null,
        };
      }

      return {
        success: true,
        data: normalized.data,
        message: normalized.message || 'Summary loaded successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: null,
      };
    }
  },

  /**
   * Get package-wise income and business counts
   * @param {Object} params - Optional filters (e.g., date_from, date_to)
   * @returns {Object} - { success, data, message }
   */
  getPackageIncome: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.date_from) queryParams.append('date_from', params.date_from);
      if (params.date_to) queryParams.append('date_to', params.date_to);

      const url = `/reports/package-income${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await apiClient.get(url);
      const normalized = normalizeResponse(response);

      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: [],
        };
      }

      return {
        success: true,
        data: normalized.data || [],
        message: normalized.message || 'Package income loaded successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: [],
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
