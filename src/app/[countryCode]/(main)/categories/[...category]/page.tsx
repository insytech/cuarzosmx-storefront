import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

// ISR: Revalidate every hour
export const revalidate = 3600

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions?.flatMap((r) => r.countries?.map((c) => c.iso_2))
  )

  const categoryHandles = product_categories.map(
    (category: any) => category.handle
  )

  const staticParams = countryCodes
    ?.flatMap((countryCode: string | undefined) =>
      categoryHandles.map((handle: any) => ({
        countryCode,
        category: [handle],
      }))
    )

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    const productCategory = await getCategoryByHandle(params.category)

    // Obtener metadatos SEO personalizados de la categoría
    const categoryMetadata = productCategory.metadata as Record<string, string> | null
    const seoTitle = categoryMetadata?.seo_title || productCategory.name
    const seoDescription = categoryMetadata?.seo_description ||
      productCategory.description ||
      `Explora nuestra colección de ${productCategory.name}. Cristales, cuarzos y joyería artesanal de alta calidad en CuarzosMX.`
    const seoKeywords = categoryMetadata?.seo_keywords

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
        canonical: `/categories/${params.category.join("/")}`,
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  return (
    <CategoryTemplate
      category={productCategory}
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
