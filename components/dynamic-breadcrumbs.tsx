"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cloudNav, mainNav, secondaryNav, type NavItem } from "@/config/nav"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Gabungkan semua item navigasi agar lebih mudah dicari
const allNavItems = [...mainNav, ...cloudNav, ...secondaryNav]

// Fungsi helper untuk mencari item navigasi secara rekursif berdasarkan path-nya
function findNavItem(path: string, navItems: NavItem[]): NavItem | null {
  for (const item of navItems) {
    // Cocokkan path URL (misal: /projects/active) dengan href dari config (misal: projects/active)
    if (`/${item.href}` === path) {
      return item
    }
    if (item.items) {
      const subItem = findNavItem(path, item.items)
      if (subItem) return subItem
    }
  }
  return null
}

export function DynamicBreadcrumbs({
  dictionary,
}: {
  dictionary: { [key: string]: string }
}) {
  const pathname = usePathname()

  // Buat fungsi translasi 't' dari kamus yang diterima
  const t = React.useCallback((key: string): string => dictionary[key] || key, [
    dictionary,
  ])

  // Contoh: /id/projects/active -> ['', 'id', 'projects', 'active']
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length <= 1) {
    return null // Jangan tampilkan apa pun di halaman root bahasa (misal: /id)
  }

  // Hapus segmen bahasa untuk membangun path (misal: ['projects', 'active'])
  const pathSegments = segments.slice(1)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {/* Tautan "Home" sekarang ditranslasikan menggunakan kunci 'dashboard' */}
          <BreadcrumbLink asChild>
            <Link href={`/${segments[0]}/dashboard`}>{t("dashboard")}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathSegments.map((segment, index) => {
          // Buat path relatif untuk pencarian (misal: /projects, lalu /projects/active)
          const pathWithoutLang = `/${pathSegments.slice(0, index + 1).join("/")}`
          const fullPathWithLang = `/${segments[0]}${pathWithoutLang}`
          const isLast = index === pathSegments.length - 1

          // Cari item navigasi untuk mendapatkan 'name' sebagai kunci translasi
          const navItem = findNavItem(pathWithoutLang, allNavItems)
          // Gunakan hasil translasi. Jika tidak ditemukan, gunakan segmen URL sebagai fallback.
          const title = navItem
            ? t(navItem.name)
            : segment.charAt(0).toUpperCase() + segment.slice(1)

          return (
            <React.Fragment key={fullPathWithLang}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={fullPathWithLang}>{title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

