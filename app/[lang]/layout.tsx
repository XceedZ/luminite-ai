import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { DynamicBreadcrumbs } from "@/components/dynamic-breadcrumbs"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getDictionary } from "@/lib/dictionaries"

// ✅ 1. Ubah tipe `params` menjadi sebuah Promise, sesuai pesan error
type Props = {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export default async function AppLayout({
  children,
  params,
}: Props) {
  // ✅ 2. Gunakan `await` pada `params` untuk mendapatkan objeknya
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
    </SidebarProvider>
  )
}