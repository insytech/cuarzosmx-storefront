import { CATEGORIES_CACHE_TAG } from "@lib/data/categories"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

/**
 * Payloads:
 * - `{ secret, handles: string[] }` — product changes (product pages, listings).
 * - `{ secret, categories: string[] }` — category changes. Clears the global
 *   `categories` tag and each `/<country>/categories/<handle>` path. An empty
 *   array is valid (for example a deleted category whose handle is gone) and
 *   clears only the tag.
 * Both keys may be sent together.
 */
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { secret, handles, categories } = body as {
    secret?: string
    handles?: string[]
    categories?: string[]
  }

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
  }

  const hasCategories = Array.isArray(categories)

  if (
    !hasCategories &&
    (!handles || !Array.isArray(handles) || handles.length === 0)
  ) {
    return NextResponse.json(
      { message: "Missing or empty handles array" },
      { status: 400 }
    )
  }

  const countryCode = process.env.NEXT_PUBLIC_DEFAULT_REGION || "mx"
  const revalidated: string[] = []
  const revalidatedTags: string[] = []

  if (Array.isArray(handles) && handles.length > 0) {
    for (const handle of handles) {
      const path = `/${countryCode}/products/${handle}`
      revalidatePath(path)
      revalidated.push(path)

      // Also revalidate the specific product tag
      const productTag = `product-${handle}`
      revalidateTag(productTag)
      revalidatedTags.push(productTag)
    }

    // Revalidate global products tag (for listings)
    revalidateTag("products")
    revalidatedTags.push("products")

    // Also revalidate the home page and store pages since product changes
    // may affect listings
    revalidatePath(`/${countryCode}`)
    revalidatePath(`/${countryCode}/store`)
    revalidated.push(`/${countryCode}`, `/${countryCode}/store`)
  }

  if (hasCategories) {
    for (const handle of categories) {
      if (typeof handle !== "string" || !handle) continue
      const path = `/${countryCode}/categories/${handle}`
      revalidatePath(path)
      revalidated.push(path)
    }

    // Nested category URLs and the navigation menu read from this tag.
    revalidateTag(CATEGORIES_CACHE_TAG)
    revalidatedTags.push(CATEGORIES_CACHE_TAG)
  }

  return NextResponse.json({
    revalidated,
    revalidatedTags,
    now: Date.now(),
  })
}
