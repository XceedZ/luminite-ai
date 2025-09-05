"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { type Icon } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

// Menggunakan tipe NavItem yang konsisten dari config
type NavDataItem = {
  name: string
  title: string
  href: string
  icon?: Icon  // ✅ jadi optional
  items?: NavDataItem[]
}

interface NavDataProps {
  items: NavDataItem[]
  pathname: string
  t: (key: string) => string // Menambahkan 't' untuk translasi
}

export function NavData({ items, pathname, t }: NavDataProps) {
  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <SidebarGroup>
      {/* Ganti label menjadi "Data" */}
      <SidebarGroupLabel>{t("dataMenu")}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          // Tambahkan logika kondisional untuk tipe menu
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
    </SidebarGroup>
  )
}