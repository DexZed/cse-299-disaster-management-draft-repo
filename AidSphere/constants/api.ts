/**
 * api.ts
 * ------
 * Central API configuration and utility functions for all Redux async thunks.
 * This file contains the API base URL, default headers, and helper functions
 * for making authenticated API calls throughout the application.
 */

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'https://cse-299-disaster-management-draft-r.vercel.app/api/v1';

/**
 * Get auth headers with optional token from localStorage
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Get auth headers for FormData requests (no Content-Type)
 */
export const getAuthHeadersFormData = () => {
  const token = localStorage.getItem('authToken');
  return {
    Accept: 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Generic fetch wrapper with error handling
 */
export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {},
  includeAuth: boolean = true
) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = includeAuth
    ? {
        ...getAuthHeaders(),
        ...options.headers,
      }
    : options.headers;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    return response;
  } catch (error) {
    console.error(`API Error at ${url}:`, error);
    throw error;
  }
};

/**
 * Make an authenticated GET request
 */
export const apiGet = async <T>(endpoint: string): Promise<T> => {
  const response = await apiFetch(endpoint, { method: 'GET' });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Make an authenticated POST request
 */
export const apiPost = async <T>(endpoint: string, data: any): Promise<T> => {
  const response = await apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Make an authenticated PATCH request
 */
export const apiPatch = async <T>(endpoint: string, data: any): Promise<T> => {
  const response = await apiFetch(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Make an authenticated DELETE request
 */
export const apiDelete = async <T>(endpoint: string): Promise<T> => {
  const response = await apiFetch(endpoint, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Make an authenticated POST request with FormData (for file uploads)
 */
export const apiPostFormData = async <T>(endpoint: string, formData: FormData): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getAuthHeadersFormData();

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Set auth token in localStorage
 */
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

/**
 * Get auth token from localStorage
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Remove auth token from localStorage
 */
export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};
