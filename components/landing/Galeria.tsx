"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { galeriaEjemplo } from "@/lib/data"

export default function Galeria() {
  const [seleccionada, setSeleccionada] = useState<string | null>(null)

  return (
    <section id="galeria" className="py-20 bg-pink-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Nuestra <span className="text-pink-500">Galería</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Momentos que hemos hecho especiales. Cada creación es única y hecha con amor.
          </p>
        </div>

        <div className="columns-2 sm:columns-3 gap-4 space-y-4">
          {galeriaEjemplo.map((url, i) => (
            <div
              key={i}
              className="break-inside-avoid rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSeleccionada(url)}
            >
              <div className="relative w-full" style={{ paddingBottom: i % 3 === 0 ? "130%" : "80%" }}>
                <Image
                  src={url}
                  alt={`Foto galería ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://www.instagram.com/enjoysorpresa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-pink-400 text-pink-600 hover:bg-pink-500 hover:text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            Ver más en Instagram
          </a>
        </div>
      </div>

      {seleccionada && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSeleccionada(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-pink-300"
            onClick={() => setSeleccionada(null)}
          >
            <X size={32} />
          </button>
          <div className="relative w-full max-w-2xl h-[80vh]">
            <Image
              src={seleccionada}
              alt="Foto ampliada"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  )
}
