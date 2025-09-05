import type { Metadata } from "next";
import { findNavItemByHref } from "@/lib/nav-utils";
import QuickCreateClientUI from "./quick-create-client";
export const dynamic = 'force-dynamic';
// Fungsi untuk memuat dictionary berdasarkan locale
const getDictionary = async (lang: string) => {
  try {
    return await import(`@/app/locales/${lang}.json`).then((module) => module.default);
  } catch (error) {
    // Fallback ke bahasa Inggris jika locale tidak ditemukan
    return await import(`@/app/locales/en.json`).then((module) => module.default);
  }
};

type Props = {
  params: { lang: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const navItem = findNavItemByHref("quick-create");
  if (!navItem) {
    return { title: "Quick Create" };
  }
  return {
    title: navItem.title,
  };
}

export default async function QuickCreatePage({ params: { lang } }: Props) {
  const dictionary = await getDictionary(lang);

  // Meneruskan dictionary ke komponen klien sebagai prop
  return <QuickCreateClientUI dictionary={dictionary} />;
}