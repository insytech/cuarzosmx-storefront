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
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getRecommendedProducts,
} from "@lib/data/home-products"

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

  // Obtener productos para cada sección en paralelo
  const [featuredSection, newArrivalsSection, bestSellersSection, recommendedSection] =
    await Promise.all([
      getFeaturedProducts(countryCode, 4),
      getNewArrivals(countryCode, 4),
      getBestSellers(countryCode, 4),
      getRecommendedProducts(countryCode, 4),
    ])

  return (
    <>
      {/* 2. Sección Hero */}
      <HeroBlock />

      {/* 2.1. Banner de Características */}
      <FeaturesBanner />

      {/* 3. Productos Destacados */}
      <ProductCarousel
        title={featuredSection.title}
        subtitle={featuredSection.subtitle}
        products={featuredSection.products}
        region={region}
        viewAllLink={featuredSection.viewAllLink}
      />

      {/* 4. Nuevos Ingresos */}
      <ProductCarousel
        title={newArrivalsSection.title}
        subtitle={newArrivalsSection.subtitle}
        products={newArrivalsSection.products}
        region={region}
        viewAllLink={newArrivalsSection.viewAllLink}
      />

      {/* 5. Banner CTA */}
      <InterstitialBanner />

      {/* 6. Más Vendidos */}
      <ProductCarousel
        title={bestSellersSection.title}
        subtitle={bestSellersSection.subtitle}
        products={bestSellersSection.products}
        region={region}
        viewAllLink={bestSellersSection.viewAllLink}
      />

      {/* 7. Banner con Texto Superpuesto */}
      <LifestyleBlock />

      {/* 8. Grilla de Categorías */}
      <CategoryGrid />

      {/* 9. Bloque Editorial */}
      <EditorialBlock />

      {/* 10. Recomendados para Ti */}
      <ProductCarousel
        title={recommendedSection.title}
        subtitle={recommendedSection.subtitle}
        products={recommendedSection.products}
        region={region}
        viewAllLink={recommendedSection.viewAllLink}
      />
    </>
  )
}
