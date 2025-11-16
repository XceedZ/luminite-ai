# Visual Editor - Quick Start Guide

## 🚀 Memulai

### 1. Install Dependencies
Dependencies sudah terinstall:
```bash
pnpm add @craftjs/core @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
```

### 2. Akses Preview Page
Buka preview page dengan sessionId:
```
http://localhost:3000/app-builder-preview/[sessionId]
```

### 3. Aktifkan Edit Mode
Klik button **"Edit"** di header (center toggle button)

## 🎨 Editing Elemen

### Text
1. Klik pada text yang ingin diedit
2. Element akan highlight dengan border biru
3. Langsung ketik untuk edit content
4. Support rich text (bold, italic, heading, dll)

### Image
1. Klik pada image
2. Klik button **"Change Image"** yang muncul
3. Masukkan URL image baru
4. Klik **"Save"**

### Button
1. Klik pada button
2. Form editing akan muncul:
   - Edit text button
   - Edit link URL
   - Pilih background color
   - Pilih text color
3. Klik di luar untuk apply

### Container
1. Klik pada container (layout wrapper)
2. Container akan highlight
3. Drag & drop component ke dalam container

## ➕ Menambah Component Baru

### Dari Toolbar
1. Lihat toolbar di sisi kiri
2. Drag component yang diinginkan:
   - 📝 **Text** - Rich text element
   - 🖼️ **Image** - Image element
   - 🔘 **Button** - Button/CTA element
   - 📦 **Container** - Layout container
3. Drop ke canvas atau ke dalam container

## 💾 Menyimpan Perubahan

1. Setelah selesai edit, klik **"Save Changes"** di header kanan
2. Tunggu konfirmasi "Changes saved successfully!"
3. Klik **"Preview"** untuk lihat hasil final

## 🔗 Share Preview

1. Klik button **"Share"** di header kanan
2. Link akan otomatis di-copy ke clipboard
3. Share link ke user lain untuk view-only preview

## ⌨️ Keyboard Shortcuts

(Coming soon)
- `Cmd/Ctrl + Z` - Undo
- `Cmd/Ctrl + Y` - Redo
- `Cmd/Ctrl + S` - Save
- `Escape` - Deselect

## 💡 Tips & Tricks

### 1. Nested Containers
- Drop container ke dalam container untuk layout kompleks
- Gunakan flexbox properties untuk layout responsive

### 2. Reorder Elements
- Drag element yang sudah ada untuk reorder
- Works inside containers

### 3. Color Picking
- Button component support color picker
- Use hex color codes untuk consistency

### 4. Image URLs
- Gunakan URL yang publicly accessible
- Recommended: Cloudinary, Imgur, atau CDN lainnya
- Format support: JPG, PNG, GIF, WebP

### 5. Rich Text Formatting
Text element support:
- Headings (H1-H6)
- Bold, Italic, Strikethrough
- Lists (ordered & unordered)
- Links
- Code blocks

## 🐛 Troubleshooting

### Element tidak bisa diklik
- Pastikan **Edit Mode** sudah aktif (toggle harus di "Edit")
- Refresh page dan coba lagi

### Perubahan tidak tersimpan
- Check console untuk error messages
- Pastikan sessionId valid
- Verify network connection

### Text tidak bisa diedit
- Klik pada element sampai highlight muncul (border biru)
- Pastikan focus di dalam text area

### Image tidak muncul
- Check URL image valid dan accessible
- Try different image URL
- Check browser console for CORS errors

## 📚 Next Steps

- Baca [full documentation](./VISUAL_EDITOR.md)
- Explore component customization
- Learn about Craft.js advanced features

## 🆘 Need Help?

- Check [VISUAL_EDITOR.md](./VISUAL_EDITOR.md) untuk dokumentasi lengkap
- Review example components di `/components` folder
- Check [Craft.js docs](https://craft.js.org/)

