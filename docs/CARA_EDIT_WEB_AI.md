# 📝 Cara Edit Web yang Sudah Digenerate AI

## 🎯 Overview
Setelah AI generate website, Anda bisa **edit langsung kontennya** tanpa coding! Tinggal klik, ketik, dan save.

---

## ⚠️ PENTING: Pahami Dulu Perbedaan Tab!

### 📋 3 Tab yang Tersedia:

**1. Tab "Preview"** 🖼️
- Menampilkan hasil generate AI (HTML/React)
- **Read-only** - hanya untuk lihat
- Full rendering dengan styles
- **INI YANG ANDA CARI** untuk lihat hasil AI!

**2. Tab "Code"** 💻
- Menampilkan source code
- Bisa copy untuk edit manual
- Advanced users only

**3. Tab "Edit"** ✏️
- Visual page builder (kosong)
- **BUKAN untuk edit hasil AI**
- Untuk build custom page from scratch
- Drag & drop components

---

## ⚡ Quick Answer: Cara Lihat Hasil AI

**Jika Anda baru generate dengan AI:**
1. ✅ Klik tab **"Preview"** ← hasil AI ada di sini!
2. ❌ JANGAN klik tab "Edit" (itu untuk build from scratch)

---

## 🚀 Langkah-Langkah

### 1️⃣ Generate Website dengan AI
```
1. Buka App Builder
2. Minta AI generate website (contoh: "Buatkan landing page untuk restoran saya")
3. Tunggu AI selesai generate
4. Klik tab "Preview" untuk lihat hasil ✅
```

### 2️⃣ Tab "Edit" - Untuk Build Custom (Bukan Edit AI!)
```
⚠️ CATATAN: Tab "Edit" TIDAK menampilkan konten AI!

Tab "Edit" adalah untuk:
- Build page dari scratch (kosong)
- Drag & drop components manual
- Learning page builder

Jika mau edit hasil AI → gunakan tab "Code" (manual)
```

### 3️⃣ Edit Konten (di Tab "Edit" - Build from Scratch)
**A. Edit Text:**
- Klik pada text yang ingin diubah
- Text akan highlight dengan border biru
- Langsung ketik untuk mengganti text
- Tekan Enter untuk baris baru
- Support formatting: bold, italic, heading, list, dll

**B. Edit Image:**
- Klik pada gambar
- Klik button "Change Image" yang muncul
- Paste URL gambar baru
- Klik "Save"

**C. Edit Button:**
- Klik pada button
- Form edit akan muncul:
  - Text Button → ketik text baru
  - Link URL → ganti destination link
  - Background Color → pilih warna
  - Text Color → pilih warna text
- Klik di luar untuk apply

**D. Edit Layout (Container):**
- Klik pada container (kotak pembungkus elemen)
- Drag & drop untuk reorder
- Bisa nested (container dalam container)

### 4️⃣ Tambah Element Baru (Tab "Edit")
```
Di tab "Edit":
1. Lihat Toolbar di kanan layar
2. Drag component yang diinginkan:
   📝 Text - untuk text/paragraph
   🖼️ Image - untuk gambar
   🔘 Button - untuk tombol/CTA
   📦 Container - untuk wrapper/layout
3. Drop ke canvas atau ke dalam container
```

---

## 🔄 Workflow yang Benar

### Scenario A: **Lihat & Publish Hasil AI** (Paling Umum)
```
1. Generate dengan AI
2. Klik tab "Preview" ✅ → lihat hasil
3. Satisfied? → Klik "Publish"
4. Klik "Share" → copy link
```

### Scenario B: **Edit Code Manual** (Advanced)
```
1. Generate dengan AI
2. Klik tab "Code" → copy code
3. Edit di text editor
4. Paste back ke code tab
5. Klik tab "Preview" → lihat hasil
```

### Scenario C: **Build Custom dari Scratch**
```
1. Skip AI / atau generate dulu sebagai referensi
2. Klik tab "Edit" → canvas kosong
3. Drag & drop components dari toolbar
4. Build page manually
5. Save → Preview
```

---

### 5️⃣ Save Perubahan (untuk Tab "Edit")
```
1. Setelah selesai edit
2. Klik button "Save Changes" di header
3. Tunggu konfirmasi "Changes saved successfully!"
4. Perubahan tersimpan di database
```

### 6️⃣ Preview & Publish
```
Tab "Preview":
- ✅ View hasil AI generation
- ✅ View hasil Edit mode (jika build dari scratch)
- ✅ Test responsive (Desktop/Tablet/Phone)
- ✅ Ready to publish

Tab "Code":
- ✅ Lihat source code
- ✅ Copy untuk external editing
- ✅ Paste modified code

Actions:
- 🌍 "Publish" → make it public
- 📋 "Share" → copy link
```

---

## 🎨 Fitur Visual Editor

### ✅ Yang Bisa Dilakukan:
- ✅ Edit text langsung (WYSIWYG)
- ✅ Ganti gambar dengan URL
- ✅ Ubah warna button & background
- ✅ Edit link URL
- ✅ Drag & drop untuk reorder
- ✅ Tambah element baru dari toolbar
- ✅ Hapus element (select → delete)
- ✅ Undo/Redo (coming soon)
- ✅ Responsive preview (Desktop/Tablet/Phone)

