/**
 * Base API Client
 * Utility untuk koneksi ke API dengan mudah
 */

import type { ApiResponse, ApiError, RequestConfig, HttpMethod } from './types';

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL?: string) {
    // Use empty string for relative paths (proxy will handle routing)
    // Or use full URL if provided (for external APIs)
    this.baseURL = baseURL || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Set default headers untuk semua requests
   */
  setDefaultHeaders(headers: Record<string, string>) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Get auth token dari storage (localStorage/cookies)
   * Priority: authToken (new) > auth_token (old) > authStorage (Zustand)
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    // Try new camelCase key first
    const token = localStorage.getItem('authToken');
    if (token) return token;
    
    // Try old key for backward compatibility
    const oldToken = localStorage.getItem('auth_token');
    if (oldToken) return oldToken;
    
    // Try to get from Zustand persist storage
    try {
      const authStorage = localStorage.getItem('authStorage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        if (parsed?.state?.token) {
          return parsed.state.token;
        }
      }
    } catch {
      // Ignore parse errors
    }
    
    return null;
  }

  /**
   * Build full URL dengan base URL
   */
  private buildURL(endpoint: string): string {
    // If endpoint is already a full URL, use it directly
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    // If baseURL is empty, use relative path (proxy will handle it)
    if (!this.baseURL) {
      return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    }
    // Otherwise, combine baseURL with endpoint
    return `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }

  /**
   * Build headers dengan auth token
   */
  private buildHeaders(customHeaders?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...customHeaders,
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle response dan parse JSON
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: any;
    if (isJson) {
      data = await response.json().catch(() => ({}));
    } else {
      data = await response.text().catch(() => '');
    }

    // Check if response has status field (Elysia format)
    const responseStatus = data.status || (response.ok ? 'OK' : 'ERROR');
    const isError = !response.ok || (responseStatus !== 'OK' && responseStatus !== undefined);

    const apiResponse: ApiResponse<T> = {
      data: isJson ? data.data || data : undefined,
      status: response.status,
      success: !isError,
      message: data.message || data.error || (response.ok ? 'Success' : 'Error'),
      error: isError ? (data.message || data.error || response.statusText) : undefined,
    };

    if (isError) {
      const error: ApiError = {
        message: apiResponse.error || 'An error occurred',
        status: response.status,
        errors: data.errors,
        responseStatus: responseStatus, // Store original status from API
      };
      throw error;
    }

    return apiResponse;
  }

  /**
   * Core request method
   */
  private async request<T>(
    endpoint: string,
    method: HttpMethod = 'GET',
    body?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint);
    const headers = this.buildHeaders(config?.headers);

    // Build URL with query params if provided
    let finalUrl = url;
    if (config?.params && method === 'GET') {
      const searchParams = new URLSearchParams();
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      finalUrl = `${url}?${searchParams.toString()}`;
    }

    const requestOptions: RequestInit = {
      method,
      headers,
      signal: config?.signal,
    };

    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }

    // Timeout handling
    if (config?.timeout) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);
      requestOptions.signal = controller.signal;

      try {
        const response = await fetch(finalUrl, requestOptions);
        clearTimeout(timeoutId);
        return this.handleResponse<T>(response);
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
          throw { message: 'Request timeout', status: 408 } as ApiError;
        }
        throw error;
      }
    }

    try {
      const response = await fetch(finalUrl, requestOptions);
      return this.handleResponse<T>(response);
    } catch (fetchError: any) {
      // Handle network errors (connection refused, timeout, etc.)
      if (fetchError.name === 'TypeError' || fetchError.message?.includes('Failed to fetch') || fetchError.message?.includes('ERR_CONNECTION_REFUSED') || fetchError.message?.includes('ERR_EMPTY_RESPONSE')) {
        const connectionError: ApiError = {
          message: 'Connection failed. Please check your connection and ensure the backend server is running.',
          status: 0,
          responseStatus: 'CONNECTION_ERROR',
        };
        throw connectionError;
      }
      throw fetchError;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'GET', undefined, config);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'POST', body, config);
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PUT', body, config);
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PATCH', body, config);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'DELETE', undefined, config);
  }
}

// Export singleton instance
export const api = new ApiClient();

// Export class untuk custom instances jika diperlukan
export { ApiClient };
