# Luminite AI Documentation

Welcome to Luminite AI documentation! 📚

## 📖 Documentation Index

- [Templates](./templates.md) - Template routes dan preview URLs
- [API Documentation](./api.md) - API endpoints (coming soon)
- [Components](./components.md) - UI components guide (coming soon)

## 🚀 Quick Links

### Development URLs

**Main App:**
- Home: `http://localhost:3000`
- Playground: `http://localhost:3000/playground/app-builder`

**Template Previews:**
- Landing Page: `http://localhost:3000/templates/landing-page`
- E-commerce: `http://localhost:3000/templates/ecommerce`
- Blog: `http://localhost:3000/templates/blog`
- Dashboard: `http://localhost:3000/templates/dashboard`
- Portfolio: `http://localhost:3000/templates/portfolio`
- Restaurant: `http://localhost:3000/templates/restaurant`

## 📂 Project Structure

```
luminite-ai/
├── app/                    # Next.js app directory
│   ├── (preview)/         # Preview routes (tidak di navbar)
│   │   └── templates/     # Template preview routes
│   ├── playground/        # Main playground
│   └── locales/          # Translations
├── components/            # Reusable components
│   └── ui/               # Shadcn UI components
├── lib/
│   ├── actions/          # Server actions
│   ├── templates/        # Template files
│   └── utils/            # Utility functions
└── docs/                 # Documentation
```

## 🎯 Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Run development server:**
   ```bash
   pnpm dev
   ```

3. **Access the app:**
   - Main app: http://localhost:3000
   - Templates: http://localhost:3000/templates/[name]

## 🔗 Additional Resources

- [Main README](../README.md) - Project overview
- [Templates Documentation](./templates.md) - Detailed template guide

---

**Need help?** Check individual documentation files or contact the team.

