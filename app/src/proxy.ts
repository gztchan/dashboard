import { type NextRequest, NextResponse  } from 'next/server'

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.rewrite(new URL(`${process.env.PROVIDENCE_API_ENDPOINT}${request.nextUrl.pathname}${request.nextUrl.search}`))
  }
  if (request.nextUrl.pathname.startsWith('/websockify')) {
    return NextResponse.rewrite(new URL(`${process.env.PROVIDENCE_EDGE_ENDPOINT}${request.nextUrl.pathname}${request.nextUrl.search}`))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}