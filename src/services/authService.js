import apiClient from '../config/api';
import { extractErrorMessage, isSuccessResponse, normalizeResponse, getValidationErrors } from '../utils/apiResponseHandler';

const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/login', { email, password });
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          validationErrors: getValidationErrors(response)
        };
      }

      // Handle both old (data.Data.token) and new (data.data.token/access_token) response formats
      const tokenData = normalized.data || response.Data;
      if (tokenData && (tokenData.token || tokenData.access_token)) {
        const token = tokenData.token || tokenData.access_token;
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('flynet_user', JSON.stringify(tokenData));
        return {
          success: true,
          data: tokenData,
          message: normalized.message
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
        validationErrors: getValidationErrors(error)
      };
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await apiClient.post('/refresh');
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      const tokenData = normalized.data || response.Data;
      if (tokenData && (tokenData.token || tokenData.access_token)) {
        const token = tokenData.token || tokenData.access_token;
        localStorage.setItem('jwt_token', token);
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
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response)
        };
      }

      return {
        success: true,
        data: normalized.data,
        message: normalized.message
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error)
      };
    }
  },

  // Update profile information
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.post('/profile/update', profileData);
      const normalized = normalizeResponse(response);

      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          validationErrors: getValidationErrors(response)
        };
      }

      const userData = normalized.data || response.Data;
      const currentUser = authService.getCurrentUser();
      const mergedUser = currentUser ? { ...currentUser, ...userData } : userData;

      if (mergedUser) {
        localStorage.setItem('flynet_user', JSON.stringify(mergedUser));
      }

      return {
        success: true,
        data: mergedUser,
        message: normalized.message
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        validationErrors: getValidationErrors(error)
      };
    }
  },

  // Update profile picture
  updateProfilePicture: async (formData) => {
    try {
      const response = await apiClient.post('/profile/update-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const normalized = normalizeResponse(response);

      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          validationErrors: getValidationErrors(response)
        };
      }

      const userData = normalized.data || response.Data;
      const currentUser = authService.getCurrentUser();
      const mergedUser = currentUser ? { ...currentUser, ...userData } : userData;

      // Prefer full URL for display while keeping returned fields
      if (userData?.profile_picture_url) {
        mergedUser.profile_picture = userData.profile_picture;
        mergedUser.profile_picture_url = userData.profile_picture_url;
      }

      if (mergedUser) {
        localStorage.setItem('flynet_user', JSON.stringify(mergedUser));
      }

      return {
        success: true,
        data: mergedUser,
        message: normalized.message
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        validationErrors: getValidationErrors(error)
      };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    try {
      const response = await apiClient.post('/profile/change-password', {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword
      });
      const normalized = normalizeResponse(response);

      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          validationErrors: getValidationErrors(response)
        };
      }

      return {
        success: true,
        message: normalized.message
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error),
        validationErrors: getValidationErrors(error)
      };
    }
  },
};

export default authService;
