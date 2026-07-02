"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, AlertTriangle } from "lucide-react"
import { productosEjemplo } from "@/lib/data"
import { apiPost } from "@/lib/admin/api"

export default function NuevoPedidoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const [formError, setFormError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setFormError("")

    const form = new FormData(e.currentTarget)
    const data = {
      nombre: form.get("nombre"),
      whatsapp: form.get("whatsapp"),
      ciudad: form.get("ciudad"),
      email: form.get("email"),
      producto_interes: form.get("producto_interes"),
      descripcion: form.get("descripcion"),
      fecha_evento: form.get("fecha_evento"),
      origen: form.get("origen"),
      acepta_promociones: false,
      acepta_datos: true,
    }

    try {
      await apiPost("/api/pedidos", data)
      setGuardado(true)
      setTimeout(() => router.push("/admin/pedidos"), 1500)
    } catch {
      setFormError("No se pudo guardar el pedido. Revisa tu conexión e intenta de nuevo.")
      setLoading(false)
    }
  }

  if (guardado) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <CheckCircle size={48} className="text-pink-500 mb-3" />
        <p className="text-lg font-semibold text-gray-800">Pedido registrado correctamente</p>
        <p className="text-gray-400 text-sm">Redirigiendo...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Registrar Nuevo Pedido</h1>
      <p className="text-gray-500 text-sm mb-8">
        Usa este formulario para registrar pedidos que llegaron por WhatsApp, llamada o de forma presencial.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input name="nombre" required placeholder="Nombre del cliente"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp *</label>
            <input name="whatsapp" required placeholder="3001234567"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
            <input name="ciudad" required placeholder="Ciudad"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" placeholder="email@ejemplo.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Producto *</label>
            <select name="producto_interes" required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-white">
              <option value="">Selecciona...</option>
              {productosEjemplo.map((p) => (
                <option key={p.id} value={p.nombre}>{p.nombre}</option>
              ))}
              <option value="Otro">Otro / Personalizado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Canal de entrada</label>
            <select name="origen"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-white">
              <option value="whatsapp">WhatsApp</option>
              <option value="presencial">Presencial</option>
              <option value="web">Web</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del pedido *</label>
          <textarea name="descripcion" required rows={3} placeholder="Detalles del pedido..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha del evento</label>
          <input name="fecha_evento" type="date"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400" />
        </div>

        {formError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />{formError}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white py-3 rounded-full font-medium transition-colors">
          {loading ? "Guardando..." : "Guardar Pedido"}
        </button>
      </form>
    </div>
  )
}
