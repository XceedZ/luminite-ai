"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react" // ✅ 1. Impor baru
import { type Icon } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible" // ✅ 1. Impor baru
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

// Tipe tidak perlu diubah
type NavMainItem = {
  name: string
  title: string
  href: string
  icon: Icon
  items?: NavMainItem[]
}

export function NavMain({
  items,
  pathname,
  t,
}: {
  items: NavMainItem[]
  pathname: string
  t: (key: string) => string
}) {
  // ✅ 2. Tambahkan fungsi helper untuk mengecek state aktif
  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* Tombol Quick Create tidak berubah */}
        {/* ... (kode Quick Create Anda di sini) ... */}

        <SidebarGroupLabel>{t("mainMenu")}</SidebarGroupLabel>

        <SidebarMenu>
          {items.map((item) =>
            // ✅ 3. Logika Kondisional: Cek apakah ada submenu
            item.items && item.items.length > 0 ? (
              // JIKA ADA SUBMENU: Render sebagai Collapsible
              <Collapsible
                key={item.name}
                asChild
                defaultOpen={isActive(item.href)}
                className="group/collapsible"
              >
                <SidebarMenuItem className={isActive(item.href) ? "bg-sidebar-accent" : ""}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={t(item.name)}>
                      {item.icon && <item.icon />}
                      <span>{t(item.name)}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem
                          key={subItem.name}
                          className={pathname === subItem.href ? "bg-sidebar-accent/80" : ""}
                        >
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.href}>
                              <span>{t(subItem.name)}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              // JIKA TIDAK ADA SUBMENU: Render sebagai Link biasa
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  tooltip={t(item.name)}
                  className={cn(pathname === item.href && "bg-accent text-accent-foreground")}
                >
                  <Link href={item.href}>
                    {item.icon && <item.icon />}
                    <span>{t(item.name)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ),
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}