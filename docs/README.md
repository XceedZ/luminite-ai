# Dokumentasi Luminite AI

Kumpulan dokumentasi untuk komponen, utilities, dan fitur-fitur aplikasi.

## Struktur Dokumentasi

```
docs/
├── README.md                    # Index dokumentasi (file ini)
├── components/                  # Dokumentasi komponen
│   └── custom-toast.md         # Custom Toast Component
├── utils/                       # Dokumentasi utilities
│   └── api-connect.md          # API Connect Utility
└── ...                         # Dokumentasi lainnya
```

## Daftar Dokumentasi

### Components

- **[Custom Toast](./components/custom-toast.md)** - Toast notification component dengan support 2 tema dan 2 mode

### Utils

- **[API Connect](./utils/api-connect.md)** - Utility untuk koneksi ke API dengan mudah

### Routing

- **[Routes Structure](../ROUTES.md)** - Struktur routing Next.js App Router

## Cara Menambahkan Dokumentasi Baru

1. Buat file `.md` di folder yang sesuai (`components/`, `utils/`, dll)
2. Gunakan format Markdown standar
3. Tambahkan link ke file ini di section yang sesuai
4. Ikuti struktur yang sudah ada untuk konsistensi

## Format Dokumentasi

Setiap dokumentasi harus mencakup:

1. **Judul dan Deskripsi** - Penjelasan singkat
2. **Instalasi/Setup** - Cara setup jika diperlukan
3. **API Reference** - Daftar props/methods/options
4. **Contoh Penggunaan** - Code examples
5. **Best Practices** - Tips dan rekomendasi
6. **Troubleshooting** - Common issues dan solusi

## Contributing

Saat menambahkan fitur baru atau komponen baru, pastikan untuk:

1. Buat dokumentasi yang lengkap
2. Sertakan contoh penggunaan
3. Update index ini
4. Test semua contoh code
