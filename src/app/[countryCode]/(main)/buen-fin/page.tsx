import { Metadata } from "next"
import { buildOpenGraph } from "@lib/util/seo"
import { getActiveStorePromotion } from "@lib/data/store-promotions"
import {
  formatPromotionDateRange,
  formatTierList,
  getMaxPercentage,
} from "@lib/util/store-promotion"
import BuenFinTemplate from "@modules/buen-fin/templates"

// Same window as the promotions endpoint cache (start/end are automatic).
export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const { promotion } = await getActiveStorePromotion()

  if (!promotion) {
    const description =
      "Consulta las promociones de temporada de CuarzosMX: cristales, cuarzos y joyería artesanal con envíos a todo México."
    return {
      title: "Promociones",
      description,
      openGraph: buildOpenGraph({
        title: "Promociones | CuarzosMX",
        description,
        path: "/buen-fin",
      }),
    }
  }

  const title = `${promotion.name}: hasta ${getMaxPercentage(promotion.tiers)}% de descuento`
  const description = `${formatPromotionDateRange(
    promotion.starts_at,
    promotion.ends_at
  )}: ${formatTierList(
    promotion.tiers
  )} en toda la tienda. El descuento se aplica automáticamente en tu carrito.`

  return {
    title,
    description,
    openGraph: buildOpenGraph({
      title: `${title} | CuarzosMX`,
      description,
      path: "/buen-fin",
    }),
  }
}

export default async function BuenFinPage() {
  const promotionState = await getActiveStorePromotion()
  return <BuenFinTemplate promotionState={promotionState} />
}
