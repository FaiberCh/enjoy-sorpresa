"use client"

import { useId, useState } from "react"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { apiPatch, ApiError } from "@/lib/admin/api"
import { inputCls, labelCls } from "@/lib/admin/form-styles"

export default function ConfiguracionPage() {
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [success, setSuccess] = useState(false)
  const errorId = useId()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError("")
    setSuccess(false)

    const form = new FormData(e.currentTarget)
    const currentPassword = String(form.get("currentPassword") ?? "")
    const newPassword = String(form.get("newPassword") ?? "")
    const confirmPassword = String(form.get("confirmPassword") ?? "")

    if (newPassword.length < 8) {
      setFormError("La nueva contraseña debe tener al menos 8 caracteres.")
      return
    }
    if (newPassword !== confirmPassword) {
      setFormError("Las contraseñas nuevas no coinciden.")
      return
    }

    setLoading(true)
    try {
      await apiPatch("/api/admin/password", { currentPassword, newPassword })
      setSuccess(true)
      e.currentTarget.reset()
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "No se pudo cambiar la contraseña. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Configuración</h1>
      <p className="text-gray-500 text-sm mb-8">
        Cambia la contraseña con la que inicias sesión en este panel.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
        <div>
          <label htmlFor="currentPassword" className={labelCls}>Contraseña actual</label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="newPassword" className={labelCls}>Nueva contraseña</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            aria-describedby={`${errorId}-hint`}
            className={inputCls}
          />
          <p id={`${errorId}-hint`} className="text-gray-400 text-xs mt-1">Mínimo 8 caracteres.</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className={labelCls}>Confirmar nueva contraseña</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            className={inputCls}
          />
        </div>

        {formError && (
          <div role="alert" className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />{formError}
          </div>
        )}

        {success && (
          <div role="status" className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
            <CheckCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />Contraseña actualizada correctamente.
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white py-3 rounded-full font-medium transition-colors"
        >
          {loading ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </form>
    </div>
  )
}
