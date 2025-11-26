import { Metadata } from "next"

import HeroBlock from "@modules/home/components/hero-block"
import FeaturesBanner from "@modules/home/components/features-banner"
import ProductCarousel from "@modules/home/components/product-carousel"
import InterstitialBanner from "@modules/home/components/interstitial-banner"
import EditorialBlock from "@modules/home/components/editorial-block"
import LifestyleBlock from "@modules/home/components/lifestyle-block"
import CategoryGrid from "@modules/home/components/category-grid"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Inicio | Cristales, Cuarzos y Joyería Artesanal en México",
  description:
    "Explora nuestra colección de cristales, cuarzos y joyería artesanal. Amatistas, cuarzo rosa, obsidiana y más. Envíos a todo México con garantía de calidad.",
  openGraph: {
    title: "CuarzosMX - Cristales, Cuarzos y Joyería Artesanal",
    description:
      "Explora nuestra colección de cristales, cuarzos y joyería artesanal. Piezas únicas con envíos a todo México.",
    type: "website",
  },
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const { response: { products } } = await listProducts({
    countryCode,
    queryParams: {
      limit: 20,
      fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags"
    }
  })

  return (
    <>
      {/* 2. Sección Hero */}
      <HeroBlock />

      {/* 2.1. Banner de Características */}
      <FeaturesBanner />

      {/* 3. Carrusel de Productos (Bloque 1) */}
      <ProductCarousel
        title="Productos Destacados"
        products={products || []}
        region={region}
      />

      {/* 4. Carrusel de Productos (Bloque 2) */}
      <ProductCarousel
        title="Nuevos Ingresos"
        products={products?.slice(4, 8) || []}
        region={region}
      />

      {/* 5. Banner CTA */}
      <InterstitialBanner />

      {/* 6. Carrusel de Productos (Bloque 3) */}
      <ProductCarousel
        title="Más Vendidos"
        products={products?.slice(8, 12) || []}
        region={region}
      />

      {/* 7. Banner con Texto Superpuesto */}
      <LifestyleBlock />

      {/* 8. Grilla de Categorías */}
      <CategoryGrid />

      {/* 9. Bloque Editorial */}
      <EditorialBlock />

      {/* 10. Carrusel de Productos (Bloque 4) */}
      <ProductCarousel
        title="Recomendados para Ti"
        products={products?.slice(12, 16) || []}
        region={region}
      />
    </>
  )
}
