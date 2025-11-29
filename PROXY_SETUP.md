# Proxy Configuration Setup

## Overview
Frontend (Next.js) berjalan di port **8080** dan menggunakan proxy untuk forward API requests ke backend (Elysia) di port **5005**.

## Configuration

### Backend (Elysia)
- **Port**: `5005`
- **Base URL**: `http://localhost:5005`
- **API Routes**: `/api/v1/*`

### Frontend (Next.js)
- **Port**: `8080`
- **Base URL**: `http://localhost:8080`
- **Proxy**: `/api/v1/*` → `http://localhost:5005/api/v1/*`

## How It Works

1. Frontend membuat request ke `/api/v1/login`
2. Next.js rewrite rule di `next.config.ts` forward request ke `http://localhost:5005/api/v1/login`
3. Backend Elysia menangani request dan mengembalikan response
4. Response dikembalikan ke frontend

## Environment Variables

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5005
```

**Note**: `NEXT_PUBLIC_API_URL` digunakan oleh `next.config.ts` untuk proxy destination, bukan untuk direct API calls.

### Backend `.env`
```env
DATABASE_URL=postgresql://postgres:lumi123@db.uydzmbzivxdcfefqdimx.supabase.co:5432/postgres
JWT_SECRET=your-secret-key
PORT=5005
```

## Running the Applications

### Terminal 1: Backend
```bash
cd /Users/xceedz/Documents/Projects/elysia-template
bun run dev
# Backend akan berjalan di http://localhost:5005
```

### Terminal 2: Frontend
```bash
cd /Users/xceedz/Documents/Projects/luminite-ai
npm run dev
# Frontend akan berjalan di http://localhost:8080
```

## API Endpoints

Semua endpoint menggunakan prefix `/api/v1`:

- `POST /api/v1/register` - Register new user
- `POST /api/v1/login` - Login user
- `GET /api/v1/profile` - Get user profile (protected)
- `GET /api/v1/users` - Get all users (protected)

## Testing

1. Buka browser: `http://localhost:8080`
2. Buka DevTools → Network tab
3. Coba login/register
4. Request akan terlihat sebagai `/api/v1/login` (relative path)
5. Backend akan menerima request di `http://localhost:5005/api/v1/login`

## Troubleshooting

### Error: 404 Not Found
- Pastikan backend berjalan di port 5005
- Check `next.config.ts` rewrite rule
- Check `NEXT_PUBLIC_API_URL` di `.env.local`

### CORS Error
- Backend sudah dikonfigurasi dengan CORS untuk allow all origins
- Check `src/index.ts` di backend untuk CORS config

### Connection Refused
- Pastikan backend sudah running
- Check port 5005 tidak digunakan aplikasi lain
- Test backend langsung: `curl http://localhost:5005/api/v1/login`
