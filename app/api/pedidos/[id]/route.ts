import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { EstadoPedido } from "@/types"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { estado, notas }: { estado: EstadoPedido; notas?: string } = await req.json()

    const { error } = await supabase
      .from("pedidos")
      .update({ estado, notas, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error en PATCH /api/pedidos/[id]:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
