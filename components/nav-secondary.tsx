"use client"

import * as React from "react"
import { type Icon, IconMoon, IconSun } from "@tabler/icons-react"
import { useTheme } from "next-themes"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Tipe untuk item navigasi, ditambahkan 'name' untuk kunci translasi
type NavSecondaryItem = {
  name: string
  title: string // 'title' dipertahankan untuk kompatibilitas jika masih dipakai di tempat lain
  url: string
  icon: Icon
}

export function NavSecondary({
  items,
  t, // Menerima fungsi translasi 't' sebagai prop
  ...props
}: {
  items: NavSecondaryItem[]
  t: (key: string) => string
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { isMobile } = useSidebar()
  const { theme, setTheme } = useTheme()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {/* Item Menu Utama */}
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild tooltip={t(item.name)}>
                <a href={item.url}>
                  <item.icon />
                  <span>{t(item.name)}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
