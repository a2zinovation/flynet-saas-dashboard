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

const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/login', { email, password });
      
      // Check if response is successful
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          validationErrors: typeof response.Message === 'object' ? response.Message : null
        };
      }

      // Check if token exists in response
      if (response.Data && response.Data.token) {
        // Store token and user data
        localStorage.setItem('jwt_token', response.Data.token);
        localStorage.setItem('flynet_user', JSON.stringify(response.Data));
        return {
          success: true,
          data: response.Data,
          message: response.Message || 'Login successful'
        };
      }
      
      return {
        success: false,
        message: 'Invalid response: token not found'
      };
    } catch (error) {
      return { 
        success: false, 
        message: extractErrorMessage(error),
        validationErrors: error.Message && typeof error.Message === 'object' ? error.Message : null
      };
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await apiClient.post('/refresh');
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      if (response.Data && response.Data.token) {
        localStorage.setItem('jwt_token', response.Data.token);
        return {
          success: true,
          message: 'Token refreshed successfully'
        };
      }
      
      return {
        success: false,
        message: 'Token refresh failed'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error)
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('flynet_user');
    }
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('flynet_user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Test API connection
  testConnection: async () => {
    try {
      const response = await apiClient.get('/hello-world');
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        data: response,
        message: 'Connection successful'
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error)
      };
    }
  },
};

export default authService;
