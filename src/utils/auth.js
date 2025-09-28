import axios from 'axios';

// Configure axios defaults for API requests
const API_BASE_URL = 'http://localhost:3000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token in headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      // Handle different token formats
      if (token.startsWith('Bearer ')) {
        config.headers.Authorization = token;
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, remove it from storage
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_name');
      // Optionally redirect to signin page
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Utility functions for token management
export const getStoredToken = () => {
  return localStorage.getItem('jwt_token');
};

export const setStoredToken = (token) => {
  localStorage.setItem('jwt_token', token);
};

export const removeStoredToken = () => {
  localStorage.removeItem('jwt_token');
};

export const getStoredRole = () => {
  return localStorage.getItem('user_role');
};

export const setStoredRole = (role) => {
  localStorage.setItem('user_role', role);
};

export const removeStoredRole = () => {
  localStorage.removeItem('user_role');
};

export const isAuthenticated = () => {
  return !!getStoredToken();
};

export const getUserRole = () => {
  return getStoredRole();
};

export default apiClient;
