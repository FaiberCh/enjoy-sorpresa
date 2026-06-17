import { NextResponse } from "next/server"

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "NO DEFINIDA"
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "NO DEFINIDA"
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "NO DEFINIDA"

  return NextResponse.json({
    url,
    anon_inicio: anon.slice(0, 20),
    anon_fin: anon.slice(-10),
    anon_largo: anon.length,
    service_inicio: service.slice(0, 20),
    service_fin: service.slice(-10),
    service_largo: service.length,
  })
}
