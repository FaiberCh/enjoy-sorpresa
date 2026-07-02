import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase"
import { EstadoLead } from "@/types"

const estadoLeadValues = ["interesado", "en_negociacion", "compro", "no_compro", "inactivo"] as const

const createSchema = z.object({
  nombre: z.string().trim().min(1),
  whatsapp: z.string().trim().min(7),
  ciudad: z.string().trim().min(1),
  email: z.string().trim().email().optional().or(z.literal("")).nullable(),
  estado_lead: z.enum(estadoLeadValues).optional(),
  acepta_promociones: z.boolean().optional(),
})

const patchSchema = z.object({
  id: z.string().uuid(),
  estado_lead: z.enum(estadoLeadValues),
})

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("clientes")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const parsed = createSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 })
  }
  const body = parsed.data

  try {
    const { data, error } = await supabaseAdmin
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
  const parsed = patchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 })
  }
  const { id, estado_lead }: { id: string; estado_lead: EstadoLead } = parsed.data

  try {
    const { data, error } = await supabaseAdmin
      .from("clientes")
      .update({ estado_lead, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en PATCH /api/clientes:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
