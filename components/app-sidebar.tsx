"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { IconCircle, IconPlus, IconSparkles } from "@tabler/icons-react" // contoh default
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AudioWaveform, Command as CommandIcon } from "lucide-react";
import { TeamSwitcher } from "@/components/team-switcher";
import { getAuthUser } from "@/utils/local-storage";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";

// Upgrade Card Component
function UpgradeCard({ t }: { t: (key: string) => string }) {
  return (
    <div className="mx-2 mb-2 rounded-lg bg-secondary/50 border border-border p-3">
      <div className="flex items-center gap-2 mb-2">
        <IconSparkles className="size-5 text-primary" />
        <span className="font-semibold text-sm">{t("upgradeToPro")}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        {t("upgradeDescription")}
      </p>
      <Link href="/pricing">
        <RainbowButton size="sm" className="w-full">
          {t("upgradeNow")}
        </RainbowButton>
      </Link>
    </div>
  );
}

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

  // Get user data from localStorage
  const [user, setUser] = React.useState<{
    name: string;
    email: string;
    avatar: string;
  }>({
    name: "Luminite",
    email: "luminiteai@dev.com",
    avatar: "",
  });

  React.useEffect(() => {
    // Only fetch once on mount, don't reload on every fetchChatSessions change
    fetchChatSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  // Load user data from Zustand store (authStorage)
  React.useEffect(() => {
    // Try to get from Zustand persist storage first
    try {
      const authStorage = localStorage.getItem('authStorage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        const storedUser = parsed?.state?.user;

        if (storedUser) {
          const fullName = storedUser.fullname || storedUser.fullName || storedUser.username || "User";
          const email = storedUser.email || "";

          setUser({
            name: fullName,
            email: email,
            avatar: "", // No image URL, will use AvatarFallback with initials
          });
          return;
        }
      }
    } catch {
      // Ignore parse errors
    }

    // Fallback to old authUser key for backward compatibility
    const userData = getAuthUser<{
      user_id?: number;
      fullName?: string;
      username?: string;
      email?: string;
    }>();

    if (userData) {
      const fullName = userData.fullName || userData.username || "User";
      const email = userData.email || "";

      setUser({
        name: fullName,
        email: email,
        avatar: "", // No image URL, will use AvatarFallback with initials
      });
    }
  }, []);

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
        {/* Quick Create - Sticky in Header */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              variant="plain"
              tooltip={translate("quickCreate")}
              className="h-10 justify-center text-base font-semibold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
            >
              <Link href={`/quick-create`}>
                <IconPlus className="flex-shrink-0" />
                <HideOnCollapse>
                  <span>{translate("quickCreate")}</span>
                </HideOnCollapse>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
        <HideOnCollapse>
          <UpgradeCard t={translate} />
        </HideOnCollapse>
        <NavUser user={user} t={translate} />
      </SidebarFooter>
    </Sidebar>
  );
}

