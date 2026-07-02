import type { EstadoLead, EstadoPedido } from "@/types"

export const estadoPedidoColors: Record<EstadoPedido, string> = {
  pendiente: "bg-yellow-100 text-yellow-700",
  en_proceso: "bg-blue-100 text-blue-700",
  entregado: "bg-emerald-50 text-emerald-700",
  cancelado: "bg-red-50 text-red-600",
}

export const estadoPedidoOpciones: EstadoPedido[] = ["pendiente", "en_proceso", "entregado", "cancelado"]

export const estadoPedidoLabels: Record<EstadoPedido, string> = {
  pendiente: "Pendiente",
  en_proceso: "En proceso",
  entregado: "Entregado",
  cancelado: "Cancelado",
}

export const estadoLeadColors: Record<EstadoLead, string> = {
  interesado: "bg-blue-100 text-blue-700",
  en_negociacion: "bg-purple-100 text-purple-700",
  compro: "bg-emerald-50 text-emerald-700",
  no_compro: "bg-red-50 text-red-600",
  inactivo: "bg-gray-100 text-gray-500",
}

export const estadoLeadOpciones: EstadoLead[] = ["interesado", "en_negociacion", "compro", "no_compro", "inactivo"]

export const estadoLeadLabels: Record<EstadoLead, string> = {
  interesado: "Interesado",
  en_negociacion: "En negociación",
  compro: "Compró",
  no_compro: "No compró",
  inactivo: "Inactivo",
}
