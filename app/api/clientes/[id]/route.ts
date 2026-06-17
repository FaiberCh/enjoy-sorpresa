import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const [{ data: cliente, error: clienteError }, { data: pedidos, error: pedidosError }] =
    await Promise.all([
      supabase.from("clientes").select("*").eq("id", id).single(),
      supabase.from("pedidos").select("*").eq("cliente_id", id).order("created_at", { ascending: false }),
    ])

  if (clienteError) return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
  if (pedidosError) return NextResponse.json({ error: pedidosError.message }, { status: 500 })

  return NextResponse.json({ cliente, pedidos })
}
