/**
 * API Client dengan Auto Toast
 * Wrapper untuk api client yang otomatis menampilkan toast pada error
 */

import { api, type ApiResponse, type RequestConfig } from './client';
import type { HttpMethod } from './types';

// Dynamic import untuk toast (client-side only)
let toastContext: any = null;

const getToastContext = async () => {
  if (typeof window === 'undefined') return null;
  
  if (!toastContext) {
    try {
      const module = await import('@/components/ui/toast-provider');
      toastContext = module.useToastContext;
    } catch (error) {
      console.warn('Toast context not available:', error);
    }
  }
  
  return toastContext;
};

const getTranslation = async (key: string): Promise<string> => {
  if (typeof window === 'undefined') return key;
  
  try {
    const { useLanguage } = await import('@/components/language-provider');
    // Note: This won't work directly, need to use hook in component
    // For now, return key and let component handle translation
    return key;
  } catch (error) {
    return key;
  }
};

/**
 * Extract error key from message (remove "error." prefix if exists)
 */
const extractErrorKey = (message: string): string => {
  if (message.startsWith('error.')) {
    return message.replace('error.', '');
  }
  return message;
};

/**
 * Show error toast automatically
 */
const showErrorToast = async (error: any) => {
  if (typeof window === 'undefined') return;
  
  try {
    const ToastContext = await getToastContext();
    if (!ToastContext) return;
    
    // Get toast function (need to be called in component context)
    // For now, we'll use a global toast handler
    const { useToastContext } = await import('@/components/ui/toast-provider');
    
    // This needs to be called from component, so we'll use a different approach
    // Store error in a way that can be accessed by components
    window.dispatchEvent(new CustomEvent('api-error', {
      detail: {
        message: error.message,
        status: error.status,
        errorKey: extractErrorKey(error.message),
      }
    }));
  } catch (err) {
    console.error('Failed to show error toast:', err);
  }
};

/**
 * Wrapper untuk API methods dengan auto toast
 */
export const apiWithToast = {
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      return await api.get<T>(endpoint, config);
    } catch (error: any) {
      await showErrorToast(error);
      throw error;
    }
  },

  async post<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      return await api.post<T>(endpoint, body, config);
    } catch (error: any) {
      await showErrorToast(error);
      throw error;
    }
  },

  async put<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      return await api.put<T>(endpoint, body, config);
    } catch (error: any) {
      await showErrorToast(error);
      throw error;
    }
  },

  async patch<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      return await api.patch<T>(endpoint, body, config);
    } catch (error: any) {
      await showErrorToast(error);
      throw error;
    }
  },

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      return await api.delete<T>(endpoint, config);
    } catch (error: any) {
      await showErrorToast(error);
      throw error;
    }
  },
};

