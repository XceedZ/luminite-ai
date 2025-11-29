// app/(app)/layout.tsx - Layout untuk routes aplikasi dengan sidebar

"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TopBar } from "@/components/top-bar";
import { DynamicBreadcrumbs } from "@/components/dynamic-breadcrumbs";
import { useAuthStore } from "@/app/auth/store/auth.store";
import { isAuthenticated } from "@/utils/local-storage";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated: isAuthFromStore } = useAuthStore();

  useEffect(() => {
    // Check if user is authenticated (from store or localStorage)
    const hasAuth = isAuthFromStore || isAuthenticated();
    
    // If not authenticated and trying to access protected routes, redirect to /auth
    if (!hasAuth && pathname !== '/auth') {
      window.location.href = '/auth';
    }
  }, [router, pathname, isAuthFromStore]);

  // Check authentication before rendering
  const hasAuth = typeof window !== 'undefined' && (isAuthFromStore || isAuthenticated());
  
  // Don't render protected content if not authenticated
  if (typeof window !== 'undefined' && !hasAuth) {
    return null; // Will redirect via useEffect
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <TopBar>
          <DynamicBreadcrumbs />
        </TopBar>
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
