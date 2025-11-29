/**
 * Local Storage Utilities
 * Helper functions untuk mengelola data di browser localStorage dengan type safety
 */

/**
 * Check if localStorage is available (client-side only)
 */
const isLocalStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get item from localStorage
 * @param key - Storage key
 * @returns Stored value or null if not found
 */
export const getLocalStorage = <T = string>(key: string): T | null => {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    
    // Try to parse as JSON, fallback to string
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as T;
    }
  } catch (error) {
    console.error(`Error getting localStorage item "${key}":`, error);
    return null;
  }
};

/**
 * Set item to localStorage
 * @param key - Storage key
 * @param value - Value to store (will be stringified if not a string)
 */
export const setLocalStorage = <T = string>(key: string, value: T): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
    return true;
  } catch (error) {
    console.error(`Error setting localStorage item "${key}":`, error);
    return false;
  }
};

/**
 * Remove item from localStorage
 * @param key - Storage key
 */
export const removeLocalStorage = (key: string): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage item "${key}":`, error);
    return false;
  }
};

/**
 * Clear all items from localStorage
 */
export const clearLocalStorage = (): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Get all keys from localStorage
 * @returns Array of keys
 */
export const getAllLocalStorageKeys = (): string[] => {
  if (!isLocalStorageAvailable()) return [];
  
  try {
    return Object.keys(localStorage);
  } catch (error) {
    console.error('Error getting localStorage keys:', error);
    return [];
  }
};

/**
 * Check if key exists in localStorage
 * @param key - Storage key
 * @returns True if key exists
 */
export const hasLocalStorage = (key: string): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
};

// ============================================
// Auth-specific helpers
// ============================================
// Note: Auth data is stored in Zustand persist with key 'authStorage'
// These helpers are for backward compatibility and direct access if needed

const AUTH_TOKEN_KEY = 'authToken';
const AUTH_USER_KEY = 'authUser';

/**
 * Get JWT token from localStorage
 */
export const getJwtToken = (): string | null => {
  return getLocalStorage<string>(AUTH_TOKEN_KEY);
};

/**
 * Set JWT token to localStorage
 */
export const setJwtToken = (token: string): boolean => {
  return setLocalStorage(AUTH_TOKEN_KEY, token);
};

/**
 * Remove JWT token from localStorage
 */
export const removeJwtToken = (): boolean => {
  return removeLocalStorage(AUTH_TOKEN_KEY);
};

/**
 * Get auth user from localStorage
 */
export const getAuthUser = <T = any>(): T | null => {
  return getLocalStorage<T>(AUTH_USER_KEY);
};

/**
 * Set auth user to localStorage
 */
export const setAuthUser = <T = any>(user: T): boolean => {
  return setLocalStorage(AUTH_USER_KEY, user);
};

/**
 * Remove auth user from localStorage
 */
export const removeAuthUser = (): boolean => {
  return removeLocalStorage(AUTH_USER_KEY);
};

/**
 * Clear all auth data from localStorage
 */
export const clearAuthData = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Remove all auth-related keys (camelCase)
  removeLocalStorage('authToken');
  removeLocalStorage('authUser');
  removeLocalStorage('authStorage'); // Zustand persist key
  
  // Remove old keys for backward compatibility
  removeLocalStorage('auth_token');
  removeLocalStorage('auth_user');
  removeLocalStorage('auth-storage');
  removeLocalStorage('jwtToken');
  
  return true;
};

/**
 * Check if user is authenticated (has token)
 */
export const isAuthenticated = (): boolean => {
  return hasLocalStorage(AUTH_TOKEN_KEY) && getJwtToken() !== null;
};

