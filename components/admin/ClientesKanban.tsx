"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { Cliente, EstadoLead } from "@/types"
import { estadoLeadColors, estadoLeadLabels, estadoLeadOpciones } from "@/lib/admin/estado-colors"

type ClientesKanbanProps = {
  clientes: Cliente[]
  onCambiarEstado: (cliente: Cliente, estado: EstadoLead) => void
}

export default function ClientesKanban({ clientes, onCambiarEstado }: ClientesKanbanProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverEstado, setDragOverEstado] = useState<EstadoLead | null>(null)

  const handleDrop = (estado: EstadoLead) => {
    setDragOverEstado(null)
    const cliente = clientes.find((c) => c.id === draggingId)
    if (cliente && cliente.estado_lead !== estado) onCambiarEstado(cliente, estado)
    setDraggingId(null)
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {estadoLeadOpciones.map((estado) => {
        const columnClientes = clientes.filter((c) => c.estado_lead === estado)
        return (
          <div
            key={estado}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOverEstado(estado)
            }}
            onDragLeave={() => setDragOverEstado((cur) => (cur === estado ? null : cur))}
            onDrop={(e) => {
              e.preventDefault()
              handleDrop(estado)
            }}
            className={`flex-1 min-w-64 rounded-2xl p-3 transition-colors ${
              dragOverEstado === estado ? "bg-pink-50 ring-2 ring-pink-200" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${estadoLeadColors[estado]}`}>
                {estadoLeadLabels[estado]}
              </span>
              <span className="text-xs text-gray-400">{columnClientes.length}</span>
            </div>

            <div className="space-y-2 min-h-16">
              {columnClientes.map((c) => (
                <div
                  key={c.id}
                  draggable
                  onDragStart={() => setDraggingId(c.id)}
                  onDragEnd={() => setDraggingId(null)}
                  className={`bg-white rounded-xl shadow-sm p-3 cursor-grab active:cursor-grabbing transition-opacity ${
                    draggingId === c.id ? "opacity-40" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <a
                      href={`/admin/clientes/${c.id}`}
                      className="font-medium text-sm text-gray-800 hover:text-pink-600 transition-colors"
                    >
                      {c.nombre}
                    </a>
                    <a
                      href={`https://wa.me/${c.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 shrink-0"
                      title="Contactar"
                    >
                      <MessageCircle size={14} />
                    </a>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{c.ciudad}</p>

                  <label className="sr-only" htmlFor={`mover-${c.id}`}>
                    Mover a {c.nombre} a otra etapa
                  </label>
                  <select
                    id={`mover-${c.id}`}
                    value={c.estado_lead}
                    onChange={(e) => onCambiarEstado(c, e.target.value as EstadoLead)}
                    className="w-full text-xs px-2 py-1.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-pink-200"
                  >
                    {estadoLeadOpciones.map((op) => (
                      <option key={op} value={op}>{estadoLeadLabels[op]}</option>
                    ))}
                  </select>
                </div>
              ))}

              {columnClientes.length === 0 && (
                <p className="text-xs text-gray-300 text-center py-4">Sin clientes</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
