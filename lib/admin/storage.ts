import { supabaseAdmin } from "@/lib/supabase"

export async function uploadToStorage(file: File, prefix: string): Promise<string> {
  const fileName = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`

  const { error } = await supabaseAdmin.storage
    .from("productos")
    .upload(fileName, file, { upsert: true, contentType: "image/webp" })

  if (error) throw error

  const { data: { publicUrl } } = supabaseAdmin.storage.from("productos").getPublicUrl(fileName)
  return publicUrl
}
