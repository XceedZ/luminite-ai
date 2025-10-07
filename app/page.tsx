import { redirect } from "next/navigation"

/**
 * Komponen ini berfungsi sebagai titik masuk utama aplikasi (root page).
 * Tugasnya hanya satu: mengalihkan pengguna secara permanen
 * ke halaman dashboard dengan bahasa default 'en'.
 */
export default function RootPage() {
  redirect("/dashboard")
}
