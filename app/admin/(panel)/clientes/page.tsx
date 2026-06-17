"use client"

import { useEffect, useState } from "react"
import { MessageCircle, Download, Search, Eye } from "lucide-react"
import { Cliente, EstadoLead } from "@/types"

const estadoColors: Record<EstadoLead, string> = {
  interesado: "bg-blue-100 text-blue-700",
  en_negociacion: "bg-purple-100 text-purple-700",
  compro: "bg-green-100 text-green-700",
  no_compro: "bg-red-100 text-red-700",
  inactivo: "bg-gray-100 text-gray-500",
}

const estadoOpciones: EstadoLead[] = ["interesado", "en_negociacion", "compro", "no_compro", "inactivo"]

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<EstadoLead | "todos">("todos")
  const [busqueda, setBusqueda] = useState("")

  const fetchClientes = async () => {
    const res = await fetch("/api/clientes")
    const data = await res.json()
    setClientes(data)
    setLoading(false)
  }

  useEffect(() => { fetchClientes() }, [])

  const cambiarEstado = async (id: string, estado_lead: EstadoLead) => {
    await fetch("/api/clientes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, estado_lead }),
    })
    fetchClientes()
  }

  const exportarCSV = () => {
    const headers = ["Nombre", "WhatsApp", "Ciudad", "Email", "Estado", "Acepta Promociones", "Fecha"]
    const rows = clientesFiltrados.map((c) => [
      c.nombre, c.whatsapp, c.ciudad, c.email ?? "",
      c.estado_lead, c.acepta_promociones ? "Sí" : "No",
      new Date(c.created_at).toLocaleDateString("es-CO"),
    ])
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "clientes-enjoy-sorpresa.csv"
    a.click()
  }

  const clientesFiltrados = clientes.filter((c) => {
    const coincideEstado = filtro === "todos" || c.estado_lead === filtro
    const texto = busqueda.toLowerCase()
    const coincideBusqueda =
      !texto ||
      c.nombre.toLowerCase().includes(texto) ||
      c.whatsapp.includes(texto) ||
      c.ciudad.toLowerCase().includes(texto) ||
      c.email?.toLowerCase().includes(texto)
    return coincideEstado && coincideBusqueda
  })

  if (loading) return <p className="text-gray-400 text-sm">Cargando clientes...</p>

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
        <button
          onClick={exportarCSV}
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2 rounded-full transition-colors"
        >
          <Download size={14} />
          Exportar CSV
        </button>
      </div>

      {/* Buscador */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-3 text-gray-400" />
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, WhatsApp, ciudad..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-400"
        />
      </div>

      {/* Filtros por estado */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(["todos", ...estadoOpciones] as const).map((op) => (
          <button
            key={op}
            onClick={() => setFiltro(op)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              filtro === op
                ? "bg-pink-500 text-white"
                : "bg-white text-gray-600 hover:bg-pink-50 shadow-sm"
            }`}
          >
            {op === "todos" ? "Todos" : op.replace("_", " ")} (
            {op === "todos" ? clientes.length : clientes.filter((c) => c.estado_lead === op).length})
          </button>
        ))}
      </div>

      {clientesFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-gray-400">No se encontraron clientes.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-500">
                  <th className="px-5 py-3 font-medium">Nombre</th>
                  <th className="px-5 py-3 font-medium">WhatsApp</th>
                  <th className="px-5 py-3 font-medium">Ciudad</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                  <th className="px-5 py-3 font-medium">Fecha</th>
                  <th className="px-5 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clientesFiltrados.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{c.nombre}</td>
                    <td className="px-5 py-3 text-gray-600">{c.whatsapp}</td>
                    <td className="px-5 py-3 text-gray-500">{c.ciudad}</td>
                    <td className="px-5 py-3">
                      <select
                        value={c.estado_lead}
                        onChange={(e) => cambiarEstado(c.id, e.target.value as EstadoLead)}
                        className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer focus:outline-none ${estadoColors[c.estado_lead]}`}
                      >
                        {estadoOpciones.map((op) => (
                          <option key={op} value={op}>{op.replace("_", " ")}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {new Date(c.created_at).toLocaleDateString("es-CO")}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <a
                          href={`/admin/clientes/${c.id}`}
                          className="text-pink-500 hover:text-pink-700"
                          title="Ver detalle"
                        >
                          <Eye size={16} />
                        </a>
                        <a
                          href={`https://wa.me/${c.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700"
                          title="Contactar"
                        >
                          <MessageCircle size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
