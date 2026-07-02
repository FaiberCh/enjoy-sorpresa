"use client"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { EstadoPedido } from "@/types"

const COLORS: Record<EstadoPedido, string> = {
  pendiente: "#eab308",
  en_proceso: "#3b82f6",
  entregado: "#10b981",
  cancelado: "#ef4444",
}

type Punto = { estado: EstadoPedido; label: string; count: number }

export default function PedidosEstadoChart({ data }: { data: Punto[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid vertical={false} stroke="#f3f4f6" />
        <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: "#fdf2f8" }}
          contentStyle={{ borderRadius: 12, border: "1px solid #f3f4f6", fontSize: 13 }}
          labelStyle={{ color: "#1f2937", fontWeight: 600 }}
        />
        <Bar dataKey="count" name="Pedidos" radius={[8, 8, 0, 0]} maxBarSize={48}>
          {data.map((punto) => (
            <Cell key={punto.estado} fill={COLORS[punto.estado]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
