import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { DynamicBreadcrumbs } from "@/components/dynamic-breadcrumbs"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getDictionary } from "@/lib/dictionaries"

// ✅ 1. Tambahkan `async` pada deklarasi fungsi
export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  // ✅ 2. Tambahkan `await` untuk mendapatkan objek kamus
  const dictionary = await getDictionary(params.lang)

  return (
    <SidebarProvider>
      <AppSidebar dictionary={dictionary} />
      <SidebarInset>
        <TopBar>
          <DynamicBreadcrumbs dictionary={dictionary} />
        </TopBar>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}