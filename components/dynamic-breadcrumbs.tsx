"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';

// Impor yang diperlukan untuk logika breadcrumb
import { dataNav, mainNav, secondaryNav, type NavItem } from "@/config/nav";
import { getChatSession } from '@/lib/actions/ai';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Props = {};

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
export function DynamicBreadcrumbs({}: Props) {
  const { t } = useLanguage();
  
  const pathname = usePathname();
  const [sessionTitle, setSessionTitle] = React.useState<string | null>(null);

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length < 1) {
    return null;
  }
  const pathSegments = segments;

  // If first segment is quick-create, suppress the leading dashboard crumb
  const showHomeCrumb = pathSegments[0] !== 'quick-create';

  const isChatHistoryPage = pathSegments[0] === 'quick-create' && pathSegments.length > 1;
  const sessionId = isChatHistoryPage ? pathSegments[1] : null;

  React.useEffect(() => {
    setSessionTitle(null);

    if (sessionId) {
      const fetchTitle = async () => {
        const session = await getChatSession(sessionId);
        if (session) {
          setSessionTitle(session.title);
        }
      };
      
      fetchTitle();
    }
  }, [sessionId]);

  return (
    <Breadcrumb className="w-full">
      {/* [MODIFIKASI] Tambahkan max-w-full dan overflow-hidden untuk memastikan pembatasan bekerja */}
      <BreadcrumbList className="max-w-full overflow-hidden">
        {showHomeCrumb && (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/dashboard`}>{t("dashboard")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}

        {pathSegments.map((segment, index) => {
          const fullPath = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;

          const navItem = findNavItem(pathSegments.slice(0, index + 1).join("/"), allNavItems);
          
          let title = navItem
            ? t(navItem.name)
            : segment.charAt(0).toUpperCase() + segment.slice(1);

          if (isLast && sessionId && sessionTitle) {
            title = sessionTitle;
          }

          return (
            <React.Fragment key={fullPath}>
              {(showHomeCrumb || index > 0) && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  // [MODIFIKASI] Tambahkan kelas 'truncate' di sini
                  <BreadcrumbPage className="truncate max-w-[50vw] md:max-w-full">
                    {title}
                  </BreadcrumbPage>
                ) : (
                  // [MODIFIKASI] Tambahkan kelas 'truncate' di sini
                  <BreadcrumbLink asChild className="truncate max-w-[60vw] md:max-w-full">
                    <Link href={fullPath}>{title}</Link>
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