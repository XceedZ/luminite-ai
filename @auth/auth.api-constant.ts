/**
 * Auth API Constants
 * Semua endpoint dan constants untuk authentication
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const AUTH_ENDPOINTS = {
  LOGIN: `/api/v1/login`,
  REGISTER: `/api/v1/register`,
  LOGOUT: `/api/v1/logout`,
  REFRESH: `/api/v1/refresh`,
  PROFILE: `/api/v1/profile`,
  ME: `/api/v1/profile`,
} as const;

/**
 * Auth request/response types
 */
export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  fullname: string;
  email: string;
  password: string;
  tenant_id?: number;
}

export interface AuthResponse {
  status: string;
  message: string;
  data?: {
    token?: string;
    user?: {
      user_id: number;
      username: string;
      fullname: string;
      email: string;
    };
  };
}

export interface User {
  user_id: number;
  username: string;
  fullname: string;
  email: string;
}
