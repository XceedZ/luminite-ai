/**
 * Types untuk API responses dan requests
 */

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
  responseStatus?: string; // Status from API (ERROR, BAD_REQUEST, etc.)
}

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  signal?: AbortSignal;
  timeout?: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

