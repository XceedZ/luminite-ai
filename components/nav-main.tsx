"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { IconPlus, type Icon } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { HideOnCollapse } from "@/components/ui/hide-on-collapse"
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
  icon: Icon
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
  const lang = pathname.split("/")[1] || "en"

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={t("quickCreate")}
              className="h-10 justify-center text-base font-semibold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
            >
              <Link href={`/${lang}/quick-create`}>
                <IconPlus className="flex-shrink-0" />
                <HideOnCollapse>
                  <span>{t("quickCreate")}</span>
                </HideOnCollapse>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarGroupLabel>{t("mainMenu")}</SidebarGroupLabel>

        <SidebarMenu>
          {/* [PERUBAHAN] Filter item yang memiliki `hidden: true` sebelum di-map */}
          {items.filter(item => !item.hidden).map((item) =>
            item.items && item.items.length > 0 ? (
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
