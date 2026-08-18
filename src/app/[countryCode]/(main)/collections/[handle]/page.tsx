import { Metadata } from "next"
import { buildOpenGraph, buildTwitter } from "@lib/util/seo"
import { notFound } from "next/navigation"

import { getCollectionByHandle, listCollections } from "@lib/data/collections"
import { StoreCollection } from "@medusajs/types"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

// ISR: Revalidate every hour
export const revalidate = 3600

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<{
    page?: string
    sortBy?: SortOptions
    minPrice?: string
    maxPrice?: string
    categories?: string
    inStock?: string
  }>
}

export const PRODUCT_LIMIT = 12

export async function generateStaticParams() {
  // Don't fetch *products just for static params - only need handles
  const { collections } = await listCollections({
    fields: "handle",
  })

  if (!collections) {
    return []
  }

  // Only pre-generate for the default region to reduce build-time CPU.
  // Other regions will be generated on-demand and cached via ISR.
  const defaultCountry = process.env.NEXT_PUBLIC_DEFAULT_REGION || "mx"

  return collections
    .filter((collection: StoreCollection) => collection.handle)
    .map((collection: StoreCollection) => ({
      countryCode: defaultCountry,
      handle: collection.handle,
    }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  // Obtener metadatos SEO personalizados de la colección
  const collectionMetadata = collection.metadata as Record<string, string> | null
  const seoTitle = collectionMetadata?.seo_title || collection.title
  const seoDescription = collectionMetadata?.seo_description ||
    `Descubre la colección ${collection.title}. Cristales, cuarzos y joyería artesanal de alta calidad en CuarzosMX.`
  const seoKeywords = collectionMetadata?.seo_keywords

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords ? seoKeywords.split(',').map(k => k.trim()) : undefined,
    openGraph: buildOpenGraph({
      title: `${seoTitle} | CuarzosMX`,
      description: seoDescription,
      path: `/collections/${params.handle}`,
    }),
    twitter: buildTwitter({
      title: `${seoTitle} | CuarzosMX`,
      description: seoDescription,
    }),
    alternates: {
      canonical: `/collections/${params.handle}`,
    },
  }
}

export default async function CollectionPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page, minPrice, maxPrice, categories, inStock } = searchParams

  const collection = await getCollectionByHandle(params.handle).then(
    (collection: StoreCollection) => collection
  )

  if (!collection) {
    notFound()
  }

  return (
    <CollectionTemplate
      collection={collection}
      page={page}
      sortBy={sortBy}
      countryCode={params.countryCode}
      minPrice={minPrice ? parseInt(minPrice) : undefined}
      maxPrice={maxPrice ? parseInt(maxPrice) : undefined}
      categories={categories?.split(",").filter(Boolean)}
      inStock={inStock === "true"}
    />
  )
}
