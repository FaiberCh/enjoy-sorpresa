"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

export default function MobileHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" })
    router.push("/admin")
  }

  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
      <img src="/logo.webp" alt="En Joy Sorpresa" className="h-9 w-auto" />
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
      >
        <LogOut size={16} />
        Salir
      </button>
    </header>
  )
}
