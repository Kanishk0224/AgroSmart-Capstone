import { auth } from '../firebase';
import { ApiResponse } from '../types';

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const BACKEND_BASE_URL =
  (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:8080/api/v1';

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { params, headers = {}, ...customConfig } = options;

  let url = endpoint.startsWith('http') ? endpoint : `${BACKEND_BASE_URL}${endpoint}`;

  if (params) {
    const query = Object.entries(params)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    if (query) {
      url += (url.includes('?') ? '&' : '?') + query;
    }
  }

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  // Attach Firebase ID Token if user is logged in
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      reqHeaders['Authorization'] = `Bearer ${token}`;
    } catch (err) {
      console.warn('Unable to get Firebase ID token for request:', err);
    }
  }

  const response = await fetch(url, {
    ...customConfig,
    headers: reqHeaders,
  });

  if (!response.ok) {
    let errorData: any = null;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }
    const message =
      errorData?.message ||
      `Request failed with status ${response.status} (${response.statusText})`;
    throw new ApiError(message, response.status, errorData);
  }

  // Check empty responses
  if (response.status === 204) {
    return null as any;
  }

  return response.json();
}

export const apiClient = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint.startsWith('/') ? endpoint : `/${endpoint}`, { method: 'GET', ...options }),
  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint.startsWith('/') ? endpoint : `/${endpoint}`, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),
  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint.startsWith('/') ? endpoint : `/${endpoint}`, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),
  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint.startsWith('/') ? endpoint : `/${endpoint}`, { method: 'DELETE', ...options }),
};

