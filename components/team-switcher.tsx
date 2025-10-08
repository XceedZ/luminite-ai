"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Activity, Airplay, Aperture, Archive, Award, Banknote, BarChart, Briefcase, Building2, Calendar, Cloud, Code, Database, Factory, Flame, Gem, Globe as GlobeIcon, Layers, Lightbulb, Monitor, Package, Rocket, Shield, ShoppingBag, Store, Terminal, Users } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-provider"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const { t } = useLanguage()
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])
  const [isOpen, setIsOpen] = React.useState(false)
  const [orgName, setOrgName] = React.useState("")
  const ICONS: React.ElementType[] = [
    Activity, Airplay, Aperture, Archive, Award, Banknote, BarChart,
    Briefcase, Building2, Calendar, Cloud, Code, Database, Factory,
    Flame, Gem, GlobeIcon, Layers, Lightbulb, Monitor, Package, Rocket,
    Shield, ShoppingBag, Store, Terminal, Users,
  ]
  const [selectedIcon, setSelectedIcon] = React.useState<React.ElementType>(ICONS[0])

  if (!activeTeam) {
    return null
  }

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
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              {t('organizations') || 'Organisasi'}
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <team.logo className="size-3.5 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onSelect={() => setIsOpen(true)}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">{t('addOrganization') || 'Tambah Organisasi'}</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>

    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('addOrganization') || 'Tambah Organisasi'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">{t('selectIcon') || 'Pilih ikon'}</p>
            <div className="grid grid-cols-6 gap-1.5">
              {ICONS.map((Icon, idx) => {
                const isSelected = selectedIcon === Icon
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`flex items-center justify-center h-10 w-10 rounded-md border ${isSelected ? 'border-primary ring-2 ring-primary/40' : ''}`}
                    onClick={() => setSelectedIcon(Icon)}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <label htmlFor="org-name" className="text-sm font-medium">{t('organizationName') || 'Nama Organisasi'}</label>
            <Input id="org-name" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder={t('organizationName') || 'Nama Organisasi'} className="mt-2" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>{t('cancel') || 'Batal'}</Button>
            <Button onClick={() => { setIsOpen(false) }}>{t('create') || 'Buat'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}


