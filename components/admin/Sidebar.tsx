"use client"

import { useRouter, usePathname } from "next/navigation"
import { LayoutDashboard, Users, ShoppingBag, LogOut, PlusCircle, UserPlus } from "lucide-react"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/nuevo-pedido", label: "Nuevo Pedido", icon: PlusCircle },
  { href: "/admin/nuevo-cliente", label: "Nuevo Cliente", icon: UserPlus },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" })
    router.push("/admin")
  }

  return (
    <aside className="hidden md:flex w-56 min-h-screen bg-white border-r border-gray-100 flex-col">
      <div className="p-5 border-b border-gray-100">
        <img src="/logo.webp" alt="En Joy Sorpresa" className="h-10 w-auto mb-1" />
        <p className="text-xs text-gray-400">Administración</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
              pathname.startsWith(href)
                ? "bg-pink-50 text-pink-600 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Icon size={16} />
            {label}
          </a>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors w-full"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
