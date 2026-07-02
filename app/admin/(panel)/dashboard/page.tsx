export const dynamic = "force-dynamic"

import Link from "next/link"
import { supabaseAdmin as supabase } from "@/lib/supabase"
import { Users, ShoppingBag, TrendingUp, Clock } from "lucide-react"
import {
  estadoPedidoColors,
  estadoPedidoLabels,
  estadoPedidoOpciones,
  estadoLeadLabels,
  estadoLeadOpciones,
} from "@/lib/admin/estado-colors"
import { formatFecha } from "@/lib/admin/date"
import type { EstadoPedido, EstadoLead } from "@/types"
import PedidosEstadoChart from "@/components/admin/dashboard/PedidosEstadoChart"
import ClientesPipelineChart from "@/components/admin/dashboard/ClientesPipelineChart"
import PedidosTendenciaChart from "@/components/admin/dashboard/PedidosTendenciaChart"

type PedidoReciente = {
  id: string
  cliente_id: string
  producto_interes: string
  ciudad: string
  estado: EstadoPedido
  cliente: { nombre: string } | null
}

const DIAS_TENDENCIA = 30

async function getStats() {
  const [{ count: totalClientes }, { count: totalPedidos }, { count: pedidosPendientes }, { count: compraron }] =
    await Promise.all([
      supabase.from("clientes").select("*", { count: "exact", head: true }),
      supabase.from("pedidos").select("*", { count: "exact", head: true }),
      supabase.from("pedidos").select("*", { count: "exact", head: true }).eq("estado", "pendiente"),
      supabase.from("clientes").select("*", { count: "exact", head: true }).eq("estado_lead", "compro"),
    ])

  return {
    totalClientes: totalClientes ?? 0,
    totalPedidos: totalPedidos ?? 0,
    pedidosPendientes: pedidosPendientes ?? 0,
    compraron: compraron ?? 0,
  }
}

async function getUltimosPedidos(): Promise<PedidoReciente[]> {
  const { data } = await supabase
    .from("pedidos")
    .select("id, cliente_id, producto_interes, ciudad, estado, cliente:clientes(nombre)")
    .order("created_at", { ascending: false })
    .limit(5)

  return (data as unknown as PedidoReciente[]) ?? []
}

async function getPedidosPorEstado() {
  const { data } = await supabase.from("pedidos").select("estado")

  const counts: Record<EstadoPedido, number> = { pendiente: 0, en_proceso: 0, entregado: 0, cancelado: 0 }
  data?.forEach((p) => {
    const estado = p.estado as EstadoPedido
    counts[estado] = (counts[estado] ?? 0) + 1
  })

  return estadoPedidoOpciones.map((estado) => ({ estado, label: estadoPedidoLabels[estado], count: counts[estado] }))
}

async function getClientesPorEtapa() {
  const { data } = await supabase.from("clientes").select("estado_lead")

  const counts: Record<EstadoLead, number> = { interesado: 0, en_negociacion: 0, compro: 0, no_compro: 0, inactivo: 0 }
  data?.forEach((c) => {
    const estado = c.estado_lead as EstadoLead
    counts[estado] = (counts[estado] ?? 0) + 1
  })

  return estadoLeadOpciones.map((estado) => ({ estado, label: estadoLeadLabels[estado], value: counts[estado] }))
}

async function getPedidosTendencia() {
  const desde = new Date()
  desde.setDate(desde.getDate() - (DIAS_TENDENCIA - 1))
  desde.setHours(0, 0, 0, 0)

  const { data } = await supabase.from("pedidos").select("created_at").gte("created_at", desde.toISOString())

  const buckets = new Map<string, number>()
  for (let i = 0; i < DIAS_TENDENCIA; i++) {
    const dia = new Date(desde)
    dia.setDate(desde.getDate() + i)
    buckets.set(dia.toISOString().slice(0, 10), 0)
  }

  data?.forEach((p) => {
    const dia = String(p.created_at).slice(0, 10)
    if (buckets.has(dia)) buckets.set(dia, (buckets.get(dia) ?? 0) + 1)
  })

  return Array.from(buckets.entries()).map(([fecha, count]) => ({
    fecha,
    label: formatFecha(fecha, { day: "numeric", month: "short" }),
    count,
  }))
}

export default async function Dashboard() {
  const [stats, pedidos, pedidosPorEstado, clientesPorEtapa, pedidosTendencia] = await Promise.all([
    getStats(),
    getUltimosPedidos(),
    getPedidosPorEstado(),
    getClientesPorEtapa(),
    getPedidosTendencia(),
  ])

  const statCards = [
    { label: "Total Clientes", value: stats.totalClientes, icon: Users, color: "text-pink-500", href: "/admin/clientes" },
    { label: "Total Pedidos", value: stats.totalPedidos, icon: ShoppingBag, color: "text-pink-500", href: "/admin/pedidos" },
    { label: "Pedidos Pendientes", value: stats.pedidosPendientes, icon: Clock, color: "text-yellow-500", href: "/admin/pedidos?estado=pendiente" },
    { label: "Compraron", value: stats.compraron, icon: TrendingUp, color: "text-emerald-600", href: "/admin/clientes?filtro=compro" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow block">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{label}</p>
              <Icon size={20} className={color} />
            </div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Pedidos por estado</h2>
          <PedidosEstadoChart data={pedidosPorEstado} />
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Clientes por etapa</h2>
          <ClientesPipelineChart data={clientesPorEtapa} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Pedidos últimos {DIAS_TENDENCIA} días</h2>
        <PedidosTendenciaChart data={pedidosTendencia} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Últimos Pedidos</h2>
          <Link href="/admin/pedidos" className="text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors">
            Ver todos
          </Link>
        </div>
        {pedidos.length === 0 ? (
          <p className="text-gray-400 text-sm">No hay pedidos aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Cliente</th>
                  <th className="pb-3 font-medium">Producto</th>
                  <th className="pb-3 font-medium">Ciudad</th>
                  <th className="pb-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pedidos.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-800">
                      <Link href={`/admin/clientes/${p.cliente_id}`} className="hover:text-pink-600 transition-colors">
                        {p.cliente?.nombre}
                      </Link>
                    </td>
                    <td className="py-3 text-gray-600">{p.producto_interes}</td>
                    <td className="py-3 text-gray-500">{p.ciudad}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoPedidoColors[p.estado]}`}>
                        {p.estado.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
