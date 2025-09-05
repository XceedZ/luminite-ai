import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { DynamicBreadcrumbs } from "@/components/dynamic-breadcrumbs"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getDictionary } from "@/lib/dictionaries" // Impor fungsi kamus

// Layout ini sekarang menjadi Server Component
export default function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  // Ambil kamus yang benar berdasarkan bahasa dari URL
  const dictionary = getDictionary(params.lang)

  return (
    <SidebarProvider>
      {/* Teruskan kamus sebagai prop ke AppSidebar */}
      <AppSidebar dictionary={dictionary} />
      <SidebarInset>
        <TopBar>
          {/* Anda juga bisa meneruskan kamus ke breadcrumbs */}
          <DynamicBreadcrumbs dictionary={dictionary} />
        </TopBar>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

