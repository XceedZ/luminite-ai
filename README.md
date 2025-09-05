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

This project follows a dynamic routing pattern for internationalization:

app/  
  [lang]/  
    dashboard/  
      page.tsx  
      translations.json  
components/  
middleware.ts  

- **app/[lang]/**: Core of the i18n setup. Captures the language segment (`en`, `id`, etc.) for every route.  
- **app/[lang]/dashboard/**: Contains the Dashboard module. Renders at `/en/dashboard` and `/id/dashboard`.  
- **app/[lang]/dashboard/translations.json**: All translations for the Dashboard module, grouped by language.  
- **middleware.ts**: Handles redirects, ensuring `/en` or `/id` forward to `/en/dashboard` or `/id/dashboard`.  
- **components/**: Houses all reusable UI components.  

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)  
- [shadcn/ui Documentation](https://ui.shadcn.com)  
- [Next.js App Router Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)  
