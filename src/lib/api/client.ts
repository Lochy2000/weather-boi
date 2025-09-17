import axios from 'axios';
import { API_CONFIG } from './config';
import { ApiError, ApiErrorType } from '../../types';

export const apiClient = axios.create({
  timeout: API_CONFIG.DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log('API Request:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      throw new ApiError(
        ApiErrorType.RATE_LIMIT,
        'Too many requests. Please try again later.',
        429
      );
    }
    
    if (!error.response) {
      throw new ApiError(
        ApiErrorType.NETWORK_ERROR,
        'Network error. Please check your connection.',
        0
      );
    }
    
    if (error.response.status >= 500) {
      throw new ApiError(
        ApiErrorType.SERVER_ERROR,
        'Server error. Please try again later.',
        error.response.status
      );
    }
    
    throw new ApiError(
      ApiErrorType.UNKNOWN_ERROR,
      error.message || 'An unexpected error occurred.',
      error.response?.status
    );
  }
);