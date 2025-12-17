import apiClient from '../config/api';
import { extractErrorMessage, isSuccessResponse, normalizeResponse } from '../utils/apiResponseHandler';

const dashboardService = {
  /**
   * Get dashboard statistics
   * @returns {Object} - { success, data: { total_businesses, pending_businesses, due_payments, profit }, message }
   */
  getStats: async () => {
    try {
      const response = await apiClient.get('/dashboard/stats');
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          data: {
            total_businesses: 0,
            pending_businesses: 0,
            due_payments: 0,
            profit: 0
          }
        };
      }

      return {
        success: true,
        data: normalized.data || {
          total_businesses: 0,
          pending_businesses: 0,
          due_payments: 0,
          profit: 0
        },
        message: normalized.message || 'Dashboard stats loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: {
          total_businesses: 0,
          pending_businesses: 0,
          due_payments: 0,
          profit: 0
        }
      };
    }
  },

  /**
   * Get dashboard summary (alternative endpoint if available)
   * @returns {Object} - { success, data, message }
   */
  getSummary: async () => {
    try {
      const response = await apiClient.get('/dashboard');
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
        message: normalized.message || 'Dashboard summary loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        data: null
      };
    }
  }
};

export default dashboardService;