### ❌ Yang Belum Bisa:
- ❌ Edit CSS advanced
- ❌ Edit JavaScript functionality
- ❌ Import file dari komputer
- ❌ Export ke file HTML/CSS

---

## 🔥 Tips & Tricks

### 1. Rich Text Formatting
Saat edit text, gunakan shortcuts:
- **Bold:** Ctrl/Cmd + B
- **Italic:** Ctrl/Cmd + I
- **Heading:** # di awal baris
- **List:** - atau 1. di awal baris

### 2. Image Best Practices
- Gunakan URL yang publicly accessible
- Recommended: Cloudinary, Imgur, Unsplash
- Format support: JPG, PNG, GIF, WebP
- Optimal size: max 2MB untuk performance

### 3. Color Picker
- Button component ada color picker built-in
- Klik color box untuk buka picker
- Support hex color codes (#FF0000)
- Copy-paste hex code untuk consistency

### 4. Layout Management
- Gunakan Container untuk grouping elements
- Container bisa nested untuk layout kompleks
- Set flexbox properties:
  - Direction: row/column
  - Justify: start/center/end/space-between
  - Align: start/center/end/stretch

### 5. Reorder Elements
- Drag element yang sudah ada
- Drop di posisi baru
- Works inside containers
- Visual indicator saat drag

---

## ⚡ Shortcuts (Coming Soon)

| Action | Shortcut |
|--------|----------|
| Save | Ctrl/Cmd + S |
| Undo | Ctrl/Cmd + Z |
| Redo | Ctrl/Cmd + Y |
| Delete Selected | Delete/Backspace |
| Deselect | Escape |
| Copy | Ctrl/Cmd + C |
| Paste | Ctrl/Cmd + V |

---

## 🐛 Troubleshooting

### Element tidak bisa diklik
**Solusi:**
- Pastikan tab "Edit" sudah aktif (bukan tab "Preview")
- Refresh page dan coba lagi
- Check console untuk error

### Perubahan tidak tersimpan
**Solusi:**
- Check koneksi internet
- Pastikan sessionId valid
- Coba klik "Save Changes" lagi
- Check console untuk error messages

### Text tidak bisa diedit
**Solusi:**
- Klik pada element sampai muncul border biru
- Tunggu sampai cursor muncul di text area
- Klik langsung di dalam text (bukan di border)

### Image tidak muncul setelah ganti URL
**Solusi:**
- Check URL gambar valid dan accessible
- Coba gambar dari sumber lain (Unsplash, etc)
- Check browser console untuk CORS errors
- Pastikan URL dimulai dengan https://

### Toolbar tidak muncul
**Solusi:**
- Pastikan di tab "Edit", bukan "Preview"
- Scroll ke kanan jika layar terlalu kecil
- Refresh page
- Clear browser cache

---

## 📊 Comparison: Edit Mode vs Code Mode

| Feature | Edit Mode | Code Mode |
|---------|-----------|-----------|
| Edit konten | ✅ WYSIWYG | ❌ Manual coding |
| Edit layout | ✅ Visual | ❌ HTML |
| Edit styling | ✅ UI controls | ❌ CSS manual |
| Learning curve | ⭐ Easy | ⭐⭐⭐⭐⭐ Hard |
| Speed | ⚡ Fast | 🐌 Slow |
| Flexibility | 🎯 Limited | 🚀 Unlimited |

**Rekomendasi:** 
- Gunakan **Edit Mode** untuk perubahan konten & layout basic
- Gunakan **Code Mode** untuk customization advanced

---

## 🎓 Tutorial Video (Coming Soon)

- [ ] Basic editing
- [ ] Adding new components
- [ ] Layout management
- [ ] Publishing & sharing
- [ ] Advanced customization

---

## 💡 FAQ

**Q: Apakah perubahan otomatis tersimpan?**  
A: Tidak. Harus klik "Save Changes" manual.

**Q: Bisa undo kalau salah edit?**  
A: Belum ada fitur undo, akan ditambahkan soon.

**Q: Bisa edit JavaScript functionality?**  
A: Belum bisa. Visual editor hanya untuk konten & layout.

**Q: Perubahan hilang setelah refresh?**  
A: Kalau belum klik "Save Changes", perubahan akan hilang.

**Q: Bisa export ke file HTML?**  
A: Klik tab "Code" → copy paste code → save ke file .html

**Q: Support mobile editing?**  
A: Best experience di desktop. Mobile support coming soon.

---

## 🆘 Need Help?

- 📖 Baca [VISUAL_EDITOR.md](./VISUAL_EDITOR.md) untuk technical docs
- 🚀 Baca [VISUAL_EDITOR_QUICK_START.md](./VISUAL_EDITOR_QUICK_START.md)
- 💬 Contact support
- 🐛 Report bug di GitHub Issues

---

## 🎯 Next Features (Roadmap)

- [ ] Undo/Redo functionality
- [ ] Auto-save setiap 30 detik
- [ ] Component duplication (copy/paste)
- [ ] More editable components (Video, Form, etc)
- [ ] Advanced styling panel
- [ ] Responsive breakpoint editor
- [ ] Collaborative editing
- [ ] Version history
- [ ] Template library
- [ ] Export to various formats

---

**Happy Editing! 🚀✨**

