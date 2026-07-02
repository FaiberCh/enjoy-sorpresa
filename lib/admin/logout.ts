import { apiDelete } from "@/lib/admin/api"

export async function logout(): Promise<void> {
  await apiDelete("/api/admin/auth")
}
