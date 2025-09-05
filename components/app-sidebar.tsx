"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IconCircle } from "@tabler/icons-react" // contoh default
import { dataNav, mainNav, secondaryNav } from "@/config/nav";
import type { NavItem } from "@/config/nav";
import { useAIStore } from "@/app/store/ai-store";
import { NavData } from "@/components/nav-data";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavHistory } from "@/components/nav-history";
import type { ChatHistoryItem } from "@/components/nav-history";
import { NavUser } from "@/components/nav-user";
import { HideOnCollapse } from "@/components/ui/hide-on-collapse";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

const user = { name: "Luminite", email: "luminiteai@dev.com", avatar: "/avatars/shadcn.jpg" };

type AppSidebarProps = {
  dictionary: { [key: string]: string };
} & React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ dictionary, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";
  
  // [PERBAIKAN] Ambil juga state 'isSessionsLoading' dari store
  const { chatSessions, fetchChatSessions, isSessionsLoading } = useAIStore();

  React.useEffect(() => {
    fetchChatSessions();
  }, [fetchChatSessions]);

  const t = React.useCallback((key: string): string => dictionary[key] || key, [
    dictionary,
  ]);

  const dynamicNav = React.useMemo(() => {
    const buildUrls = (items: NavItem[]): NavItem[] =>
      items.map((item) => ({
        ...item,
        href: `/${lang}/${item.href}`,
        icon: item.icon ?? IconCircle, // ✅ fallback supaya gak undefined
        items: item.items ? buildUrls(item.items) : undefined,
      }));
    
    const buildHistoryUrls = (items: ChatHistoryItem[]): ChatHistoryItem[] =>
      (items || []).map((item) => ({
        ...item,
        href: `/${lang}/quick-create/${item.id}`,
      }));

    return {
      main: buildUrls(mainNav),
      data: buildUrls(dataNav),
      history: buildHistoryUrls(chatSessions),
      secondary: buildUrls(secondaryNav),
    };
  }, [lang, chatSessions]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex h-14 items-center justify-start gap-2 px-3 group-data-[collapsible=icon]:justify-center">
          <div className="relative h-9 w-9 flex-shrink-0 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9">
            <Image
              src="/image.png"
              alt="Luminite Logo"
              fill
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
        {/* [PERBAIKAN] Teruskan state 'isSessionsLoading' sebagai prop 'isLoading' */}
        <NavHistory 
          chatHistory={dynamicNav.history} 
          isLoading={isSessionsLoading}
          t={t} 
        />
        
        <HideOnCollapse>
          <NavSecondary items={dynamicNav.secondary} t={t} />
        </HideOnCollapse>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} t={t} />
      </SidebarFooter>
    </Sidebar>
  );
}

