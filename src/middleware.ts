import { NextRequest, NextResponse } from "next/server"

const COUNTRY_CODE = "mx"

export function middleware(request: NextRequest) {
  const { pathname, search, origin } = request.nextUrl

  // URL already has /mx prefix — pass through
  if (pathname.startsWith(`/${COUNTRY_CODE}`)) {
    return NextResponse.next()
  }

  // Redirect to /mx{path}
  const redirectPath = pathname === "/" ? "" : pathname
  return NextResponse.redirect(
    `${origin}/${COUNTRY_CODE}${redirectPath}${search}`,
    307
  )
}

export const config = {
  matcher: [
    "/((?!api|app|auth|admin|_next/static|_next/image|favicon\\.ico|manifest\\.json|robots\\.txt|sitemap\\.xml|images|assets|promo|categorias|signos|block|logo|og-image|wp-content|.*\\..*).*)",
  ],
}
