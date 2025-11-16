# 📚 Luminite AI Documentation

Welcome to Luminite AI documentation! Here you'll find everything you need to know about using and developing with Luminite AI.

---

## 📖 Documentation Index

### 🎯 For Users (Non-Technical)

1. **[Cara Edit Web AI](./CARA_EDIT_WEB_AI.md)** ⭐ **START HERE**
   - Panduan lengkap cara edit website yang sudah digenerate AI
   - Tidak perlu coding!
   - Bahasa Indonesia

### 🛠️ For Developers

2. **[Visual Editor - Technical Documentation](./VISUAL_EDITOR.md)**
   - Architecture & implementation details
   - Component API reference
   - Customization guide

3. **[Visual Editor - Quick Start](./VISUAL_EDITOR_QUICK_START.md)**
   - Quick reference for developers
   - Common use cases
   - Troubleshooting

4. **[App Builder Prompts](./APP_BUILDER_PROMPTS.md)**
   - AI prompts untuk generate website
   - Template examples
   - Best practices

5. **[Templates Documentation](./templates.md)**
   - Available templates
   - Template structure
   - Creating custom templates

---

## 🚀 Quick Links

### Getting Started
- [Installation](#installation)
- [Configuration](#configuration)
- [First Steps](#first-steps)

### Features
- [Visual Editor](./CARA_EDIT_WEB_AI.md)
- [AI Generation](./APP_BUILDER_PROMPTS.md)
- [Templates](./templates.md)

### Development
- [Architecture](./VISUAL_EDITOR.md)
- [Contributing](#contributing)
- [API Reference](./VISUAL_EDITOR.md#api-reference)

---

## 📦 Installation

```bash
# Clone repository
git clone <repository-url>

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
pnpm dev
```

---

## ⚙️ Configuration

### Environment Variables

```env
# OpenAI API (for AI generation)
OPENAI_API_KEY=your_openai_api_key

# Upstash Redis (for code storage)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Base URL (for sharing)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Dependencies

**Core:**
- Next.js 15.5.2
- React 18+
- TypeScript

**UI Components:**
- Tailwind CSS
- shadcn/ui
- Radix UI

**Visual Editor:**
- Craft.js (page builder)
- TipTap (rich text editor)

**AI:**
- OpenAI SDK
- Vercel AI SDK

---

## 🎯 First Steps

### 1. Generate Website with AI

```typescript
// Navigate to /playground/app-builder
// Enter prompt, e.g.:
"Create a modern landing page for a coffee shop with hero section, menu, and contact form"
```

### 2. Edit Website Visually

```typescript
// After generation:
1. Click "Edit" tab in preview panel
2. Click any element to edit
3. Drag & drop from toolbar to add new elements
4. Click "Save Changes" when done
```

### 3. Publish & Share

```typescript
// After editing:
1. Click "Publish" button
2. Click "Share" to copy public URL
3. Share URL with anyone
```

---

## 🏗️ Architecture

```
luminite-ai/
├── app/
│   ├── playground/app-builder/      # AI website generator
│   ├── (preview)/app-builder-preview/ # Visual editor
│   └── (share)/                     # Public sharing
├── components/
│   ├── ui/                          # shadcn/ui components
│   ├── panel-code.tsx               # Preview panel with edit mode
│   └── ...
├── lib/
│   ├── actions/ai.ts                # AI generation logic
│   ├── templates/                   # Website templates
│   └── utils/                       # Utilities
└── docs/                            # Documentation (you are here)
```

---

## 🎨 Features

### ✅ Current Features

- 🤖 **AI Website Generation**
  - Natural language prompts
  - Multiple templates (Landing Page, Blog, Portfolio, E-commerce, etc)
  - React/TSX and HTML output

- 🎨 **Visual Editor**
  - WYSIWYG editing
  - Drag & drop components
  - Rich text editing (TipTap)
  - Inline editing
  - Component toolbar

- 📱 **Responsive Preview**
  - Desktop/Tablet/Phone views
  - Device size selector
  - Browser-like preview

- 🚀 **Publishing & Sharing**
  - One-click publish
  - Public shareable URLs
  - Code export

### 🚧 Upcoming Features

- [ ] Undo/Redo
- [ ] Auto-save
- [ ] Component templates library
- [ ] Collaborative editing
- [ ] Version history
- [ ] Export to various formats
- [ ] Mobile editing support

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint & Prettier
- Write meaningful commit messages
- Update documentation
- Add tests for new features

---

## 📝 Documentation Standards

### Adding New Documentation

1. Create markdown file in `docs/` directory
2. Add to index in this README
3. Use clear headings and structure
4. Include code examples
5. Add troubleshooting section

### Documentation Structure

```markdown
# Title

## Overview
Brief description

## Features
What it does

## Usage
How to use it

## API Reference
Technical details

## Examples
Code examples

## Troubleshooting
Common issues

## FAQ
Frequently asked questions
```

---

## 🐛 Troubleshooting

### Common Issues

**Build errors:**
```bash
# Clear cache and rebuild
rm -rf .next
pnpm run build
```

**Type errors:**
```bash
# Regenerate types
pnpm run build
```

**Environment issues:**
```bash
# Check .env.local file
cat .env.local
```

### Getting Help

- 📖 Check documentation
- 💬 Ask in discussions
- 🐛 Report bugs in issues
- 📧 Contact support

---

## 📊 Project Status

- **Version:** 1.0.0 (Beta)
- **Status:** Active Development
- **Last Updated:** November 2024

---

## 📄 License

[Your License Here]

---

## 🌟 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Craft.js](https://craft.js.org/)
- [TipTap](https://tiptap.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📞 Contact

- **Website:** [Your Website]
- **Email:** [Your Email]
- **Twitter:** [@YourTwitter]
- **GitHub:** [Your GitHub]

---

**Made with ❤️ by Luminite AI Team**
