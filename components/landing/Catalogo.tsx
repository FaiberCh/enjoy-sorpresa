"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingBag } from "lucide-react"
import { productosEjemplo, categoriasEjemplo, formatPrecio } from "@/lib/data"

export default function Catalogo() {
  const [categoria, setCategoria] = useState("Todos")

  const filtrados =
    categoria === "Todos"
      ? productosEjemplo
      : productosEjemplo.filter((p) => p.categoria === categoria)

  const handlePedir = (nombreProducto: string) => {
    const mensaje = encodeURIComponent(
      `Hola! Me interesa el producto: *${nombreProducto}*. ¿Podría darme más información?`
    )
    window.open(`https://wa.me/573506182545?text=${mensaje}`, "_blank")
  }

  return (
    <section id="catalogo" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Nuestro <span className="text-pink-500">Catálogo</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Cada detalle es elaborado con amor y personalizado especialmente para ti.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {categoriasEjemplo.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                categoria === cat
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map((producto) => (
            <div
              key={producto.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="relative h-52 w-full">
                <Image
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                  {producto.categoria}
                </span>
                <h3 className="font-semibold text-gray-800 mt-2 mb-1">
                  {producto.nombre}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {producto.descripcion}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-pink-600 font-bold text-lg">
                    {formatPrecio(producto.precio)}
                  </span>
                  <button
                    onClick={() => handlePedir(producto.nombre)}
                    className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2 rounded-full transition-colors"
                  >
                    <ShoppingBag size={14} />
                    Pedir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
