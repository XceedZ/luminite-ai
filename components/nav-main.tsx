"use client"

import { ChevronRight } from "lucide-react"
import { type Icon } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Kbd } from "@/components/ui/kbd"
import { HideOnCollapse } from "@/components/ui/hide-on-collapse"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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

type NavMainItem = {
  name: string
  title: string
  href: string
  icon?: Icon // <-- Ubah di sini, tambahkan '?'
  hidden?: boolean // Pastikan tipe di sini juga diperbarui
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
  const isActive = (href: string) => pathname.startsWith(href)
  // Routes no longer include language segment

  // Filter visible items first for consistent numbering
  const visibleItems = items.filter(item => !item.hidden)
  let kbdIndex = 0

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col">
        <SidebarGroupLabel>{t("mainMenu")}</SidebarGroupLabel>

        <SidebarMenu>
          {/* Filter item yang memiliki `hidden: true` sebelum di-map */}
          {visibleItems.map((item) => {
            // Only assign KBD to items without sub-items
            const hasSubItems = item.items && item.items.length > 0
            const currentKbd = hasSubItems ? null : ++kbdIndex

            return hasSubItems ? (
              <Collapsible
                key={item.name}
                asChild
                defaultOpen={isActive(item.href)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={t(item.name)}>
                      {item.icon && <item.icon />}
                      <span>{t(item.name)}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
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
              <SidebarMenuItem key={item.name} className="relative">
                <SidebarMenuButton
                  asChild
                  tooltip={t(item.name)}
                  isActive={pathname === item.href}
                >
                  <Link href={item.href}>
                    {item.icon && <item.icon />}
                    <span>{t(item.name)}</span>
                  </Link>
                </SidebarMenuButton>
                {currentKbd && (
                  <HideOnCollapse>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-muted-foreground pointer-events-none">
                      <Kbd className="h-5 px-1">⌘</Kbd>
                      <Kbd className="h-5 px-1.5">{currentKbd}</Kbd>
                    </span>
                  </HideOnCollapse>
                )}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
