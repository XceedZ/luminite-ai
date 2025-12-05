// app/layout.tsx - Root layout untuk semua routes

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { cookies } from "next/headers";
import { LanguageProvider } from "@/components/language-provider";
import { Toaster } from "@/components/ui/sonner";
import { ToastProvider } from "@/components/ui/toast-provider";
import "./globals.css";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://luminite-ai.vercel.app"),
  title: {
    default: "Luminite AI - All-in-One AI App",
    template: "%s | Luminite AI",
  },
  description:
    "Transform your productivity with Luminite AI. The ultimate all-in-one AI application that combines intelligent automation, knowledge management, and AI-powered tools in a single unified platform. Streamline workflows and work smarter with cutting-edge AI technology.",
  keywords: [
    "AI app",
    "all-in-one AI",
    "artificial intelligence",
    "productivity",
    "knowledge base",
    "workflow automation",
    "AI assistant",
    "AI tools",
    "team collaboration",
    "productivity tools",
    "AI-powered",
    "workflow management",
    "smart automation",
    "AI platform",
  ],
  authors: [{ name: "Luminite AI Team" }],
  creator: "Luminite AI",
  publisher: "Luminite AI",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://luminite-ai.vercel.app",
    siteName: "Luminite AI",
    title: "Luminite AI - All-in-One AI App",
    description:
      "Transform your productivity with the ultimate all-in-one AI application. Streamline workflows, automate tasks, and work smarter with Luminite AI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Luminite AI - All-in-One AI App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luminite AI - All-in-One AI App",
    description:
      "Transform your productivity with the ultimate all-in-one AI application.",
    images: ["/og-image.png"],
    creator: "@luminiteai",
  },
  alternates: {
    canonical: "https://luminite-ai.vercel.app",
  },
  category: "Productivity",
  classification: "Business Software",
  other: {
    "application-name": "Luminite AI",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Luminite AI",
    "mobile-web-app-capable": "yes",
    "theme-color": "#A855F7",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialLang = (cookieStore.get("lang")?.value as "en" | "id") || "en";
  return (
    <html lang={initialLang} className="dark" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider initialLang={initialLang}>
            <ToastProvider position="top-right">
              {children}
              <Toaster richColors position="top-right" />
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}