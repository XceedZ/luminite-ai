# API Connect Utility

Utility untuk koneksi ke API dengan mudah. Semua endpoint dan method tersedia di satu tempat.

## Lokasi

```
utils/api-connect/
├── index.ts        # Main export
├── client.ts       # Base API client
├── endpoints.ts    # API endpoints constants
├── types.ts        # TypeScript types
└── README.md       # Quick reference
```

## Quick Start

### Import

```typescript
import { api, API_ENDPOINTS } from '@/utils/api-connect';
```

### Basic Usage

```typescript
// GET request
const response = await api.get(API_ENDPOINTS.CHAT.SESSIONS);

// POST request
const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
  email: 'user@example.com',
  password: 'password123'
});
```

## API Reference

### Methods

#### GET
```typescript
api.get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>>
```

#### POST
```typescript
api.post<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>>
```

#### PUT
```typescript
api.put<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>>
```

#### PATCH
```typescript
api.patch<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>>
```

#### DELETE
```typescript
api.delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>>
```

## Request Config

```typescript
interface RequestConfig {
  headers?: Record<string, string>;  // Custom headers
  params?: Record<string, any>;      // Query params (GET only)
  signal?: AbortSignal;              // Cancel request
  timeout?: number;                   // Timeout in ms
}
```

## Response Format

```typescript
interface ApiResponse<T> {
  data?: T;           // Response data
  message?: string;   // Success/error message
  error?: string;     // Error message (if any)
  status: number;     // HTTP status code
  success: boolean;   // true if success
}
```

## Endpoints

### Auth
```typescript
API_ENDPOINTS.AUTH.LOGIN
API_ENDPOINTS.AUTH.REGISTER
API_ENDPOINTS.AUTH.LOGOUT
API_ENDPOINTS.AUTH.REFRESH
API_ENDPOINTS.AUTH.ME
```

### Chat
```typescript
API_ENDPOINTS.CHAT.SESSIONS
API_ENDPOINTS.CHAT.SESSION(id)
API_ENDPOINTS.CHAT.HISTORY(id)
API_ENDPOINTS.CHAT.MESSAGES(id)
API_ENDPOINTS.CHAT.RENAME(id)
API_ENDPOINTS.CHAT.DELETE(id)
```

### AI
```typescript
API_ENDPOINTS.AI.GENERATE
API_ENDPOINTS.AI.CLASSIFY
API_ENDPOINTS.AI.CHART
API_ENDPOINTS.AI.TABLE
API_ENDPOINTS.AI.CODE
```

### Tasks
```typescript
API_ENDPOINTS.TASKS.LIST
API_ENDPOINTS.TASKS.CREATE
API_ENDPOINTS.TASKS.GET(id)
API_ENDPOINTS.TASKS.UPDATE(id)
API_ENDPOINTS.TASKS.DELETE(id)
API_ENDPOINTS.TASKS.COMPLETE(id)
```

### User
```typescript
API_ENDPOINTS.USER.PROFILE
API_ENDPOINTS.USER.SETTINGS
API_ENDPOINTS.USER.AVATAR
```

### Storage
```typescript
API_ENDPOINTS.STORAGE.GET(key)
API_ENDPOINTS.STORAGE.SET(key)
API_ENDPOINTS.STORAGE.DELETE(key)
```

## Contoh Penggunaan

### GET dengan Query Params

```typescript
const response = await api.get(API_ENDPOINTS.CHAT.SESSIONS, {
  params: { page: 1, limit: 10 }
});
```

### POST dengan Body

```typescript
const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
  email: 'user@example.com',
  password: 'password123'
});
```

### PUT Request

```typescript
const response = await api.put(API_ENDPOINTS.TASKS.UPDATE(taskId), {
  title: 'Updated Task',
  completed: true
});
```

### DELETE Request

```typescript
const response = await api.delete(API_ENDPOINTS.TASKS.DELETE(taskId));
```

### Error Handling

```typescript
try {
  const response = await api.get(API_ENDPOINTS.CHAT.SESSIONS);
  console.log(response.data);
} catch (error) {
  if (error.status === 401) {
    // Unauthorized
    router.push('/auth');
  } else if (error.status === 404) {
    // Not found
    console.error('Resource not found');
  } else {
    console.error('API Error:', error.message);
  }
}
```

### Timeout

```typescript
const response = await api.get(API_ENDPOINTS.CHAT.SESSIONS, {
  timeout: 5000 // 5 seconds
});
```

### Cancel Request

```typescript
const controller = new AbortController();

api.get(API_ENDPOINTS.CHAT.SESSIONS, {
  signal: controller.signal
});

// Cancel request
controller.abort();
```

### Custom Headers

```typescript
const response = await api.get(API_ENDPOINTS.USER.PROFILE, {
  headers: {
    'X-Custom-Header': 'value'
  }
});
```

## Penggunaan di Store (Zustand)

```typescript
import { api, API_ENDPOINTS } from '@/utils/api-connect';

// Di store action
fetchChatSessions: async () => {
  try {
    const response = await api.get(API_ENDPOINTS.CHAT.SESSIONS);
    set({ chatSessions: response.data });
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    throw error;
  }
},

createTask: async (taskData) => {
  try {
    const response = await api.post(API_ENDPOINTS.TASKS.CREATE, taskData);
    return response.data;
  } catch (error) {
    throw error;
  }
},
```

## Authentication

Token otomatis diambil dari `localStorage.getItem('auth_token')` dan ditambahkan ke header sebagai `Authorization: Bearer <token>`.

### Set Token

```typescript
localStorage.setItem('auth_token', 'your-token-here');
```

### Set Default Headers

```typescript
import { api } from '@/utils/api-connect';

api.setDefaultHeaders({
  'X-Custom-Header': 'value'
});
```

## Custom Base URL

Default base URL diambil dari `process.env.NEXT_PUBLIC_API_URL` atau `http://localhost:3000/api`.

### Custom Instance

```typescript
import { ApiClient } from '@/utils/api-connect';

const customApi = new ApiClient('https://api.example.com');
```

## Environment Variables

Tambahkan ke `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Best Practices

1. **Gunakan API_ENDPOINTS constants**: Jangan hardcode URLs
2. **Handle errors dengan try-catch**: Selalu wrap API calls
3. **Gunakan TypeScript types**: Type safety untuk responses
4. **Set timeout untuk long requests**: Prevent hanging requests
5. **Use AbortSignal untuk cancellable requests**: Better UX

## Troubleshooting

### CORS Error
- Pastikan backend sudah configure CORS
- Check `NEXT_PUBLIC_API_URL` environment variable

### 401 Unauthorized
- Check token di localStorage
- Verify token masih valid
- Redirect ke login page

### Network Error
- Check internet connection
- Verify API URL correct
- Check firewall/proxy settings
