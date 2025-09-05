"use client"

import * as React from "react"
// 'Icon' dihapus karena tidak dipakai
import { useTheme } from "next-themes"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // 'useSidebar' dihapus karena 'isMobile' tidak dipakai
} from "@/components/ui/sidebar"

import type { NavItem } from "@/config/nav"

export function NavSecondary({
  items,
  t,
  ...props
}: {
  items: NavItem[]
  t: (key: string) => string
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  // Variabel yang tidak terpakai dihapus
  // const { isMobile } = useSidebar()
  // const { theme, setTheme } = useTheme()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild tooltip={t(item.name)}>
              <a href={item.href}>
  {item.icon && <item.icon />} {/* ✅ cek dulu */}
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