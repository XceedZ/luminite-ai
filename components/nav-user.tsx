"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

// --- SVG Icons (menggantikan @tabler/icons-react) ---

const IconUserCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
  </svg>
)

const IconCreditCard = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
)

const IconNotification = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)
const IconHistory = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 3v5h5" />
    <path d="M3.05 13A9 9 0 1 0 7 4.6L3 8" />
    <path d="M12 7v5l4 2" />
  </svg>
)


const IconLogout = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const IconDotsVertical = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  )

// --- Komponen Utama ---

export function NavUser({
  user,
  t = (key: string) => key, // Menambahkan fallback default untuk fungsi 't'
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
  t?: (key: string) => string // 't' sekarang bersifat opsional
}) {
  const { isMobile } = useSidebar()
  const { lang, setLang } = useLanguage()
  const [isChangelogOpen, setIsChangelogOpen] = React.useState(false)

  return (
    <>
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <div className="md:hidden px-1 py-1.5">
                <Select value={lang} onValueChange={(v) => setLang(v as any)}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <SelectValue placeholder="Language" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="id">Indonesia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DropdownMenuItem>
                <IconUserCircle className="mr-2 h-4 w-4" />
                <span>{t("account")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard className="mr-2 h-4 w-4" />
                <span>{t("billing")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification className="mr-2 h-4 w-4" />
                <span>{t("notifications")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setIsChangelogOpen(true)}>
                <IconHistory className="mr-2 h-4 w-4" />
                <span>{t("changelog")}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconLogout className="mr-2 h-4 w-4" />
              <span>{t("logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
    <Dialog open={isChangelogOpen} onOpenChange={setIsChangelogOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("changelog")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-8">
          <section className="rounded-lg border p-5 bg-muted/30">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Version 1.3.0</h3>
              <Badge variant="secondary">{t("latest")}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{t("changelog130Date")}</p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-sm">
              <li>Added billing page with plan usage bars and payment method.</li>
              <li>New pricing page with Free, Pro and Enterprise plans.</li>
              <li>Improved tabs styling and icon support across settings.</li>
              <li>Dynamic breadcrumbs no longer prepend Dashboard incorrectly.</li>
            </ul>
          </section>
          <section className="rounded-lg border p-5 bg-muted/30">
            <h3 className="text-lg font-semibold">Version 1.2.9</h3>
            <p className="text-xs text-muted-foreground mt-1">{t("changelog129Date")}</p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-sm">
              <li>Context selector added in quick create input.</li>
              <li>File uploads now show preview with remove action.</li>
              <li>Type safety improvements for AI icon map and messages.</li>
              <li>Fixed build error from cookies API and model icons.</li>
            </ul>
          </section>
          <section className="rounded-lg border p-5 bg-muted/30">
            <h3 className="text-lg font-semibold">Version 1.2.8</h3>
            <p className="text-xs text-muted-foreground mt-1">{t("changelog128Date")}</p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-sm">
              <li>Improved scrolling and layout stability in chat pages.</li>
              <li>Accessibility tweaks for buttons and menu items.</li>
              <li>Minor UI polish on dropdowns and separators.</li>
              <li>General performance and reliability fixes.</li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}

