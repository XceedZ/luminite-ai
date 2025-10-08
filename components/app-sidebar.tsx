"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
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
import { GalleryVerticalEnd, AudioWaveform, Command as CommandIcon } from "lucide-react";
import { TeamSwitcher } from "@/components/team-switcher";

const user = { name: "Luminite", email: "luminiteai@dev.com", avatar: "/avatars/shadcn.jpg" };

// Acme-style teams list to replace the single logo header
const teams = [
  { name: "Luminite.", logo: AudioWaveform },
  { name: "Evil Corp.", logo: CommandIcon },
];

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  
  // [PERBAIKAN] Ambil juga state 'isSessionsLoading' dari store
  const { chatSessions, fetchChatSessions, isSessionsLoading } = useAIStore();

  React.useEffect(() => {
    fetchChatSessions();
  }, [fetchChatSessions]);

  const translate = React.useCallback((key: string): string => t(key), [t]);

  const dynamicNav = React.useMemo(() => {
    const buildUrls = (items: NavItem[]): NavItem[] =>
      items.map((item) => ({
        ...item,
        href: `/${item.href}`,
        icon: item.icon ?? IconCircle, // ✅ fallback supaya gak undefined
        items: item.items ? buildUrls(item.items) : undefined,
      }));
    
    const buildHistoryUrls = (items: ChatHistoryItem[]): ChatHistoryItem[] =>
      (items || []).map((item) => ({
        ...item,
        href: `/quick-create/${item.id}`,
      }));

    return {
      main: buildUrls(mainNav),
      data: buildUrls(dataNav),
      history: buildHistoryUrls(chatSessions),
      secondary: buildUrls(secondaryNav),
    };
  }, [chatSessions]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams.map((t) => ({ name: t.name, logo: t.logo, plan: "" }))} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={dynamicNav.main} pathname={pathname} t={translate} />
        <NavData items={dynamicNav.data} pathname={pathname} t={translate} />
        {/* [PERBAIKAN] Teruskan state 'isSessionsLoading' sebagai prop 'isLoading' */}
        <NavHistory 
          chatHistory={dynamicNav.history} 
          isLoading={isSessionsLoading}
          t={translate} 
        />
        
        <HideOnCollapse>
          <NavSecondary items={dynamicNav.secondary} t={translate} />
        </HideOnCollapse>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} t={translate} />
      </SidebarFooter>
    </Sidebar>
  );
}

