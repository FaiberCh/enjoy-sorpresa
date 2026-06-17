"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MessageCircle, ArrowLeft, ShoppingBag } from "lucide-react"
import { Cliente, Pedido, EstadoLead, EstadoPedido } from "@/types"

const estadoLeadColors: Record<EstadoLead, string> = {
  interesado: "bg-blue-100 text-blue-700",
  en_negociacion: "bg-purple-100 text-purple-700",
  compro: "bg-green-100 text-green-700",
  no_compro: "bg-red-100 text-red-700",
  inactivo: "bg-gray-100 text-gray-500",
}

const estadoPedidoColors: Record<EstadoPedido, string> = {
  pendiente: "bg-yellow-100 text-yellow-700",
  en_proceso: "bg-blue-100 text-blue-700",
  entregado: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
}

const estadoLeadOpciones: EstadoLead[] = ["interesado", "en_negociacion", "compro", "no_compro", "inactivo"]

export default function ClienteDetallePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    const res = await fetch(`/api/clientes/${id}`)
    if (!res.ok) { router.push("/admin/clientes"); return }
    const data = await res.json()
    setCliente(data.cliente)
    setPedidos(data.pedidos)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [id])

  const cambiarEstado = async (estado_lead: EstadoLead) => {
    await fetch("/api/clientes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, estado_lead }),
    })
    fetchData()
  }

  if (loading) return <p className="text-gray-400 text-sm">Cargando...</p>
  if (!cliente) return null

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => router.push("/admin/clientes")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-pink-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Volver a Clientes
      </button>

      {/* Perfil del cliente */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">{cliente.nombre}</h1>
            <p className="text-gray-500 text-sm">{cliente.ciudad}</p>
            {cliente.email && <p className="text-gray-400 text-sm">{cliente.email}</p>}
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${cliente.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-full transition-colors"
            >
              <MessageCircle size={14} />
              {cliente.whatsapp}
            </a>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-gray-100 grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400 mb-1">Estado</p>
            <select
              value={cliente.estado_lead}
              onChange={(e) => cambiarEstado(e.target.value as EstadoLead)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium border-0 cursor-pointer focus:outline-none ${estadoLeadColors[cliente.estado_lead]}`}
            >
              {estadoLeadOpciones.map((op) => (
                <option key={op} value={op}>{op.replace("_", " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Total pedidos</p>
            <div className="flex items-center gap-2">
              <ShoppingBag size={14} className="text-pink-500" />
              <span className="font-semibold text-gray-800">{pedidos.length}</span>
            </div>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Acepta promociones</p>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${cliente.acepta_promociones ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {cliente.acepta_promociones ? "Sí" : "No"}
            </span>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-400">
          Cliente desde {new Date(cliente.created_at).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Historial de pedidos */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Historial de Pedidos</h2>

      {pedidos.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
          <p className="text-gray-400 text-sm">Este cliente no tiene pedidos registrados.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pedidos.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium text-pink-600">{p.producto_interes}</p>
                  <p className="text-gray-500 text-sm mt-1">{p.descripcion}</p>
                  {p.notas && (
                    <p className="text-xs text-gray-400 mt-2 bg-gray-50 rounded-lg p-2">
                      Nota: {p.notas}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    {p.fecha_evento && (
                      <span className="text-xs text-gray-400">Evento: {p.fecha_evento}</span>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(p.created_at).toLocaleDateString("es-CO")}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {p.origen}
                    </span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${estadoPedidoColors[p.estado]}`}>
                  {p.estado.replace("_", " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
