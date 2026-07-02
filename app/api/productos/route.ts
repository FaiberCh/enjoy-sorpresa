import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase"

const productoSchema = z.object({
  nombre: z.string().trim().min(1).max(200),
  descripcion: z.string().max(2000).optional().or(z.literal("")),
  precio: z.number().min(0),
  categoria: z.string().trim().min(1).max(100),
  imagen_url: z.string().max(2000).optional().or(z.literal("")),
  imagenes: z.array(z.string()).optional(),
  disponible: z.boolean(),
})

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("productos")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const parsed = productoSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin.from("productos").insert([parsed.data]).select().single()
  if (error) return NextResponse.json({ error: "Error: " + error.message }, { status: 500 })
  return NextResponse.json(data)
}
