"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { whatsappUrl } from "./WhatsAppButton"

const links = [
  { href: "#inicio", label: "Inicio" },
  { href: "#catalogo", label: "Catálogo" },
  { href: "#galeria", label: "Galería" },
  { href: "#pedido", label: "Hacer Pedido" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#inicio">
          <img src="/logo.webp" alt="En Joy Sorpresa" className="h-10 w-auto" />
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-gray-600 hover:text-pink-600 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2 rounded-full transition-colors"
          >
            WhatsApp
          </a>
        </nav>

        <button
          className="md:hidden text-gray-600"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-500 text-white text-center px-4 py-2 rounded-full"
          >
            WhatsApp
          </a>
        </div>
      )}
    </header>
  )
}
