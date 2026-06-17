export const dynamic = "force-dynamic"

import { supabase } from "@/lib/supabase"
import { Users, ShoppingBag, TrendingUp, Clock } from "lucide-react"

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

async function getUltimosPedidos() {
  const { data } = await supabase
    .from("pedidos")
    .select("*, cliente:clientes(nombre, whatsapp, ciudad)")
    .order("created_at", { ascending: false })
    .limit(5)

  return data ?? []
}

const estadoColors: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-700",
  en_proceso: "bg-blue-100 text-blue-700",
  entregado: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
}

export default async function Dashboard() {
  const [stats, pedidos] = await Promise.all([getStats(), getUltimosPedidos()])

  const statCards = [
    { label: "Total Clientes", value: stats.totalClientes, icon: Users, color: "text-pink-500" },
    { label: "Total Pedidos", value: stats.totalPedidos, icon: ShoppingBag, color: "text-purple-500" },
    { label: "Pedidos Pendientes", value: stats.pedidosPendientes, icon: Clock, color: "text-yellow-500" },
    { label: "Compraron", value: stats.compraron, icon: TrendingUp, color: "text-green-500" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{label}</p>
              <Icon size={20} className={color} />
            </div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Últimos Pedidos</h2>
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
                {pedidos.map((p: any) => (
                  <tr key={p.id}>
                    <td className="py-3 font-medium text-gray-800">{p.cliente?.nombre}</td>
                    <td className="py-3 text-gray-600">{p.producto_interes}</td>
                    <td className="py-3 text-gray-500">{p.ciudad}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColors[p.estado]}`}>
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
