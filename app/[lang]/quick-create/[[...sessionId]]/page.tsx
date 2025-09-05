import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { findNavItemByHref } from "@/lib/nav-utils";
import QuickCreateClientUI from "./quick-create-client";

// Pastikan halaman ini selalu dinamis untuk mencerminkan data terbaru
export const dynamic = 'force-dynamic';

type Props = {
  params: {
    lang: string;
    // 'sessionId' adalah array string opsional karena nama folder [[...sessionId]]
    sessionId?: string[]; 
  };
};

/**
 * Fungsi ini membuat metadata halaman (seperti judul tab browser)
 * secara dinamis berdasarkan item navigasi.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Kita menggunakan 'quick-create' sebagai href statis untuk menemukan judul yang benar
  const navItem = findNavItemByHref("quick-create");
  if (!navItem) {
    return { title: "Quick Create" };
  }
  return {
    title: navItem.title,
  };
}

/**
 * Ini adalah Halaman Server dinamis yang menangani:
 * - /quick-create (obrolan baru, params.sessionId akan undefined)
 * - /quick-create/[id] (memuat obrolan yang ada)
 */
export default async function QuickCreatePage({ params }: Props) {
  const dictionary = await getDictionary(params.lang);
  
  // Ekstrak ID sesi dari parameter URL.
  const sessionId = params.sessionId?.[0];

  // Teruskan dictionary dan sessionId ke komponen klien Anda
  return <QuickCreateClientUI dictionary={dictionary} sessionId={sessionId} />;
}

