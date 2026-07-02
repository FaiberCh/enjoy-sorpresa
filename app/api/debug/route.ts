import { NextResponse } from "next/server"

// Endpoint de diagnóstico TEMPORAL — solo expone longitud y algunos
// caracteres de las env vars críticas para detectar nombres/valores mal
// configurados en Vercel, nunca el secreto completo. Borrar después de usar.
function mask(value: string | undefined) {
  if (!value) return { present: false }
  return {
    present: true,
    length: value.length,
    preview: `${value.slice(0, 6)}...${value.slice(-4)}`,
  }
}

export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_SUPABASE_URL: mask(process.env.NEXT_PUBLIC_SUPABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: mask(process.env.SUPABASE_SERVICE_ROLE_KEY),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: mask(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    ADMIN_PASSWORD: mask(process.env.ADMIN_PASSWORD),
    NODE_ENV: process.env.NODE_ENV,
  })
}
