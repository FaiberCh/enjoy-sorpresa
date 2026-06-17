"use client"

import { useRouter } from "next/navigation"
import { Heart, LogOut } from "lucide-react"

export default function MobileHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" })
    router.push("/admin")
  }

  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <Heart className="text-pink-500 fill-pink-500" size={18} />
        <span className="text-base font-bold text-pink-600">En Joy</span>
        <span className="text-xs text-gray-400">Admin</span>
      </div>
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
