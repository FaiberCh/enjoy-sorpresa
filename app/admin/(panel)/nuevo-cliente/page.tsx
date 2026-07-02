"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, AlertTriangle } from "lucide-react"
import { apiPost } from "@/lib/admin/api"

export default function NuevoClientePage() {
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
      email: form.get("email") || null,
      estado_lead: form.get("estado_lead"),
      acepta_promociones: form.get("acepta_promociones") === "on",
    }

    try {
      await apiPost("/api/clientes", data)
      setGuardado(true)
      setTimeout(() => router.push("/admin/clientes"), 1500)
    } catch {
      setFormError("No se pudo guardar el cliente. Revisa tu conexión e intenta de nuevo.")
      setLoading(false)
    }
  }

  if (guardado) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <CheckCircle size={48} className="text-pink-500 mb-3" />
        <p className="text-lg font-semibold text-gray-800">Cliente registrado correctamente</p>
        <p className="text-gray-400 text-sm">Redirigiendo...</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Registrar Nuevo Cliente</h1>
      <p className="text-gray-500 text-sm mb-8">
        Registra contactos que llegaron por WhatsApp, redes sociales o de forma presencial sin que hayan hecho un pedido aún.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input name="nombre" required placeholder="Nombre completo"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado inicial</label>
          <select name="estado_lead"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-white">
            <option value="interesado">Interesado</option>
            <option value="en_negociacion">En negociación</option>
            <option value="compro">Compró</option>
            <option value="no_compro">No compró</option>
          </select>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="acepta_promociones" className="accent-pink-500" />
          <span className="text-sm text-gray-600">Acepta recibir promociones</span>
        </label>

        {formError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />{formError}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white py-3 rounded-full font-medium transition-colors">
          {loading ? "Guardando..." : "Guardar Cliente"}
        </button>
      </form>
    </div>
  )
}
