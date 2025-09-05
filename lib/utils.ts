import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Menggabungkan beberapa nama kelas (class names) menjadi satu string.
 * Berguna untuk menerapkan kelas secara kondisional di komponen React.
 * @param inputs Daftar nama kelas.
 * @returns String nama kelas yang telah digabungkan.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
