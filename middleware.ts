import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin/")
  const session = req.cookies.get("admin_session")

  if (isAdminRoute && !session) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path+"],
}
