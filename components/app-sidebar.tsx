"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { IconInnerShadowTop } from "@tabler/icons-react"

import { mainNav, cloudNav, secondaryNav } from "@/config/nav"
import type { NavItem } from "@/config/nav"
import { NavMain } from "@/components/nav-main"
import { NavClouds } from "@/components/nav-clouds"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { HideOnCollapse } from "@/components/ui/hide-on-collapse"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const user = { name: "shadcn", email: "m@example.com", avatar: "/avatars/shadcn.jpg" }

export function AppSidebar({
  dictionary,
  ...props
}: {
  dictionary: { [key: string]: string }
} & React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const lang = pathname.split("/")[1] || "en"

  const t = React.useCallback((key: string): string => dictionary[key] || key, [
    dictionary,
  ])

  const dynamicNav = React.useMemo(() => {
    const buildUrls = (items: NavItem[]): NavItem[] =>
      items.map((item) => ({
        ...item,
        href: `/${lang}/${item.href}`,
        items: item.items ? buildUrls(item.items) : undefined,
      }))

    return {
      main: buildUrls(mainNav),
      clouds: buildUrls(cloudNav),
      secondary: buildUrls(secondaryNav),
    }
  }, [lang])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* Diubah menjadi div non-interaktif, bukan button */}
        <div className="flex h-14 items-center gap-1 px-3 justify-center">
          <IconInnerShadowTop className="h-6 w-6 flex-shrink-0" />
          <HideOnCollapse>
            <span className="text-base font-semibold">Luminite</span>
          </HideOnCollapse>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={dynamicNav.main} pathname={pathname} t={t} />
        <NavClouds items={dynamicNav.clouds} pathname={pathname} t={t} />

        <HideOnCollapse>
          <NavSecondary items={dynamicNav.secondary} pathname={pathname} t={t} />
        </HideOnCollapse>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} t={t} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}