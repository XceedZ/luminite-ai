import {
  IconChartBar,
  IconHome2,
  IconSwitchHorizontal,
  IconReport,
  IconBulb,
  IconBooks,
  IconSettings,
  IconUsers,
  IconPlus,
  // Ikon yang ditambahkan
  IconBlocks,
  IconMessage,
  IconRobot,
  // Ikon yang sudah ada
  type Icon,
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
  hidden?: boolean // [PERUBAHAN] Tambahkan properti opsional `hidden`
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
    name: "quickCreate",
    title: "Quick Create", // Ini akan menjadi judul metadata & breadcrumb
    href: "quick-create",
    icon: IconPlus, // Gunakan ikon yang sesuai
    hidden: true, // [PERUBAHAN] Item ini sekarang akan disembunyikan dari menu
  },
  // ✅ PERUBAHAN DI SINI
  {
    name: "playground",
    title: "Playground",
    href: "playground",
    icon: IconBlocks, // Ikon diubah
    items: [
      {
        name: "generalChat",
        title: "General Chat",
        href: "playground/general-chat",
        icon: IconMessage, // Ikon untuk submenu
      },
      {
        name: "waifuAI",
        title: "Waifu AI",
        href: "playground/waifu-ai",
        icon: IconRobot, // Ikon untuk submenu
      },
    ],
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
export const dataNav: NavItem[] = [
  // Menu yang tidak bisa di-expand
  {
    name: "transactions",
    title: "Transactions",
    href: "transactions",
    icon: IconSwitchHorizontal,
  },
  {
    name: "reports",
    title: "Reports",
    href: "reports",
    icon: IconReport,
  },
  {
    name: "insights",
    title: "Insights",
    href: "insights",
    icon: IconBulb,
  },
  // Menu yang bisa di-expand
  {
    name: "library",
    title: "Library",
    href: "library",
    icon: IconBooks,
    items: [
      {
        name: "prompts",
        title: "Prompts",
        href: "library/prompts",
        icon: IconFileAi,
      },
      {
        name: "proposal",
        title: "Proposal",
        href: "library/proposal",
        icon: IconFileDescription,
      },
      {
        name: "capture",
        title: "Capture",
        href: "library/capture",
        icon: IconCamera,
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