import { NextRequest, NextResponse } from "next/server"
import { uploadToStorage } from "@/lib/admin/storage"

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null)
  const file = form?.get("file")

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 })
  }

  try {
    const publicUrl = await uploadToStorage(file, "producto")
    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("Error en POST /api/productos/upload:", error)
    return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 })
  }
}
