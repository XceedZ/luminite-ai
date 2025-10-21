# Next.js App Router Monorepo

This repository contains a boilerplate for a **Next.js** application using the **App Router**, designed for simplicity and scalability. It includes a modular architecture with built-in internationalization (**i18n**) and a structured component library based on **shadcn/ui**.

## ✨ Features

- **Next.js App Router**: Utilizes the latest routing and rendering model for modern web applications.  
- **shadcn/ui**: A beautifully-designed, modular component library to accelerate UI development.  
- **i18n (Internationalization)**: A clean, file-based routing and translation system to support multiple languages.  
- **Modular Structure**: The codebase is organized by feature, making it easy to manage and scale.  

## 🚀 Getting Started

Follow these steps to get your local development environment up and running.

### 1. Clone the repository
git clone https://github.com/your-username/your-repo-name.git  
cd your-repo-name  

### 2. Install dependencies
npm install  
# or  
yarn install  
# or  
pnpm install  

### 3. Run the development server
npm run dev  

Open your browser and navigate to **http://localhost:3000**. You should see the application running.

## 📂 Project Structure

This project uses a modern internationalization approach with cookie/localStorage-based language management:

app/  
  dashboard/  
    page.tsx  
    data.json  
  quick-create/  
    [[...sessionId]]/  
      page.tsx  
      quick-create-client.tsx  
  locales/  
    en.json  
    id.json  
components/  
  language-provider.tsx  
middleware.ts  

- **app/dashboard/**: Dashboard module with static route `/dashboard`.  
- **app/quick-create/**: Quick Create AI module with optional session ID.  
- **app/locales/**: Centralized translation files for all languages (`en.json`, `id.json`).  
- **components/language-provider.tsx**: Client-side language context that manages language switching via cookie/localStorage.  
- **middleware.ts**: Handles routing without locale prefixes.  
- **components/**: Houses all reusable UI components.  

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)  
- [shadcn/ui Documentation](https://ui.shadcn.com)  
- [Next.js App Router Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)  
