# Template Routes Documentation

Dokumentasi URL untuk semua template yang tersedia di Luminite AI.

## 📋 Daftar Template

Semua template dapat diakses melalui URL pattern: `/templates/[name]`

### 1. Landing Page Template
**URL:** `/templates/landing-page`  
**File:** `lib/templates/landing-page.tsx`  
**Deskripsi:** Modern SaaS landing page dengan hero section, features, testimonials, pricing, dan CTA.  
**Use Case:** Aplikasi SaaS, startup, produk digital

**Sections:**
- Hero dengan gradient background
- Features grid (6 items)
- Testimonials (3 items)
- Call-to-Action
- Footer dengan link sections

---

### 2. E-commerce Template
**URL:** `/templates/ecommerce`  
**File:** `lib/templates/ecommerce.tsx`  
**Deskripsi:** Template toko online dengan product grid, categories, dan shopping features.  
**Use Case:** Toko online, marketplace, e-commerce

**Sections:**
- Hero banner dengan CTA
- Product categories
- Featured products grid
- Product cards dengan hover effects
- Newsletter subscription
- Footer

---

### 3. Blog Template
**URL:** `/templates/blog`  
**File:** `lib/templates/blog.tsx`  
**Deskripsi:** Template blog modern dengan article cards dan reading experience yang optimal.  
**Use Case:** Blog, magazine, content publishing

**Sections:**
- Hero dengan featured article
- Article grid dengan thumbnails
- Category filters
- Reading time indicators
- Author information
- Newsletter subscription
- Footer

---

### 4. Dashboard Template
**URL:** `/templates/dashboard`  
**File:** `lib/templates/dashboard.tsx`  
**Deskripsi:** Dashboard admin dengan stats, charts, dan data tables.  
**Use Case:** Admin panel, analytics dashboard, management system

**Sections:**
- Sidebar navigation
- Stats cards (KPIs)
- Charts dan visualizations
- Data tables
- Activity feed
- Quick actions

---

### 5. Portfolio Template
**URL:** `/templates/portfolio`  
**File:** `lib/templates/portfolio.tsx`  
**Deskripsi:** Portfolio personal atau creative agency dengan project showcase.  
**Use Case:** Personal portfolio, creative agency, freelancer

**Sections:**
- Hero dengan introduction
- About section
- Skills showcase
- Project gallery dengan hover effects
- Services offered
- Contact information
- Footer

---

### 6. Restaurant Template
**URL:** `/templates/restaurant`  
**File:** `lib/templates/restaurant.tsx`  
**Deskripsi:** Template untuk restaurant atau cafe dengan menu dan reservations.  
**Use Case:** Restaurant, cafe, food business

**Sections:**
- Hero dengan hero image
- About restaurant
- Menu showcase dengan categories
- Special dishes highlight
- Testimonials dari customers
- Contact dan location
- Footer

---

## 🚀 Cara Menggunakan

### Development
```bash
# Akses template di development
http://localhost:3000/templates/landing-page
http://localhost:3000/templates/ecommerce
http://localhost:3000/templates/blog
http://localhost:3000/templates/dashboard
http://localhost:3000/templates/portfolio
http://localhost:3000/templates/restaurant
```

### Production
```bash
# Ganti dengan domain production Anda
https://yourdomain.com/templates/landing-page
https://yourdomain.com/templates/ecommerce
# dst...
```

---

## 🎨 Template Features

Semua template include:
- ✅ **Responsive Design** - Mobile, tablet, dan desktop friendly
- ✅ **Shadcn UI Components** - Menggunakan komponen UI modern
- ✅ **Tailwind CSS** - Utility-first CSS framework
- ✅ **Dark Mode Support** - Automatic theme switching
- ✅ **TypeScript** - Type-safe code
- ✅ **Accessibility** - ARIA labels dan keyboard navigation
- ✅ **SEO Friendly** - Semantic HTML structure

---

## 📝 Notes

- Template routes **tidak muncul di navbar** (by design)
- Template routes menggunakan `(preview)` group untuk layout terpisah
- Semua template menggunakan dynamic import untuk optimal performance
- Template routes di-set `noindex` untuk SEO (tidak diindex search engine)

---

## 🔧 Customization

Untuk memodifikasi template:
1. Edit file template di `lib/templates/[name].tsx`
2. Refresh halaman template untuk melihat perubahan
3. Template akan otomatis ter-update di AI generation

---

## 🤖 AI Integration

Template ini digunakan sebagai referensi untuk AI code generation:
- AI akan memilih template yang paling sesuai berdasarkan prompt user
- Template dijadikan inspirasi untuk struktur, styling, dan best practices
- AI akan adapt template sesuai kebutuhan spesifik user

Fungsi selection logic ada di: `lib/actions/ai.ts` → `getTemplateExample()`

---

## 📚 Component Library

Semua template menggunakan components dari:
- `@/components/ui/*` - Shadcn UI components
- `@/components/navbar` - Custom navbar component
- Icons: `lucide-react` dan `@tabler/icons-react`

---

**Last Updated:** 2024
**Maintained by:** Luminite AI Team

