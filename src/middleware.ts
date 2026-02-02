import { NextRequest, NextResponse } from "next/server"

const COUNTRY_CODE = "mx"
const CACHE_ID_COOKIE = "_medusa_cache_id"

export function middleware(request: NextRequest) {
  const { pathname, search, origin } = request.nextUrl

  const hasCacheId = request.cookies.has(CACHE_ID_COOKIE)

  // URL already has /mx prefix — pass through
  if (pathname.startsWith(`/${COUNTRY_CODE}`)) {
    const response = NextResponse.next()

    if (!hasCacheId) {
      response.cookies.set(CACHE_ID_COOKIE, crypto.randomUUID(), {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
    }

    return response
  }

  // Redirect to /mx{path}
  const redirectPath = pathname === "/" ? "" : pathname
  const response = NextResponse.redirect(
    `${origin}/${COUNTRY_CODE}${redirectPath}${search}`,
    307
  )

  if (!hasCacheId) {
    response.cookies.set(CACHE_ID_COOKIE, crypto.randomUUID(), {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|app|auth|admin|_next/static|_next/image|favicon\\.ico|manifest\\.json|robots\\.txt|sitemap\\.xml|images|assets|promo|categorias|signos|block|logo|og-image|wp-content|.*\\..*).*)",
  ],
}
