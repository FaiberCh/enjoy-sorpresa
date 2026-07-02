import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { supabaseAdmin } from "@/lib/supabase"

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(72),
})

export async function PATCH(req: NextRequest) {
  const parsed = passwordSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 })
  }
  const { currentPassword, newPassword } = parsed.data

  const { data: settings, error: settingsError } = await supabaseAdmin
    .from("admin_settings")
    .select("password_hash")
    .eq("id", 1)
    .single()

  if (settingsError || !settings) {
    console.error("Error leyendo admin_settings:", settingsError)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }

  const currentMatches = await bcrypt.compare(currentPassword, settings.password_hash)
  if (!currentMatches) {
    return NextResponse.json({ error: "La contraseña actual no es correcta" }, { status: 401 })
  }

  const newHash = await bcrypt.hash(newPassword, 12)
  const { error: updateError } = await supabaseAdmin
    .from("admin_settings")
    .update({ password_hash: newHash })
    .eq("id", 1)

  if (updateError) {
    console.error("Error actualizando admin_settings:", updateError)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
