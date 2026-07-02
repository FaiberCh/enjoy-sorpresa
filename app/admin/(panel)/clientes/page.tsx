import ClientesList from "@/components/admin/ClientesList"
import { supabaseAdmin } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string }>
}) {
  const { filtro } = await searchParams

  const { data } = await supabaseAdmin
    .from("clientes")
    .select("*")
    .order("created_at", { ascending: false })

  return <ClientesList initialClientes={data ?? []} initialFiltro={filtro} />
}
