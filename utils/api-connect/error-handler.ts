/**
 * Error Handler untuk API
 * Auto-trigger toast ketika ada error dari API
 */

import type { ApiError } from './types';

/**
 * Extract error key dari message API
 * Elysia mengembalikan "error.xxx", kita extract "xxx" nya
 */
export const extractErrorKey = (message: string): string => {
  if (message.startsWith('error.')) {
    return message.replace('error.', '');
  }
  return message;
};

/**
 * Get translated error message
 */
export const getErrorMessage = async (errorKey: string, lang: 'en' | 'id' = 'en'): Promise<string> => {
  try {
    const locale = await import(`@/app/locales/${lang}.json`);
    const errorMessages = locale.default?.error || {};
    return errorMessages[errorKey] || errorKey;
  } catch {
    return errorKey;
  }
};

/**
 * Handle API error dan trigger toast
 * Call ini dari component yang memiliki access ke useToastContext
 */
export const handleApiError = async (
  error: ApiError,
  toast: { error: (message: string, options?: any) => void },
  t: (key: string) => string
) => {
  const errorKey = extractErrorKey(error.message);
  
  // Try to get translated message
  let errorMessage = error.message;
  try {
    // Check if error key exists in translation
    const translatedKey = `error.${errorKey}`;
    const translated = t(translatedKey);
    if (translated && translated !== translatedKey) {
      errorMessage = translated;
    } else {
      // Fallback to direct error message
      errorMessage = error.message.replace('error.', '');
    }
  } catch {
    errorMessage = error.message;
  }

  // Determine description based on error type
  let description = '';
  if (error.status === 401) {
    description = t('error.unauthorized') || 'Please login again';
  } else if (error.status === 400) {
    description = t('error.bad_request') || 'Please check your input';
  } else if (error.status === 404) {
    description = t('error.user_not_found') || 'Resource not found';
  } else if (error.status >= 500) {
    description = t('error.internal_error') || 'Server error. Please try again later';
  }

  toast.error(errorMessage, {
    description,
    expandable: true,
    duration: 8,
  });
};

