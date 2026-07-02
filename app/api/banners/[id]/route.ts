import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase"

const bannerPatchSchema = z.object({
  titulo: z.string().trim().min(1).max(300),
  subtitulo: z.string().max(300).optional().or(z.literal("")),
  imagen_url: z.string().max(2000).optional().or(z.literal("")),
  boton_texto: z.string().max(100).optional().or(z.literal("")),
  boton_url: z.string().max(500).optional().or(z.literal("")),
  color_fondo: z.string().max(20).optional().or(z.literal("")),
  orden: z.number().int().min(0),
  activo: z.boolean(),
}).partial()

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const parsed = bannerPatchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 })
  }

  const { id } = await params
  const { data, error } = await supabaseAdmin.from("banners").update(parsed.data).eq("id", id).select().single()
  if (error) return NextResponse.json({ error: "Error: " + error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { error } = await supabaseAdmin.from("banners").delete().eq("id", id)
  if (error) return NextResponse.json({ error: "Error: " + error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
