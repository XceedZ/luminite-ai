"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { type Icon } from "@tabler/icons-react"
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

type NavCloudsItem = {
  title: string
  href: string
  icon?: Icon
  items?: NavCloudsItem[]
}

interface NavCloudsProps {
    items: NavCloudsItem[],
    pathname: string
}

export function NavClouds({ items, pathname }: NavCloudsProps) {
  // Aktif jika path saat ini diawali dengan href item
  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Clouds</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={isActive(item.href)}
            className="group/collapsible"
          >
            <SidebarMenuItem className={isActive(item.href) ? "bg-sidebar-accent" : ""}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title} className={pathname === subItem.href ? "bg-sidebar-accent/80" : ""}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.href}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
