import { CATEGORIES_CACHE_TAG } from "@lib/data/categories"
import { BLOG_CACHE_TAG, blogPostCacheTag } from "@lib/util/blog-api"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

/**
 * Payloads:
 * - `{ secret, handles: string[] }` — product changes (product pages, listings).
 * - `{ secret, categories: string[] }` — category changes. Clears the global
 *   `categories` tag and each `/<country>/categories/<handle>` path. An empty
 *   array is valid (for example a deleted category whose handle is gone) and
 *   clears only the tag.
 * - `{ secret, blog: string[] }` — blog post changes (create, update, delete),
 *   with the post's current and previous slugs. Clears each `blog-<slug>` tag
 *   and `/<country>/blog/<slug>` path, then the global `blog` tag and the
 *   `/<country>/blog` list. An empty array is valid and clears only the global
 *   tag and the list. Entries that are not non-empty strings are skipped.
 * The keys may be sent together.
 */
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { secret, handles, categories, blog } = body as {
    secret?: string
    handles?: string[]
    categories?: string[]
    blog?: string[]
  }

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
  }

  const hasCategories = Array.isArray(categories)
  const hasBlog = Array.isArray(blog)

  if (
    !hasCategories &&
    !hasBlog &&
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

  if (hasBlog) {
    for (const slug of blog) {
      if (typeof slug !== "string" || !slug) continue
      const tag = blogPostCacheTag(slug)
      revalidateTag(tag)
      revalidatedTags.push(tag)
      const path = `/${countryCode}/blog/${slug}`
      revalidatePath(path)
      revalidated.push(path)
    }

    // The blog list and every post fetch carry this tag.
    revalidateTag(BLOG_CACHE_TAG)
    revalidatedTags.push(BLOG_CACHE_TAG)
    const listPath = `/${countryCode}/blog`
    revalidatePath(listPath)
    revalidated.push(listPath)
  }

  return NextResponse.json({
    revalidated,
    revalidatedTags,
    now: Date.now(),
  })
}
