# Struktur Routing Luminite AI

Next.js menggunakan **App Router** (file-based routing) yang sudah built-in. Tidak perlu install router tambahan seperti React Router.

## Struktur Route

```
app/
├── page.tsx                    # / (Landing Page)
├── layout.tsx                  # Root Layout (untuk semua routes)
│
├── auth/
│   └── page.tsx               # /auth (Authentication Page)
│
├── (app)/                      # Route Group - Aplikasi dengan Sidebar
│   ├── layout.tsx             # Layout dengan Sidebar & TopBar
│   │
│   ├── dashboard/
│   │   └── page.tsx           # /dashboard
│   │
│   ├── tasks/
│   │   ├── page.tsx           # /tasks
│   │   └── [id]/
│   │       └── page.tsx       # /tasks/:id
│   │
│   ├── pricing/
│   │   └── page.tsx           # /pricing
│   │
│   ├── settings/
│   │   └── page.tsx           # /settings
│   │
│   ├── playground/
│   │   └── app-builder/
│   │       └── page.tsx       # /playground/app-builder
│   │
│   └── quick-create/
│       └── [[...sessionId]]/
│           └── page.tsx       # /quick-create atau /quick-create/:sessionId
│
├── (preview)/                  # Route Group - Preview Pages
│   ├── layout.tsx
│   ├── app-builder-preview/
│   │   └── [sessionId]/
│   │       └── page.tsx       # /app-builder-preview/:sessionId
│   └── templates/
│       └── [name]/
│           └── page.tsx       # /templates/:name
│
└── (share)/                    # Route Group - Share Pages
    ├── layout.tsx
    └── playground/
        └── app-builder/
            └── share/
                └── [sessionId]/
                    └── page.tsx  # /playground/app-builder/share/:sessionId
```

## Penjelasan Route Groups

Route Groups menggunakan tanda kurung `()` dan **tidak** mempengaruhi URL path:

- `(app)` - Routes aplikasi yang memerlukan sidebar
- `(preview)` - Routes untuk preview pages
- `(share)` - Routes untuk share pages

## Cara Kerja Next.js App Router

1. **File-based Routing**: Setiap file `page.tsx` menjadi route
2. **Layout Nesting**: Layout di parent folder akan wrap child routes
3. **Route Groups**: Folder dengan `()` tidak mempengaruhi URL
4. **Dynamic Routes**: `[id]` untuk single param, `[...slug]` untuk catch-all

## Contoh Routes

| URL | File Path |
|-----|-----------|
| `/` | `app/page.tsx` |
| `/auth` | `app/auth/page.tsx` |
| `/dashboard` | `app/(app)/dashboard/page.tsx` |
| `/tasks` | `app/(app)/tasks/page.tsx` |
| `/tasks/123` | `app/(app)/tasks/[id]/page.tsx` |
| `/pricing` | `app/(app)/pricing/page.tsx` |

## Navigasi

Gunakan `next/link` untuk navigasi:

```tsx
import Link from 'next/link';

<Link href="/auth">Go to Auth</Link>
<Link href="/dashboard">Go to Dashboard</Link>
```

Atau `useRouter` untuk programmatic navigation:

```tsx
'use client';
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/dashboard');
```
