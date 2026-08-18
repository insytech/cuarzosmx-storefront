import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { OG_IMAGE } from "@lib/util/seo"

// ISR: Revalidate every hour to reduce function invocations
export const revalidate = 3600

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateStaticParams() {
  try {
    // Only pre-generate for the default region to reduce build-time CPU.
    // Other regions will be generated on-demand and cached via ISR.
    const defaultCountry = process.env.NEXT_PUBLIC_DEFAULT_REGION || "mx"

    const { response } = await listProducts({
      countryCode: defaultCountry,
      queryParams: { limit: 100, fields: "handle" },
    })

    return response.products
      .filter((product) => product.handle)
      .map((product) => ({
        countryCode: defaultCountry,
        handle: product.handle,
      }))
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  // Obtener metadatos SEO personalizados del producto
  const metadata = product.metadata as Record<string, string> | null
  const seoTitle = metadata?.seo_title || product.title
  const seoDescription = metadata?.seo_description ||
    product.description ||
    `Compra ${product.title} en CuarzosMX. Cristales y joyería artesanal de alta calidad con envío a todo México.`
  const seoKeywords = metadata?.seo_keywords

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords ? seoKeywords.split(',').map(k => k.trim()) : undefined,
    openGraph: {
      title: `${seoTitle} | CuarzosMX`,
      description: seoDescription,
      type: "website",
      // Un producto sin foto se quedaba SIN `og:image`, porque un array vacio no
      // hereda nada del layout. Antes lo tapaba `src/app/opengraph-image.jpg`
      // (la plantilla de Medusa, con una lampara), y al borrarla quedo al aire.
      // Con la imagen de marca como respaldo, cualquier producto se comparte con
      // algo nuestro.
      images: product.thumbnail
        ? [
          {
            url: product.thumbnail,
            width: 800,
            height: 800,
            alt: product.title,
          },
        ]
        : [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${seoTitle} | CuarzosMX`,
      description: seoDescription,
      images: product.thumbnail ? [product.thumbnail] : [OG_IMAGE.url],
    },
    alternates: {
      canonical: `/products/${handle}`,
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) {
    notFound()
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={params.countryCode}
    />
  )
}
