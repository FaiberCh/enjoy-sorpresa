import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase"

const bannerSchema = z.object({
  titulo: z.string().trim().min(1).max(300),
  subtitulo: z.string().max(300).optional().or(z.literal("")),
  imagen_url: z.string().max(2000).optional().or(z.literal("")),
  boton_texto: z.string().max(100).optional().or(z.literal("")),
  boton_url: z.string().max(500).optional().or(z.literal("")),
  color_fondo: z.string().max(20).optional().or(z.literal("")),
  orden: z.number().int().min(0),
  activo: z.boolean(),
})

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("banners")
    .select("*")
    .order("orden", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const parsed = bannerSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin.from("banners").insert([parsed.data]).select().single()
  if (error) return NextResponse.json({ error: "Error: " + error.message }, { status: 500 })
  return NextResponse.json(data)
}
