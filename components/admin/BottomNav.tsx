"use client"

import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, ShoppingBag, Plus, Package, Megaphone } from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
]

export default function BottomNav() {
  const pathname = usePathname()
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <>
      {menuAbierto && (
        <div
          className="md:hidden fixed inset-0 z-20"
          onClick={() => setMenuAbierto(false)}
        >
          <div className="absolute bottom-20 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <a
              href="/admin/nuevo-pedido"
              className="flex items-center gap-3 px-5 py-3.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors border-b border-gray-50"
            >
              <ShoppingBag size={16} />
              Nuevo Pedido
            </a>
            <a
              href="/admin/nuevo-cliente"
              className="flex items-center gap-3 px-5 py-3.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors border-b border-gray-50"
            >
              <Users size={16} />
              Nuevo Cliente
            </a>
            <a
              href="/admin/productos"
              className="flex items-center gap-3 px-5 py-3.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors border-b border-gray-50"
            >
              <Package size={16} />
              Productos
            </a>
            <a
              href="/admin/banners"
              className="flex items-center gap-3 px-5 py-3.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
            >
              <Megaphone size={16} />
              Banners
            </a>
          </div>
        </div>
      )}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-100 flex items-center justify-around px-2 pb-safe">
        {navItems.map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors ${
              pathname.startsWith(href)
                ? "text-pink-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Icon size={20} />
            <span className="text-xs">{label}</span>
          </a>
        ))}

        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors ${
            menuAbierto ? "text-pink-600" : "text-gray-400"
          }`}
        >
          <div className={`rounded-full p-1 transition-colors ${menuAbierto ? "bg-pink-500 text-white" : "bg-gray-100"}`}>
            <Plus size={18} />
          </div>
          <span className="text-xs">Nuevo</span>
        </button>
      </nav>
    </>
  )
}
