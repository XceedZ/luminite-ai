import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { DynamicBreadcrumbs } from "@/components/dynamic-breadcrumbs"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getDictionary } from "@/lib/dictionaries"
import { Toaster } from "@/components/ui/sonner" // [BARU] Impor Toaster

// Tipe `params` sudah benar sebagai Promise
type Props = {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export default async function AppLayout({
  children,
  params,
}: Props) {
  // Menggunakan `await` pada `params` untuk mendapatkan objeknya
  const resolvedParams = await params
  const dictionary = await getDictionary(resolvedParams.lang)

  return (
    <SidebarProvider>
      <AppSidebar dictionary={dictionary} />
      <SidebarInset>
        <TopBar>
          <DynamicBreadcrumbs dictionary={dictionary} />
        </TopBar>
        {children}
      </SidebarInset>
      {/* [BARU] Tambahkan komponen Toaster di sini */}
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  )
}
