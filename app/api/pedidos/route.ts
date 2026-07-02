import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase"

const pedidoSchema = z.object({
  nombre: z.string().trim().min(1).max(200),
  whatsapp: z.string().trim().min(7).max(30),
  ciudad: z.string().trim().min(1).max(200),
  email: z.string().trim().email().optional().or(z.literal("")),
  producto_interes: z.string().trim().min(1).max(300),
  descripcion: z.string().trim().min(1).max(2000),
  fecha_evento: z.string().trim().optional().or(z.literal("")),
  acepta_promociones: z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  const parsed = pedidoSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 })
  }
  const body = parsed.data

  try {
    const { data: cliente, error: clienteError } = await supabaseAdmin
      .from("clientes")
      .upsert(
        {
          nombre: body.nombre,
          whatsapp: body.whatsapp,
          ciudad: body.ciudad,
          email: body.email || null,
          estado_lead: "interesado",
          acepta_promociones: body.acepta_promociones,
        },
        { onConflict: "whatsapp" }
      )
      .select()
      .single()

    if (clienteError) throw clienteError

    const { error: pedidoError } = await supabaseAdmin.from("pedidos").insert({
      cliente_id: cliente.id,
      producto_interes: body.producto_interes,
      descripcion: body.descripcion,
      fecha_evento: body.fecha_evento || null,
      ciudad: body.ciudad,
      estado: "pendiente",
      origen: "web",
    })

    if (pedidoError) throw pedidoError

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error en /api/pedidos:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("pedidos")
    .select("*, cliente:clientes(*)")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
