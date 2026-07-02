"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type Punto = { fecha: string; label: string; count: number }

export default function PedidosTendenciaChart({ data }: { data: Punto[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
        <defs>
          <linearGradient id="pedidosTendenciaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#f3f4f6" />
        <XAxis
          dataKey="label"
          tick={{ fill: "#9ca3af", fontSize: 12 }}
          axisLine={{ stroke: "#e5e7eb" }}
          tickLine={false}
          interval={4}
        />
        <YAxis allowDecimals={false} tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid #f3f4f6", fontSize: 13 }}
          labelStyle={{ color: "#1f2937", fontWeight: 600 }}
          formatter={(value) => [value, "Pedidos"]}
        />
        <Area type="monotone" dataKey="count" stroke="#ec4899" strokeWidth={2} fill="url(#pedidosTendenciaFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
