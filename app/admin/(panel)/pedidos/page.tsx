import PedidosList from "@/components/admin/PedidosList"
import { supabaseAdmin } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>
}) {
  const { estado } = await searchParams

  const { data } = await supabaseAdmin
    .from("pedidos")
    .select("*, cliente:clientes(*)")
    .order("created_at", { ascending: false })

  return <PedidosList initialPedidos={data ?? []} initialEstado={estado} />
}
