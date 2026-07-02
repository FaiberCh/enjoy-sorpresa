import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase"

const estadoValues = ["pendiente", "en_proceso", "entregado", "cancelado"] as const

const patchSchema = z.object({
  estado: z.enum(estadoValues).optional(),
  notas: z.string().max(2000).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const parsed = patchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const { id } = await params
    const { estado, notas } = parsed.data

    const { data, error } = await supabaseAdmin
      .from("pedidos")
      .update({ estado, notas, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en PATCH /api/pedidos/[id]:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
