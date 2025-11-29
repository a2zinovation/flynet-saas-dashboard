import axios from 'axios';

// Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.pinkdreams.store/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Return the Data object from standard response format
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Handle 401 - unauthorized (token expired/invalid)
      if (error.response.status === 401) {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('flynet_user');
        window.location.href = '/login';
      }
      
      // Return error message from backend
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
