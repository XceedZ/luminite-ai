"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Impor yang diperlukan untuk logika breadcrumb
import { dataNav, mainNav, secondaryNav, type NavItem } from "@/config/nav";
// [PERBAIKAN] Impor fungsi yang benar: getChatSession (singular)
import { getChatSession } from '@/lib/actions/ai';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Props = {
  dictionary: { [key: string]: string };
};

// Gabungkan semua item navigasi agar lebih mudah dicari
const allNavItems: NavItem[] = [];
mainNav.forEach(item => {
    allNavItems.push(item);
    if (item.items) allNavItems.push(...item.items);
});
dataNav.forEach(item => {
    allNavItems.push(item);
    if (item.items) allNavItems.push(...item.items);
});
secondaryNav.forEach(item => {
    allNavItems.push(item);
    if (item.items) allNavItems.push(...item.items);
});

// Fungsi helper untuk mencari item navigasi berdasarkan path-nya
function findNavItem(path: string, navItems: NavItem[]): NavItem | null {
  for (const item of navItems) {
    if (item.href === path) { // Cocokkan href dari config
      return item;
    }
  }
  return null;
}

/**
 * Komponen ini adalah Client Component yang secara dinamis
 * membangun breadcrumb, termasuk mengambil judul obrolan jika perlu.
 */
export function DynamicBreadcrumbs({ dictionary }: Props) {
  const t = (key: string) => dictionary[key] || key;
  
  const pathname = usePathname();
  const [sessionTitle, setSessionTitle] = React.useState<string | null>(null);

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length <= 1) {
    return null;
  }
  
  const lang = segments[0];
  const pathSegments = segments.slice(1);

  const isChatHistoryPage = pathSegments[0] === 'quick-create' && pathSegments.length > 1;
  const sessionId = isChatHistoryPage ? pathSegments[1] : null;

  React.useEffect(() => {
    setSessionTitle(null);

    if (sessionId) {
      const fetchTitle = async () => {
        // [PERBAIKAN] Panggil fungsi yang benar: getChatSession (singular)
        const session = await getChatSession(sessionId);
        if (session) {
          // Sekarang 'session' adalah objek tunggal, bukan array, jadi .title akan berfungsi
          setSessionTitle(session.title);
        }
      };
      
      fetchTitle();
    }
  }, [sessionId]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/${lang}/dashboard`}>{t("dashboard")}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathSegments.map((segment, index) => {
          const pathWithoutLang = pathSegments.slice(0, index + 1).join("/");
          const fullPathWithLang = `/${lang}/${pathWithoutLang}`;
          const isLast = index === pathSegments.length - 1;

          const navItem = findNavItem(pathWithoutLang, allNavItems);
          
          let title = navItem
            ? t(navItem.name)
            : segment.charAt(0).toUpperCase() + segment.slice(1);

          if (isLast && sessionId && sessionTitle) {
            title = sessionTitle;
          }

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
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

