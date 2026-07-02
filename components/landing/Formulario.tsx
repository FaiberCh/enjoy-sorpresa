"use client"

import { useEffect, useRef } from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Send, CheckCircle, AlertTriangle } from "lucide-react"
import { FormularioPedidoData } from "@/types"
import { productosEjemplo } from "@/lib/data"
import { COLOMBIA, DEPARTAMENTOS } from "@/lib/colombia"

type FormData = FormularioPedidoData & { departamento: string }

const schema = z.object({
  nombre: z.string().min(2, "Ingresa tu nombre completo"),
  whatsapp: z.string().min(10, "Ingresa un número válido").max(15),
  departamento: z.string().min(1, "Selecciona un departamento"),
  ciudad: z.string().min(1, "Selecciona tu ciudad"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  producto_interes: z.string().min(1, "Selecciona un producto"),
  descripcion: z.string().min(10, "Cuéntanos más sobre tu pedido"),
  fecha_evento: z.string().optional(),
  acepta_promociones: z.boolean(),
  acepta_datos: z.boolean().refine((v) => v === true, {
    message: "Debes aceptar el tratamiento de datos",
  }),
})

export default function Formulario() {
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const successHeadingRef = useRef<HTMLHeadingElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { acepta_promociones: true, acepta_datos: false },
  })

  const departamento = watch("departamento")
  const ciudadesDisponibles = departamento ? (COLOMBIA[departamento] ?? []) : []

  useEffect(() => {
    setValue("ciudad", "")
  }, [departamento, setValue])

  useEffect(() => {
    if (enviado) successHeadingRef.current?.focus()
  }, [enviado])

  const onSubmit = async (data: FormData) => {
    setEnviando(true)
    setSubmitError("")
    try {
      const { departamento: depto, ...rest } = data
      const payload = { ...rest, ciudad: `${data.ciudad}, ${depto}` }

      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Error al enviar")

      setEnviado(true)
      reset()

      const mensaje = encodeURIComponent(
        `Hola! Soy *${data.nombre}* de *${data.ciudad}, ${depto}*.\n\nMe interesa: *${data.producto_interes}*\n\n${data.descripcion}${data.fecha_evento ? `\n\nFecha del evento: ${data.fecha_evento}` : ""}`
      )
      window.open(`https://wa.me/573506182545?text=${mensaje}`, "_blank")
    } catch {
      setSubmitError("No se pudo enviar tu pedido. Revisa tu conexión e intenta de nuevo.")
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <section id="pedido" className="py-20 bg-white">
        <div className="max-w-xl mx-auto px-4 text-center" role="status">
          <CheckCircle size={64} className="text-pink-500 mx-auto mb-4" aria-hidden="true" />
          <h2 ref={successHeadingRef} tabIndex={-1} className="text-3xl font-bold text-gray-800 mb-3 focus:outline-none">
            ¡Pedido Recibido!
          </h2>
          <p className="text-gray-600 mb-6">
            Te hemos abierto WhatsApp para que puedas continuar la conversación con nosotros.
          </p>
          <button
            onClick={() => setEnviado(false)}
            className="text-pink-600 underline text-sm"
          >
            Hacer otro pedido
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="pedido" className="py-20 bg-white">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl shadow-pink-100 border border-pink-50 px-8 py-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Haz tu <span className="text-pink-500">Pedido</span>
          </h2>
          <p className="text-gray-500">
            Completa el formulario y te contactaremos por WhatsApp para coordinar los detalles.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* Nombre y WhatsApp */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="pedido-nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo *
              </label>
              <input
                id="pedido-nombre"
                {...register("nombre")}
                placeholder="Tu nombre"
                required
                aria-invalid={!!errors.nombre}
                aria-describedby={errors.nombre ? "pedido-nombre-error" : undefined}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200"
              />
              {errors.nombre && (
                <p id="pedido-nombre-error" role="alert" className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="pedido-whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp *
              </label>
              <input
                id="pedido-whatsapp"
                {...register("whatsapp")}
                placeholder="3001234567"
                required
                aria-invalid={!!errors.whatsapp}
                aria-describedby={errors.whatsapp ? "pedido-whatsapp-error" : undefined}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200"
              />
              {errors.whatsapp && (
                <p id="pedido-whatsapp-error" role="alert" className="text-red-500 text-xs mt-1">{errors.whatsapp.message}</p>
              )}
            </div>
          </div>

          {/* Departamento y Ciudad en cascada */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="pedido-departamento" className="block text-sm font-medium text-gray-700 mb-1">
                Departamento *
              </label>
              <select
                id="pedido-departamento"
                {...register("departamento")}
                required
                aria-invalid={!!errors.departamento}
                aria-describedby={errors.departamento ? "pedido-departamento-error" : undefined}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 bg-white"
              >
                <option value="">Selecciona un departamento</option>
                {DEPARTAMENTOS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.departamento && (
                <p id="pedido-departamento-error" role="alert" className="text-red-500 text-xs mt-1">{errors.departamento.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="pedido-ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad *
              </label>
              <select
                id="pedido-ciudad"
                {...register("ciudad")}
                disabled={!departamento}
                required
                aria-invalid={!!errors.ciudad}
                aria-describedby={errors.ciudad ? "pedido-ciudad-error" : undefined}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <option value="">
                  {departamento ? "Selecciona tu ciudad" : "Primero selecciona un departamento"}
                </option>
                {ciudadesDisponibles.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.ciudad && (
                <p id="pedido-ciudad-error" role="alert" className="text-red-500 text-xs mt-1">{errors.ciudad.message}</p>
              )}
            </div>
          </div>

          {/* Email y Fecha */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="pedido-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email (opcional)
              </label>
              <input
                id="pedido-email"
                {...register("email")}
                placeholder="tu@email.com"
                type="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "pedido-email-error" : undefined}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200"
              />
              {errors.email && (
                <p id="pedido-email-error" role="alert" className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="pedido-fecha" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha del evento (opcional)
              </label>
              <input
                id="pedido-fecha"
                {...register("fecha_evento")}
                type="date"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200"
              />
            </div>
          </div>

          <div>
            <label htmlFor="pedido-producto" className="block text-sm font-medium text-gray-700 mb-1">
              Producto de interés *
            </label>
            <select
              id="pedido-producto"
              {...register("producto_interes")}
              required
              aria-invalid={!!errors.producto_interes}
              aria-describedby={errors.producto_interes ? "pedido-producto-error" : undefined}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 bg-white"
            >
              <option value="">Selecciona un producto</option>
              {productosEjemplo.map((p) => (
                <option key={p.id} value={p.nombre}>
                  {p.nombre}
                </option>
              ))}
              <option value="Otro">Otro / Personalizado</option>
            </select>
            {errors.producto_interes && (
              <p id="pedido-producto-error" role="alert" className="text-red-500 text-xs mt-1">{errors.producto_interes.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="pedido-descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Cuéntanos sobre tu pedido *
            </label>
            <textarea
              id="pedido-descripcion"
              {...register("descripcion")}
              rows={4}
              placeholder="¿Para qué ocasión es? ¿Tienes colores o temas preferidos? ¿Algún detalle especial?"
              required
              aria-invalid={!!errors.descripcion}
              aria-describedby={errors.descripcion ? "pedido-descripcion-error" : undefined}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 resize-none"
            />
            {errors.descripcion && (
              <p id="pedido-descripcion-error" role="alert" className="text-red-500 text-xs mt-1">{errors.descripcion.message}</p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("acepta_promociones")}
                className="mt-0.5 accent-pink-500"
              />
              <span className="text-sm text-gray-600">
                Deseo recibir información sobre promociones y novedades de En Joy Sorpresa.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("acepta_datos")}
                required
                aria-invalid={!!errors.acepta_datos}
                aria-describedby={errors.acepta_datos ? "pedido-acepta-datos-error" : undefined}
                className="mt-0.5 accent-pink-500"
              />
              <span className="text-sm text-gray-600">
                Autorizo el tratamiento de mis datos personales conforme a la{" "}
                <strong>Ley 1581 de 2012</strong> de protección de datos de Colombia. *
              </span>
            </label>
            {errors.acepta_datos && (
              <p id="pedido-acepta-datos-error" role="alert" className="text-red-500 text-xs">{errors.acepta_datos.message}</p>
            )}
          </div>

          {submitError && (
            <div role="alert" className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />{submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white py-4 rounded-full font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Send size={18} aria-hidden="true" />
            {enviando ? "Enviando..." : "Enviar Pedido por WhatsApp"}
          </button>
        </form>
        </div>
      </div>
    </section>
  )
}
