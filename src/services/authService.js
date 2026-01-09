import apiClient from '../config/api';
import { extractErrorMessage, isSuccessResponse, normalizeResponse, getValidationErrors } from '../utils/apiResponseHandler';

const authService = {
  // Super Admin Login
  superAdminLogin: async (email, password) => {
    try {
      const response = await apiClient.post('/super-admin-login', { email, password });
      const normalized = normalizeResponse(response);
      
      if (!isSuccessResponse(response)) {
        return {
          success: false,
          message: extractErrorMessage(response),
          validationErrors: getValidationErrors(response)
        };
      }

      // Handle response format
      const tokenData = normalized.data || response.Data;
      if (tokenData && (tokenData.token || tokenData.access_token)) {
        const token = tokenData.token || tokenData.access_token;
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('flynet_user', JSON.stringify(tokenData));
        localStorage.setItem('user_role', 'super_admin'); // Store role for access control
        return {
          success: true,
          data: tokenData,
          message: normalized.message || 'Login successful'
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

  // Login (kept for backward compatibility, but should use superAdminLogin)
  login: async (email, password) => {
    // Redirect to super admin login for SAAS system
    return authService.superAdminLogin(email, password);
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
      localStorage.removeItem('user_role');
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

  // Check if user is super admin
  isSuperAdmin: () => {
    const role = localStorage.getItem('user_role');
    return role === 'super_admin';
  },

  // Get user role
  getUserRole: () => {
    return localStorage.getItem('user_role');
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
