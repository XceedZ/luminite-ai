import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { DynamicBreadcrumbs } from "@/components/dynamic-breadcrumbs"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getDictionary } from "@/lib/dictionaries"

// ✅ Hapus definisi tipe manual dari props
export default async function AppLayout({
  children,
  params,
}) {
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