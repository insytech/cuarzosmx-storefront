import { Metadata } from "next"

import HeroBlock from "@modules/home/components/hero-block"
import FeaturesBanner from "@modules/home/components/features-banner"
import ProductCarousel from "@modules/home/components/product-carousel"
import InterstitialBanner from "@modules/home/components/interstitial-banner"
import EditorialBlock from "@modules/home/components/editorial-block"
import LifestyleBlock from "@modules/home/components/lifestyle-block"
import CategoryGrid from "@modules/home/components/category-grid"
import { getRegion } from "@lib/data/regions"
import {
  getOnSaleProducts,
  getTrendingProducts,
} from "@lib/data/home-products"

// ISR: Revalidate every hour to reduce function invocations
export const revalidate = 3600

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

  // Obtener productos para cada sección en paralelo (sin Featured Products)
  const [onSaleSection, trendingSection] =
    await Promise.all([
      getOnSaleProducts(countryCode, 4),
      getTrendingProducts(countryCode, 4),
    ])

  return (
    <>
      {/* 1. Sección Hero */}
      <HeroBlock />

      {/* 2. Banner de Características */}
      <FeaturesBanner />

      {/* 3. Explora Nuestras Categorías (movido arriba, antes había Productos Destacados) */}
      <CategoryGrid />

      {/* 4. Ofertas Especiales */}
      <ProductCarousel
        title={onSaleSection.title}
        subtitle={onSaleSection.subtitle}
        products={onSaleSection.products}
        region={region}
        viewAllLink={onSaleSection.viewAllLink}
      />

      {/* 5. Encuentra tu Intención */}
      <LifestyleBlock />

      {/* 6. Cuarzos Según tu Signo */}
      <InterstitialBanner />

      {/* 7. Bloque Editorial */}
      <EditorialBlock />

      {/* 8. En Tendencia */}
      <ProductCarousel
        title={trendingSection.title}
        subtitle={trendingSection.subtitle}
        products={trendingSection.products}
        region={region}
        viewAllLink={trendingSection.viewAllLink}
      />
    </>
  )
}

