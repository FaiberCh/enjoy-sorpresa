import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { FormularioPedidoData } from "@/types"

export async function POST(req: NextRequest) {
  try {
    const body: FormularioPedidoData = await req.json()

    const { data: cliente, error: clienteError } = await supabase
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

    const { error: pedidoError } = await supabase.from("pedidos").insert({
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
  const { data, error } = await supabase
    .from("pedidos")
    .select("*, cliente:clientes(*)")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
