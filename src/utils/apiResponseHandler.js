/**
 * API Response Handler Utility
 * Handles standardized API responses with lowercase keys:
 * { status, message, data, code }
 */

/**
 * Extract error message from various response formats
 * @param {Object|String} error - Error object or string
 * @returns {String} - Formatted error message
 */
export const extractErrorMessage = (error) => {
  // If error is a string, return it directly
  if (typeof error === 'string') {
    return error;
  }

  // New format: errors object with field names as keys
  if (error?.errors && typeof error.errors === 'object') {
    const validationErrors = Object.entries(error.errors)
      .map(([field, messages]) => {
        const fieldMessages = Array.isArray(messages) ? messages.join(', ') : messages;
        return fieldMessages;
      })
      .join('; ');
    return validationErrors || 'Validation failed';
  }

  // Old format: Message field as object (validation errors)
  if (error?.Message && typeof error.Message === 'object') {
    const validationErrors = Object.values(error.Message)
      .flat()
      .join(', ');
    return validationErrors || 'Validation failed';
  }

  // New format: message field (lowercase)
  if (error?.message && typeof error.message === 'string') {
    return error.message;
  }

  // Old format: Message field (uppercase)
  if (error?.Message && typeof error.Message === 'string') {
    return error.Message;
  }

  // Default fallback
  return 'An unexpected error occurred';
};

/**
 * Check if response indicates success
 * @param {Object} response - API response
 * @returns {Boolean} - True if successful
 */
export const isSuccessResponse = (response) => {
  // New format: status field with numeric code (200-299)
  if (response?.status && typeof response.status === 'number') {
    return response.status >= 200 && response.status < 300;
  }

  // Old format: Success field (boolean)
  if (response?.hasOwnProperty('Success')) {
    return response.Success === true;
  }

  // Old format: Status field (numeric)
  if (response?.hasOwnProperty('Status')) {
    return response.Status >= 200 && response.Status < 300;
  }

  // Fallback: assume success if no error indicators
  return true;
};

/**
 * Normalize API response to standard format
 * Handles both old (Success, Message, Data, Status) and new (status, message, data, code) formats
 * @param {Object} response - Raw API response
 * @returns {Object} - Normalized response { status, message, data, code }
 */
export const normalizeResponse = (response) => {
  // New format
  if (response?.status !== undefined) {
    return {
      status: response.status,
      message: response.message || 'Success',
      data: response.data || null,
      code: response.code || response.status,
    };
  }

  // Old format
  if (response?.hasOwnProperty('Success') || response?.hasOwnProperty('Message')) {
    return {
      status: response.Status || 200,
      message: response.Message || 'Success',
      data: response.Data || null,
      code: response.Status || 200,
    };
  }

  // Fallback
  return {
    status: 200,
    message: 'Success',
    data: response,
    code: 200,
  };
};

/**
 * Get validation errors as object
 * @param {Object} response - API error response
 * @returns {Object|null} - Validation errors object or null
 */
export const getValidationErrors = (response) => {
  // New format: errors field
  if (response?.errors && typeof response.errors === 'object') {
    return response.errors;
  }

  // Old format: Message field as object
  if (response?.Message && typeof response.Message === 'object') {
    return response.Message;
  }

  return null;
};

/**
 * Format API response for service consumers
 * @param {Object} response - API response
 * @param {Object} defaults - Default return object
 * @returns {Object} - Formatted response
 */
export const formatResponse = (response, defaults = {}) => {
  const normalized = normalizeResponse(response);
  const isSuccess = isSuccessResponse(response);

  return {
    success: isSuccess,
    status: normalized.status,
    message: normalized.message,
    data: normalized.data,
    code: normalized.code,
    validationErrors: !isSuccess ? getValidationErrors(response) : null,
    ...defaults,
  };
};
