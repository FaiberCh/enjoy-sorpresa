import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { Cliente, EstadoLead } from "@/types"

export async function GET() {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body: Partial<Cliente> = await req.json()

    const { data, error } = await supabase
      .from("clientes")
      .insert({
        nombre: body.nombre,
        whatsapp: body.whatsapp,
        ciudad: body.ciudad,
        email: body.email || null,
        estado_lead: body.estado_lead || "interesado",
        acepta_promociones: body.acepta_promociones ?? false,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en POST /api/clientes:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, estado_lead }: { id: string; estado_lead: EstadoLead } = await req.json()

    const { error } = await supabase
      .from("clientes")
      .update({ estado_lead, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error en PATCH /api/clientes:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
