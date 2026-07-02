import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase"

const MAX_ATTEMPTS = 5
const WINDOW_MINUTES = 15

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return req.headers.get("x-real-ip") ?? "unknown"
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)

  let allowed: boolean
  try {
    const { data, error } = await supabaseAdmin.rpc("record_login_attempt", {
      p_ip: ip,
      p_max_attempts: MAX_ATTEMPTS,
      p_window_minutes: WINDOW_MINUTES,
    })
    if (error) throw error
    allowed = Boolean(data)
  } catch (error) {
    console.error("Error en rate-limit de /api/admin/auth:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }

  if (!allowed) {
    return NextResponse.json(
      { error: `Demasiados intentos. Intenta de nuevo en ${WINDOW_MINUTES} minutos.` },
      { status: 429, headers: { "Retry-After": String(WINDOW_MINUTES * 60) } }
    )
  }

  const body = await req.json().catch(() => null)
  const password = body?.password

  if (typeof password !== "string" || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Login correcto: liberar el cupo de intentos de esta IP. No es crítico si
  // falla (solo afecta cuánto tarda en "olvidarse" un intento fallido previo),
  // así que no bloquea la respuesta si algo sale mal aquí.
  try {
    await supabaseAdmin.from("login_attempts").delete().eq("ip", ip)
  } catch (error) {
    console.error("Error limpiando login_attempts tras login exitoso:", error)
  }

  const cookieStore = await cookies()
  cookieStore.set("admin_session", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 horas
    path: "/",
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
  return NextResponse.json({ ok: true })
}
