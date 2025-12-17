import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

// ISR: Revalidate every 15 minutes for search freshness
export const revalidate = 900

export const metadata: Metadata = {
  title: "Tienda | Todos los Productos",
  description:
    "Explora todos nuestros cristales, cuarzos y joyería artesanal. Amatistas, cuarzo rosa, obsidiana, turmalina y más. Envíos a todo México.",
  openGraph: {
    title: "Tienda | CuarzosMX",
    description:
      "Explora todos nuestros cristales, cuarzos y joyería artesanal. Piezas únicas con envío a todo México.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tienda | CuarzosMX",
    description: "Explora todos nuestros cristales, cuarzos y joyería artesanal.",
  },
  alternates: {
    canonical: "/store",
  },
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    q?: string
    minPrice?: string
    maxPrice?: string
    categories?: string
    inStock?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, q, minPrice, maxPrice, categories, inStock } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      searchQuery={q}
      minPrice={minPrice ? parseInt(minPrice) : undefined}
      maxPrice={maxPrice ? parseInt(maxPrice) : undefined}
      categories={categories?.split(",").filter(Boolean)}
      inStock={inStock === "true"}
    />
  )
}
