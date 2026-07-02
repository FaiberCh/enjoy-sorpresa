import { NextRequest, NextResponse } from "next/server"

// Rutas de API que deben quedar accesibles sin la cookie de admin,
// aunque su path base esté protegido (ej: el formulario público de
// pedidos hace POST a /api/pedidos, pero el panel admin usa GET en la
// misma ruta para listar).
const PUBLIC_API_EXCEPTIONS: Record<string, string[]> = {
  "/api/pedidos": ["POST"],
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = req.cookies.get("admin_session")

  if (pathname.startsWith("/admin/")) {
    if (!session) return NextResponse.redirect(new URL("/admin", req.url))
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/")) {
    const isPublicException = PUBLIC_API_EXCEPTIONS[pathname]?.includes(req.method) ?? false
    if (!isPublicException && !session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path+",
    "/api/clientes/:path*",
    "/api/pedidos/:path*",
    "/api/productos/:path*",
    "/api/banners/:path*",
    "/api/admin/password",
  ],
}
