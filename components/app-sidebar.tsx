"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { dataNav, mainNav, secondaryNav } from "@/config/nav";
import type { NavItem } from "@/config/nav";
import { NavData } from "@/components/nav-data";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { HideOnCollapse } from "@/components/ui/hide-on-collapse";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const user = { name: "Luminite", email: "luminiteai@dev.com", avatar: "/avatars/shadcn.jpg" };

type AppSidebarProps = {
  dictionary: { [key: string]: string };
} & React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ dictionary, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";

  const t = React.useCallback((key: string): string => dictionary[key] || key, [
    dictionary,
  ]);

  const dynamicNav = React.useMemo(() => {
    const buildUrls = (items: NavItem[]): NavItem[] =>
      items.map((item) => ({
        ...item,
        href: `/${lang}/${item.href}`,
        items: item.items ? buildUrls(item.items) : undefined,
      }));

    return {
      main: buildUrls(mainNav),
      data: buildUrls(dataNav),
      secondary: buildUrls(secondaryNav),
    };
  }, [lang]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex h-14 items-center justify-start gap-2 px-3 group-data-[collapsible=icon]:justify-center">
          <div className="relative h-9 w-9 flex-shrink-0 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9">
            <Image
              src="/image.png"
              alt="Luminite Logo"
              fill
              // [PERUBAHAN] Kelas ditambahkan di sini untuk mengubah warna logo
              className="object-contain invert dark:invert-0"
            />
          </div>
          <HideOnCollapse>
            <span className="text-xl font-semibold">Luminite</span>
          </HideOnCollapse>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={dynamicNav.main} pathname={pathname} t={t} />
        <NavData items={dynamicNav.data} pathname={pathname} t={t} />

        <HideOnCollapse>
        <NavSecondary items={dynamicNav.secondary} t={t} />
        </HideOnCollapse>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} t={t} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

