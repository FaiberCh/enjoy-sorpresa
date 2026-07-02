"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import type { EstadoLead } from "@/types"

const COLORS: Record<EstadoLead, string> = {
  interesado: "#3b82f6",
  en_negociacion: "#a855f7",
  compro: "#10b981",
  no_compro: "#ef4444",
  inactivo: "#9ca3af",
}

type Punto = { estado: EstadoLead; label: string; value: number }

export default function ClientesPipelineChart({ data }: { data: Punto[] }) {
  const total = data.reduce((sum, p) => sum + p.value, 0)

  if (total === 0) {
    return <p className="text-gray-400 text-sm text-center py-16">Aún no hay clientes registrados.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((punto) => (
            <Cell key={punto.estado} fill={COLORS[punto.estado]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid #f3f4f6", fontSize: 13 }}
          labelStyle={{ color: "#1f2937", fontWeight: 600 }}
          formatter={(value, name) => {
            const num = Number(value ?? 0)
            return [`${num} (${Math.round((num / total) * 100)}%)`, name]
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={48}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: "#4b5563" }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
