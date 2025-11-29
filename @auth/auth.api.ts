/**
 * Auth API Functions
 * Wrapper functions untuk auth API calls
 */

import { api } from '@/utils/api-connect/client';
import { AUTH_ENDPOINTS, type LoginRequest, type RegisterRequest, type AuthResponse, type User } from './auth.api-constant';
import { useAuthStore } from '@/app/auth/store/auth.store';

/**
 * Login user
 */
export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<any>(AUTH_ENDPOINTS.LOGIN, {
    emailOrUsername: data.emailOrUsername,
    password: data.password,
  });

  if (response.success && response.data) {
    const authData = response.data;
    // Backend returns { token, user } directly, not nested in data.data
    const { login } = useAuthStore.getState();
    
    // Check both possible structures: { token, user } or { data: { token, user } }
    const token = authData.token || authData.data?.token;
    const user = authData.user || authData.data?.user;
    
    if (token && user) {
      login(user, token);
      
      // Prepare userData for response
      const userData = {
        user_id: user.user_id || 0,
        fullName: user.fullname || user.fullName || '',
        username: user.username || '',
        email: user.email || '',
      };
      
      // User data is already saved in Zustand persist (authStorage)
      console.log('User logged in, data saved to authStorage:', userData);
      
      // Return formatted response with userData
      return {
        status: 'OK',
        message: 'Login successful',
        data: { 
          token, 
          user,
          userData // Include userData in response (user_id, fullName, username, email)
        }
      } as AuthResponse;
    }
    
    // If structure is different, try to return as-is
    return authData as AuthResponse;
  }

  throw new Error(response.error || response.data?.message || 'Login failed');
};

/**
 * Register user
 */
export const registerUser = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<any>(AUTH_ENDPOINTS.REGISTER, {
    username: data.username,
    fullname: data.fullname,
    email: data.email,
    password: data.password,
    tenant_id: data.tenant_id,
  });

  if (response.success && response.data) {
    const authData = response.data;
    // Auto login after registration if token is provided
    // Note: Register might not return token, only user data
    const { login, setUser } = useAuthStore.getState();
    if (authData.data?.token && authData.data?.user) {
      login(authData.data.user, authData.data.token);
    } else if (authData.data?.user) {
      // If no token, just set user (user needs to login separately)
      setUser(authData.data.user);
    }
    return authData as AuthResponse;
  }

  throw new Error(response.error || response.data?.message || 'Registration failed');
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await api.post(AUTH_ENDPOINTS.LOGOUT);
  } catch (error) {
    // Ignore logout errors
    console.error('Logout error:', error);
  } finally {
    // Always clear local state
    const { logout } = useAuthStore.getState();
    logout();
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get<{ user: User }>(AUTH_ENDPOINTS.ME);
    if (response.success && response.data) {
      const { setUser } = useAuthStore.getState();
      setUser(response.data.user);
      return response.data.user;
    }
    return null;
  } catch (error) {
    console.error('Get current user error:', error);
    // Clear auth state on error
    const { logout } = useAuthStore.getState();
    logout();
    return null;
  }
};

// Re-export types and constants
export type { User, LoginRequest, RegisterRequest, AuthResponse } from './auth.api-constant';
export { AUTH_ENDPOINTS } from './auth.api-constant';
