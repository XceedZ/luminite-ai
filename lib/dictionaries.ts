import "server-only"

// Impor file-file JSON Anda
import en from "@/app/locales/en.json"
import id from "@/app/locales/id.json"

// Petakan kode bahasa ke file JSON yang sesuai
const dictionaries = {
  en,
  id,
}

/**
 * Mendapatkan objek kamus (translasi) berdasarkan kode bahasa.
 * @param lang Kode bahasa (misalnya, 'en' atau 'id').
 * @returns Objek kamus yang sesuai. Jika bahasa tidak ditemukan, akan kembali ke bahasa Inggris.
 */
export const getDictionary = (lang: string) => {
  return dictionaries[lang as keyof typeof dictionaries] || dictionaries.en
}
