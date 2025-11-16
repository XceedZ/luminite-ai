# 🎨 Edit Mode vs Preview Mode

## 📖 Understanding the Difference

### Tab **Preview** 
**→ Untuk melihat hasil generate AI**

- ✅ Menampilkan HTML/React yang sudah di-generate AI
- ✅ Fully rendered dengan styles
- ✅ Interactive elements (jika ada)
- ✅ Responsive preview (Desktop/Tablet/Phone)
- ❌ **Tidak bisa edit** konten di sini

**Use Case:**
- Melihat hasil generate AI
- Test functionality
- Check responsive design
- Preview before publish

---

### Tab **Edit**
**→ Untuk build dari scratch atau custom components**

- ✅ Visual page builder (Craft.js)
- ✅ Drag & drop components
- ✅ Inline editing
- ✅ Component toolbar
- ❌ **Tidak load** konten AI yang sudah di-generate
- ❌ Start dari canvas kosong (by design)

**Use Case:**
- Build custom page from scratch
- Create new sections
- Custom layouts
- Learning page builder

---

## 🤔 Kenapa Edit Mode Tidak Load Konten AI?

### Alasan Technical:

1. **Different Data Structure**
   ```
   AI Generate:
   HTML/React Code (string) → render langsung
   
   Visual Editor:
   Craft.js Nodes (object tree) → editable components
   ```

2. **Conversion Complexity**
   - AI generate → HTML with inline styles
   - Craft.js → React components with props
   - Tidak ada 1-to-1 mapping
   - Parse HTML ke Craft.js nodes sangat kompleks

3. **Performance**
   - AI bisa generate complex layouts
   - Convert ke editable nodes = heavy computation
   - Bisa crash browser untuk large pages

### Alasan UX:

1. **Different Purpose**
   - Preview = lihat hasil AI
   - Edit = build custom dari scratch
   - Mixing keduanya = confusing

2. **Clean State**
   - Editor mulai dari canvas kosong
   - User punya full control
   - Tidak terbebani dengan AI structure

---

## 🎯 Recommended Workflow

### Scenario 1: **AI Generate → Preview → Publish**
```
1. Generate dengan AI
2. Klik tab "Preview" → lihat hasil
3. Satisfied? → Publish & Share
```
**Best for:** Quick website generation

---

### Scenario 2: **AI Generate → Customize → Publish**
```
1. Generate dengan AI (base template)
2. Klik tab "Code" → copy code
3. Manual edit di text editor
4. Paste back → Preview → Publish
```
**Best for:** Advanced customization

---

### Scenario 3: **Build from Scratch**
```
1. Skip AI generation
2. Klik tab "Edit" → start building
3. Drag & drop components
4. Save → Preview → Publish
```
**Best for:** Custom designs, learning

---

### Scenario 4: **Hybrid Approach** 🆕 (Coming Soon)
```
1. Generate dengan AI
2. Klik "Import to Editor" button
3. AI content converted to editable nodes
4. Edit dengan visual editor
5. Save → Publish
```
**Status:** 🚧 Under Development

---

## 💡 Current Workaround

### Jika Ingin Edit Konten AI:

**Option 1: Manual Code Edit**
```
1. Tab "Preview" → lihat hasil AI
2. Tab "Code" → copy code
3. Edit manual di text editor
4. Paste back
```

**Option 2: Screenshot + Rebuild**
```
1. Tab "Preview" → screenshot layout
2. Tab "Edit" → rebuild manually
3. Drag components sesuai screenshot
```

**Option 3: Use as Reference**
```
1. Tab "Preview" → AI content (read-only)
2. Tab "Edit" → build custom version
3. Reference AI untuk styling ideas
```

---

## 🔮 Future Features (Roadmap)

### Phase 1: Import/Convert (Q1 2024)
- [ ] Button "Import to Editor" di Preview tab
- [ ] HTML to Craft.js node converter
- [ ] Basic components (text, image, button) support
- [ ] Layout preservation

### Phase 2: Hybrid Editing (Q2 2024)
- [ ] Edit AI content langsung di Preview
- [ ] Inline text editing overlay
- [ ] Image replacement
- [ ] Style adjustments

### Phase 3: Advanced Features (Q3 2024)
- [ ] AI re-generation for sections
- [ ] Smart component suggestions
- [ ] Version history
- [ ] A/B testing layouts

---

## 📊 Comparison Table

| Feature | Preview Mode | Edit Mode |
|---------|-------------|-----------|
| View AI Content | ✅ Yes | ❌ No |
| Inline Editing | ❌ No | ✅ Yes |
| Drag & Drop | ❌ No | ✅ Yes |
| Component Toolbar | ❌ No | ✅ Yes |
| Responsive Preview | ✅ Yes | ⚠️ Basic |
| Code Export | ✅ Yes | ✅ Yes |
| Save Changes | N/A | ✅ Yes |
| Starting Point | AI Generated | Empty Canvas |

---

## 🎓 Best Practices

### For Beginners:
1. **Start with AI Generate** - lihat apa yang bisa AI buat
2. **Use Preview Mode** - focus pada hasil
3. **Publish langsung** - jangan overthink
4. **Learn Edit Mode** - untuk next iteration

### For Advanced Users:
1. **AI as Inspiration** - generate dulu, lihat struktur
2. **Code Tab** - copy, modify, optimize
3. **Edit Mode** - untuk custom sections
4. **Mix & Match** - combine AI + manual

### For Developers:
1. **AI Generate** - base structure
2. **Code Tab** - full control, add functionality
3. **Manual deployment** - beyond platform
4. **Edit Mode** - prototyping only

---

## ❓ FAQ

**Q: Kenapa Edit tab kosong padahal sudah generate AI?**
A: By design. Edit mode untuk build from scratch. AI content ada di Preview tab.

**Q: Bisakah edit konten AI langsung?**
A: Saat ini belum. Gunakan Code tab untuk manual editing. Feature "Import to Editor" coming soon.

**Q: Apa gunanya Edit mode kalau AI sudah generate?**
A: Untuk build custom sections, learn page builder, atau create dari scratch tanpa AI.

**Q: Apakah bisa combine AI content dengan custom Edit?**
A: Saat ini belum terintegrasi. Bisa via manual copy-paste code. Hybrid mode coming soon.

**Q: Kenapa tidak langsung convert AI HTML ke editable?**
A: Conversion complexity tinggi, bisa crash untuk complex layouts. Kami sedang develop smart converter.

**Q: Tab mana yang harus saya pakai?**
A: 
- **Preview** → lihat & publish AI content
- **Code** → advanced manual editing  
- **Edit** → build custom from scratch

---

## 🔗 Related Docs

- [Cara Edit Web AI](./CARA_EDIT_WEB_AI.md) - User guide
- [Visual Editor](./VISUAL_EDITOR.md) - Technical docs
- [Quick Start](./VISUAL_EDITOR_QUICK_START.md) - Fast reference

---

**Remember:** Preview mode dan Edit mode memiliki purpose berbeda. Use the right tool for the right job! 🎯

