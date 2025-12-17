import apiClient from '../config/api';
import { extractErrorMessage, isSuccessResponse, normalizeResponse } from '../utils/apiResponseHandler';

const cameraService = {
  /**
   * Get all cameras
   * @returns {Object} - { success, data: [...cameras], message }
   */
  getAll: async () => {
    try {
      const response = await apiClient.get('/cameras/map');
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
        message: normalized.status || 'Cameras loaded successfully'
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
   * Get camera by ID
   * @param {number} id - Camera ID
   * @returns {Object} - { success, data: {...camera}, message }
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/cameras/${id}`);
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
        message: normalized.message || 'Camera loaded successfully'
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

export default cameraService;
