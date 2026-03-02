import { MetadataRoute } from "next"
import { listProducts } from "@lib/data/products"
import { listCollections } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import { blogApi } from "@lib/util/blog-api"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cuarzosmx.com"
const countryCode = process.env.NEXT_PUBLIC_DEFAULT_REGION || "mx"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/${countryCode}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/${countryCode}/store`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/${countryCode}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/${countryCode}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/${countryCode}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/${countryCode}/faq`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/${countryCode}/shipping`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/${countryCode}/returns`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/${countryCode}/privacy`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${siteUrl}/${countryCode}/terms`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ]

  // Products
  let productPages: MetadataRoute.Sitemap = []
  try {
    let allProducts: { handle: string }[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const { response, nextPage } = await listProducts({
        pageParam: page,
        countryCode,
        queryParams: { limit: 100, fields: "handle" },
      })
      allProducts = allProducts.concat(response.products)
      hasMore = nextPage !== null
      page = nextPage || page + 1
    }

    productPages = allProducts
      .filter((p) => p.handle)
      .map((product) => ({
        url: `${siteUrl}/${countryCode}/products/${product.handle}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
  } catch {
    // Products unavailable, continue with other pages
  }

  // Collections
  let collectionPages: MetadataRoute.Sitemap = []
  try {
    const { collections } = await listCollections({
      limit: "100",
      fields: "handle",
    })

    collectionPages = collections
      .filter((c) => c.handle)
      .map((collection) => ({
        url: `${siteUrl}/${countryCode}/collections/${collection.handle}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
  } catch {
    // Collections unavailable, continue
  }

  // Categories
  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const categories = await listCategories({
      limit: 100,
      fields: "handle",
    })

    categoryPages = categories
      .filter((c) => c.handle)
      .map((category) => ({
        url: `${siteUrl}/${countryCode}/categories/${category.handle}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
  } catch {
    // Categories unavailable, continue
  }

  // Blog posts
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const { posts } = await blogApi.getPosts(100, 0)

    blogPages = posts
      .filter((p) => p.url_slug)
      .map((post) => ({
        url: `${siteUrl}/${countryCode}/blog/${post.url_slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : new Date(post.created_at),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
  } catch {
    // Blog unavailable, continue
  }

  return [
    ...staticPages,
    ...productPages,
    ...collectionPages,
    ...categoryPages,
    ...blogPages,
  ]
}
