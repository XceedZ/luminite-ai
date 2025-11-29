/**
 * API Endpoints Constants
 * Semua endpoint API didefinisikan di sini untuk kemudahan maintenance
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Supabase credentials (for frontend if needed)
export const SUPABASE_CONFIG = {
  URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
};

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE}/login`,
    REGISTER: `${API_BASE}/register`,
    LOGOUT: `${API_BASE}/logout`,
    REFRESH: `${API_BASE}/refresh`,
    ME: `${API_BASE}/profile`,
  },

  // Chat endpoints
  CHAT: {
    SESSIONS: `${API_BASE}/chat/sessions`,
    SESSION: (id: string) => `${API_BASE}/chat/sessions/${id}`,
    HISTORY: (id: string) => `${API_BASE}/chat/sessions/${id}/history`,
    MESSAGES: (id: string) => `${API_BASE}/chat/sessions/${id}/messages`,
    RENAME: (id: string) => `${API_BASE}/chat/sessions/${id}/rename`,
    DELETE: (id: string) => `${API_BASE}/chat/sessions/${id}`,
  },

  // AI endpoints
  AI: {
    GENERATE: `${API_BASE}/ai/generate`,
    CLASSIFY: `${API_BASE}/ai/classify`,
    CHART: `${API_BASE}/ai/chart`,
    TABLE: `${API_BASE}/ai/table`,
    CODE: `${API_BASE}/ai/code`,
  },

  // Tasks endpoints
  TASKS: {
    LIST: `${API_BASE}/tasks`,
    CREATE: `${API_BASE}/tasks`,
    GET: (id: string) => `${API_BASE}/tasks/${id}`,
    UPDATE: (id: string) => `${API_BASE}/tasks/${id}`,
    DELETE: (id: string) => `${API_BASE}/tasks/${id}`,
    COMPLETE: (id: string) => `${API_BASE}/tasks/${id}/complete`,
  },

  // User endpoints
  USER: {
    PROFILE: `${API_BASE}/user/profile`,
    SETTINGS: `${API_BASE}/user/settings`,
    AVATAR: `${API_BASE}/user/avatar`,
  },

  // Storage endpoints (Upstash/Redis)
  STORAGE: {
    GET: (key: string) => `${API_BASE}/storage/${key}`,
    SET: (key: string) => `${API_BASE}/storage/${key}`,
    DELETE: (key: string) => `${API_BASE}/storage/${key}`,
  },
} as const;

/**
 * Helper function untuk membuat endpoint dengan query params
 */
export const buildEndpoint = (
  baseUrl: string,
  params?: Record<string, any>
): string => {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  return `${baseUrl}?${searchParams.toString()}`;
};
