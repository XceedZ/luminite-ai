import { mainNav, dataNav, secondaryNav, type NavItem } from "@/config/nav"; // Sesuaikan path ke nav.ts Anda

// Gabungkan semua array navigasi menjadi satu untuk pencarian
const allNavItems: NavItem[] = [...mainNav, ...dataNav, ...secondaryNav];

/**
 * Fungsi rekursif untuk mencari NavItem berdasarkan href
 * @param items - Array NavItem untuk dicari
 * @param href - Path URL yang dicari
 * @returns NavItem yang cocok atau null
 */
function findItem(items: NavItem[], href: string): NavItem | null {
  for (const item of items) {
    // Cek path utama
    if (item.href === href) {
      return item;
    }
    // Jika ada submenu, cari di dalamnya
    if (item.items) {
      const found = findItem(item.items, href);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

/**
 * Mencari NavItem di semua daftar navigasi.
 * @param href - Path URL yang dicari
 * @returns NavItem yang cocok atau null
 */
export function findNavItemByHref(href: string): NavItem | null {
  return findItem(allNavItems, href);
}

/**
 * Membangun jejak breadcrumb dari path URL.
 * @param path - Path URL saat ini (misal: "dashboard/quick-create")
 * @returns Array dari NavItem yang membentuk breadcrumb
 */
export function buildBreadcrumbs(path: string): NavItem[] {
  const segments = path.split("/").filter(Boolean);
  const breadcrumbs: NavItem[] = [];

  let currentPath = "";
  for (const segment of segments) {
    currentPath += (currentPath ? "/" : "") + segment;
    const item = findNavItemByHref(currentPath);
    if (item) {
      breadcrumbs.push(item);
    } else {
      // Jika tidak ditemukan, buat item sementara agar breadcrumb tidak putus
      breadcrumbs.push({
        name: segment,
        title: segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " "),
        href: currentPath,
        icon: () => null, // Placeholder icon
      });
    }
  }
  return breadcrumbs;
}