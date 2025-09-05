import {
    IconChartBar,
    IconHome2,
    IconFolder,
    IconListDetails,
    IconSettings,
    IconUsers,
    type Icon,
    // Tambahkan ikon yang dibutuhkan untuk cloudNav
    IconCamera,
    IconFileDescription,
    IconFileAi,
  } from "@tabler/icons-react"
  
  // Tipe ini akan menjadi satu-satunya sumber kebenaran
  // dan akan digunakan di semua komponen navigasi.
  export type NavItem = {
    name: string
    title: string
    href: string
    icon: Icon // Menggunakan tipe 'Icon' yang lebih spesifik
    items?: NavItem[]
  }
  
  export const mainNav: NavItem[] = [
    {
      name: "dashboard",
      title: "Dashboard",
      href: "dashboard",
      icon: IconHome2,
    },
    {
      name: "lifecycle",
      title: "Lifecycle",
      href: "lifecycle",
      icon: IconListDetails,
    },
    {
      name: "analytics",
      title: "Analytics",
      href: "analytics",
      icon: IconChartBar,
    },
    {
      name: "team",
      title: "Team",
      href: "team",
      icon: IconUsers,
    },
  ]
  
  // Menambahkan kembali data untuk cloudNav
  export const cloudNav: NavItem[] = [
    {
      name: "capture",
      title: "Capture",
      href: "capture",
      icon: IconCamera,
      items: [
        {
          name: "active_proposals",
          title: "Active Proposals",
          href: "capture/active",
          icon: IconFolder, // Ikon bisa disesuaikan
        },
        {
          name: "archived",
          title: "Archived",
          href: "capture/archived",
          icon: IconFolder,
        },
      ],
    },
    {
      name: "proposal",
      title: "Proposal",
      href: "proposal",
      icon: IconFileDescription,
      items: [
        {
          name: "active_proposals",
          title: "Active Proposals",
          href: "proposal/active",
          icon: IconFolder,
        },
        {
          name: "archived",
          title: "Archived",
          href: "proposal/archived",
          icon: IconFolder,
        },
      ],
    },
    {
      name: "prompts",
      title: "Prompts",
      href: "prompts",
      icon: IconFileAi,
      items: [
        {
          name: "active_proposals",
          title: "Active Proposals",
          href: "prompts/active",
          icon: IconFolder,
        },
        {
          name: "archived",
          title: "Archived",
          href: "prompts/archived",
          icon: IconFolder,
        },
      ],
    },
  ]
  
  export const secondaryNav: NavItem[] = [
    {
      name: "settings",
      title: "Settings",
      href: "settings",
      icon: IconSettings,
    },
  ]
  
  