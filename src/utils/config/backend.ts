// Backend Configuration Utility
// Centralized configuration for backend API settings

export interface BackendConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

export const getBackendConfig = (): BackendConfig => {
  return {
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
    retryAttempts: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || '2'),
  };
};

// Helper functions for common backend operations
export const isBackendAvailable = (): boolean => {
  return !!process.env.NEXT_PUBLIC_BACKEND_URL;
};

export const getBackendUrl = (endpoint: string = ''): string => {
  const config = getBackendConfig();
  return `${config.baseUrl}${endpoint}`;
}; 