import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase"

const productoPatchSchema = z.object({
  nombre: z.string().trim().min(1).max(200),
  descripcion: z.string().max(2000).optional().or(z.literal("")),
  precio: z.number().min(0),
  categoria: z.string().trim().min(1).max(100),
  imagen_url: z.string().max(2000).optional().or(z.literal("")),
  imagenes: z.array(z.string()).optional(),
  disponible: z.boolean(),
}).partial()

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const parsed = productoPatchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 })
  }

  const { id } = await params
  const { data, error } = await supabaseAdmin.from("productos").update(parsed.data).eq("id", id).select().single()
  if (error) return NextResponse.json({ error: "Error: " + error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { error } = await supabaseAdmin.from("productos").delete().eq("id", id)
  if (error) return NextResponse.json({ error: "Error: " + error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
