"use client"

import * as React from "react"
import { Globe, SearchIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/components/language-provider"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { CommandDialog, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command"
import Link from "next/link"
import ThemeToggleButton from "@/components/theme-toggle-button"

// Dropdown theme control replaced by a single button toggle

export function TopBar({ children }: { children?: React.ReactNode }) {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])
  return (
    <header className="sticky top-0 z-10 border-b bg-background flex h-16 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      {children}
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:block">
          <button onClick={() => setOpen(true)} className="w-full">
            <div className="w-[260px]">
              <InputGroup>
                <InputGroupInput placeholder={t("searchPlaceholder") || "Search..."} readOnly />
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </button>
        </div>
        <div className="hidden md:flex">
          <Select value={lang} onValueChange={(v) => setLang(v as "en" | "id")}>
            <SelectTrigger className="w-44">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <SelectValue placeholder="Language" />
              </div>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="id">Indonesia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ThemeToggleButton />
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
          <CommandInput placeholder={t("commandSearchPlaceholder") || "Type a command or search..."} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigate">
              <CommandItem onSelect={() => { setOpen(false) }} asChild>
                <Link href="/dashboard">Dashboard</Link>
              </CommandItem>
              <CommandItem onSelect={() => { setOpen(false) }} asChild>
                <Link href="/quick-create">Quick Create</Link>
              </CommandItem>
              <CommandItem onSelect={() => { setOpen(false) }} asChild>
                <Link href="/analytics">Analytics</Link>
              </CommandItem>
              <CommandItem onSelect={() => { setOpen(false) }} asChild>
                <Link href="/team">Team</Link>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </header>
  )
}

