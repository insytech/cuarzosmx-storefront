import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

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
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
