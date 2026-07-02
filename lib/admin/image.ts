export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/bmp"]

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `Formato no soportado en "${file.name}". Usa JPG, PNG, WEBP, GIF o AVIF.`
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `"${file.name}" pesa ${(file.size / (1024 * 1024)).toFixed(1)}MB. El máximo es 5MB.`
  }
  return null
}

export async function convertToWebP(file: File, quality = 0.85): Promise<File> {
  if (file.type === "image/webp") return file

  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement("canvas")
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext("2d")
  if (!ctx) return file
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()

  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality))
  if (!blob) return file

  const newName = file.name.replace(/\.[^./]+$/, "") + ".webp"
  return new File([blob], newName, { type: "image/webp" })
}
