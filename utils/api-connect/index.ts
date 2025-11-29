/**
 * API Utilities - Main Export
 * 
 * Usage:
 * ```ts
 * import { api, API_ENDPOINTS } from '@/utils/api-connect';
 * 
 * // GET request
 * const response = await api.get(API_ENDPOINTS.CHAT.SESSIONS);
 * 
 * // POST request
 * const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
 * 
 * // With params
 * const response = await api.get(API_ENDPOINTS.CHAT.SESSIONS, { params: { page: 1 } });
 * ```
 */

export { api, ApiClient } from './client';
export { API_ENDPOINTS, buildEndpoint } from './endpoints';
export type { ApiResponse, ApiError, RequestConfig, HttpMethod } from './types';
