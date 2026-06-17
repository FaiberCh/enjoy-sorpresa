"use client"

import { useEffect, useState } from "react"
import { MessageCircle, Search, ChevronDown, ChevronUp } from "lucide-react"
import { Pedido, EstadoPedido } from "@/types"

const estadoColors: Record<EstadoPedido, string> = {
  pendiente: "bg-yellow-100 text-yellow-700",
  en_proceso: "bg-blue-100 text-blue-700",
  entregado: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
}

const estadoOpciones: EstadoPedido[] = ["pendiente", "en_proceso", "entregado", "cancelado"]

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<EstadoPedido | "todos">("todos")
  const [expandido, setExpandido] = useState<string | null>(null)
  const [notaEditando, setNotaEditando] = useState<{ id: string; texto: string } | null>(null)

  const fetchPedidos = async () => {
    const res = await fetch("/api/pedidos")
    const data = await res.json()
    setPedidos(data)
    setLoading(false)
  }

  useEffect(() => { fetchPedidos() }, [])

  const cambiarEstado = async (id: string, estado: EstadoPedido) => {
    await fetch(`/api/pedidos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    })
    fetchPedidos()
  }

  const guardarNota = async (id: string, notas: string) => {
    await fetch(`/api/pedidos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notas }),
    })
    setNotaEditando(null)
    fetchPedidos()
  }

  const pedidosFiltrados = pedidos.filter((p) => {
    const coincideEstado = filtroEstado === "todos" || p.estado === filtroEstado
    const texto = busqueda.toLowerCase()
    const coincideBusqueda =
      !texto ||
      p.cliente?.nombre?.toLowerCase().includes(texto) ||
      p.producto_interes.toLowerCase().includes(texto) ||
      p.ciudad.toLowerCase().includes(texto) ||
      p.cliente?.whatsapp?.includes(texto)
    return coincideEstado && coincideBusqueda
  })

  if (loading) return <p className="text-gray-400 text-sm">Cargando pedidos...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
        <span className="bg-pink-100 text-pink-700 text-sm px-3 py-1 rounded-full">
          {pedidosFiltrados.length} de {pedidos.length}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-3 text-gray-400" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, producto, ciudad..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-400"
          />
        </div>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value as EstadoPedido | "todos")}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-white"
        >
          <option value="todos">Todos los estados</option>
          {estadoOpciones.map((op) => (
            <option key={op} value={op}>{op.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      {pedidosFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-gray-400">No se encontraron pedidos.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pedidosFiltrados.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <a
                        href={`/admin/clientes/${p.cliente_id}`}
                        className="font-semibold text-gray-800 hover:text-pink-600 transition-colors"
                      >
                        {p.cliente?.nombre}
                      </a>
                      <span className="text-gray-400 text-xs">{p.ciudad}</span>
                    </div>
                    <p className="text-pink-600 text-sm font-medium">{p.producto_interes}</p>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{p.descripcion}</p>
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

                  <div className="flex items-center gap-3">
                    <a
                      href={`https://wa.me/${p.cliente?.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700"
                      title="Contactar"
                    >
                      <MessageCircle size={18} />
                    </a>
                    <select
                      value={p.estado}
                      onChange={(e) => cambiarEstado(p.id, e.target.value as EstadoPedido)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-200 ${estadoColors[p.estado]}`}
                    >
                      {estadoOpciones.map((op) => (
                        <option key={op} value={op}>{op.replace("_", " ")}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setExpandido(expandido === p.id ? null : p.id)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Notas"
                    >
                      {expandido === p.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {expandido === p.id && (
                <div className="px-5 pb-5 border-t border-gray-50 pt-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Notas internas</p>
                  {notaEditando?.id === p.id ? (
                    <div className="flex gap-2">
                      <textarea
                        value={notaEditando.texto}
                        onChange={(e) => setNotaEditando({ id: p.id, texto: e.target.value })}
                        rows={2}
                        placeholder="Escribe una nota..."
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-pink-400 resize-none"
                      />
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => guardarNota(p.id, notaEditando.texto)}
                          className="bg-pink-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-pink-600"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setNotaEditando(null)}
                          className="text-gray-400 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-100"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setNotaEditando({ id: p.id, texto: p.notas ?? "" })}
                      className="min-h-10 p-3 bg-gray-50 rounded-xl text-sm text-gray-600 cursor-pointer hover:bg-pink-50 transition-colors"
                    >
                      {p.notas || <span className="text-gray-300 italic">Clic para agregar una nota...</span>}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
