import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCollectionByHandle, listCollections } from "@lib/data/collections"
import { listRegions } from "@lib/data/regions"
import { StoreCollection, StoreRegion } from "@medusajs/types"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

// ISR: Revalidate every hour
export const revalidate = 3600

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<{
    page?: string
    sortBy?: SortOptions
  }>
}

export const PRODUCT_LIMIT = 12

export async function generateStaticParams() {
  const { collections } = await listCollections({
    fields: "*products",
  })

  if (!collections) {
    return []
  }

  const countryCodes = await listRegions().then(
    (regions: StoreRegion[]) =>
      regions
        ?.flatMap((r) => r.countries?.map((c) => c.iso_2))
        .filter(Boolean) as string[]
  )

  const collectionHandles = collections.map(
    (collection: StoreCollection) => collection.handle
  )

  const staticParams = countryCodes
    ?.flatMap((countryCode: string) =>
      collectionHandles.map((handle: string | undefined) => ({
        countryCode,
        handle,
      }))
    )

  return staticParams
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
    openGraph: {
      title: `${seoTitle} | CuarzosMX`,
      description: seoDescription,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${seoTitle} | CuarzosMX`,
      description: seoDescription,
    },
    alternates: {
      canonical: `/collections/${params.handle}`,
    },
  }
}

export default async function CollectionPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

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
    />
  )
}
