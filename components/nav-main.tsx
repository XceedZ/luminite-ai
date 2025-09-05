"use client"

import Link from "next/link"
import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

import { HideOnCollapse } from "@/components/ui/hide-on-collapse" // 1. Impor HideOnCollapse
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Tipe sekarang menyertakan 'name' untuk kunci translasi
type NavMainItem = {
  name: string
  title: string
  href: string
  icon?: Icon
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
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* Tombol "Quick Create" statis */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={t("quickCreate")}
              className="justify-center cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
            >
              {/* 3. Tambahkan flex-shrink-0 pada ikon */}
              <IconCirclePlusFilled className="flex-shrink-0" />
              {/* 2. Bungkus teks dengan HideOnCollapse */}
              <HideOnCollapse>
                <span>{t("quickCreate")}</span>
              </HideOnCollapse>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Item navigasi dinamis dari props */}
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.href

            return item.href ? (
              <SidebarMenuItem key={item.name}> {/* Gunakan 'name' sebagai key unik */}
                <SidebarMenuButton
                  asChild
                  // Tooltip sekarang menggunakan translasi dinamis
                  tooltip={t(item.name)}
                  className={cn(
                    isActive && "bg-accent text-accent-foreground",
                  )}
                >
                  <Link href={item.href}>
                    {item.icon && <item.icon />}
                    {/* Teks menu sekarang menggunakan translasi dinamis */}
                    <span>{t(item.name)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : null
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
