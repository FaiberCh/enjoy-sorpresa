export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.status = status
    this.details = details
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new ApiError(body?.error ?? "Error de red", res.status, body?.details)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export function apiGet<T>(url: string): Promise<T> {
  return request<T>(url)
}

export function apiPost<T>(url: string, data: unknown): Promise<T> {
  return request<T>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
}

export function apiPatch<T>(url: string, data: unknown): Promise<T> {
  return request<T>(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
}

export function apiDelete<T>(url: string): Promise<T> {
  return request<T>(url, { method: "DELETE" })
}

export function apiUpload<T>(url: string, file: File): Promise<T> {
  const form = new FormData()
  form.append("file", file)
  return request<T>(url, { method: "POST", body: form })
}
