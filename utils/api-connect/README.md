# API Connect Utility

Utility untuk koneksi ke API dengan mudah. Semua endpoint dan method tersedia di satu tempat.

## Struktur

```
utils/api-connect/
├── index.ts        # Main export
├── client.ts       # Base API client
├── endpoints.ts    # API endpoints constants
├── types.ts        # TypeScript types
└── README.md       # Dokumentasi
```

## Penggunaan

### Import

```typescript
import { api, API_ENDPOINTS } from '@/utils/api-connect';
```

### GET Request

```typescript
// Simple GET
const response = await api.get(API_ENDPOINTS.CHAT.SESSIONS);

// GET dengan query params
const response = await api.get(API_ENDPOINTS.CHAT.SESSIONS, {
  params: { page: 1, limit: 10 }
});

// GET dengan custom headers
const response = await api.get(API_ENDPOINTS.USER.PROFILE, {
  headers: { 'X-Custom-Header': 'value' }
});
```

### POST Request

```typescript
// POST dengan body
const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
  email: 'user@example.com',
  password: 'password123'
});

// POST dengan config
const response = await api.post(API_ENDPOINTS.TASKS.CREATE, taskData, {
  headers: { 'X-Request-ID': '123' },
  timeout: 5000
});
```

### PUT Request

```typescript
const response = await api.put(API_ENDPOINTS.TASKS.UPDATE(taskId), {
  title: 'Updated Task',
  completed: true
});
```

### PATCH Request

```typescript
const response = await api.patch(API_ENDPOINTS.TASKS.COMPLETE(taskId), {
  completed: true
});
```

### DELETE Request

```typescript
const response = await api.delete(API_ENDPOINTS.TASKS.DELETE(taskId));
```

## Error Handling

```typescript
try {
  const response = await api.get(API_ENDPOINTS.CHAT.SESSIONS);
  console.log(response.data); // Data dari API
} catch (error) {
  if (error.status === 401) {
    // Unauthorized - redirect to login
  } else if (error.status === 404) {
    // Not found
  } else {
    console.error('API Error:', error.message);
  }
}
```

## Response Format

Semua response mengikuti format:

```typescript
interface ApiResponse<T> {
  data?: T;           // Data dari API
  message?: string;   // Success/error message
  error?: string;     // Error message (jika ada)
  status: number;     // HTTP status code
  success: boolean;    // true jika success
}
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

Untuk set token:
```typescript
localStorage.setItem('auth_token', 'your-token-here');
```

## Custom Base URL

Default base URL diambil dari `process.env.NEXT_PUBLIC_API_URL` atau `http://localhost:3000/api`.

Untuk custom instance:
```typescript
import { ApiClient } from '@/utils/api-connect';

const customApi = new ApiClient('https://api.example.com');
```

## Endpoints

Semua endpoint didefinisikan di `endpoints.ts`:

- `API_ENDPOINTS.AUTH.*` - Authentication endpoints
- `API_ENDPOINTS.CHAT.*` - Chat endpoints
- `API_ENDPOINTS.AI.*` - AI endpoints
- `API_ENDPOINTS.TASKS.*` - Tasks endpoints
- `API_ENDPOINTS.USER.*` - User endpoints
- `API_ENDPOINTS.STORAGE.*` - Storage endpoints

## Timeout

Set timeout untuk request:
```typescript
const response = await api.get(API_ENDPOINTS.CHAT.SESSIONS, {
  timeout: 5000 // 5 seconds
});
```

## Abort Signal (Cancel Request)

```typescript
const controller = new AbortController();

api.get(API_ENDPOINTS.CHAT.SESSIONS, {
  signal: controller.signal
});

// Cancel request
controller.abort();
```

