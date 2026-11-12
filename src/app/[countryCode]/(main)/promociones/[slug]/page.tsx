import { Metadata } from "next"
import { buildOpenGraph } from "@lib/util/seo"
import { getActiveStorePromotion } from "@lib/data/store-promotions"
import {
  formatPromotionDateRange,
  formatTierList,
  getMaxPercentage,
  getPromotionPagePath,
  type StorePromotionState,
} from "@lib/util/store-promotion"
import BuenFinTemplate from "@modules/buen-fin/templates"

// Same window as the promotions endpoint cache (start/end are automatic).
export const revalidate = 60

type Props = {
  params: Promise<{ countryCode: string; slug: string }>
}

/**
 * State for the page at `slug`: the promotion is kept only when the one in
 * force owns that address; any other address gets the "no promotion" message
 * (never a 404), so old links keep working after an event ends.
 */
async function getPromotionStateForSlug(
  slug: string
): Promise<StorePromotionState> {
  const state = await getActiveStorePromotion()
  if (state.promotion && state.promotion.page_slug !== slug) {
    return { ...state, promotion: null }
  }
  return state
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { promotion } = await getPromotionStateForSlug(slug)
  const path = getPromotionPagePath(slug)

  if (!promotion) {
    // No promotion owns this address right now: keep the friendly page (200)
    // but out of search results.
    const description =
      "Consulta las promociones de temporada de CuarzosMX: cristales, cuarzos y joyería artesanal con envíos a todo México."
    return {
      title: "Promociones",
      description,
      robots: { index: false },
      openGraph: buildOpenGraph({
        title: "Promociones | CuarzosMX",
        description,
        path,
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
      path,
    }),
  }
}

export default async function PromotionPage({ params }: Props) {
  const { slug } = await params
  const promotionState = await getPromotionStateForSlug(slug)
  return <BuenFinTemplate promotionState={promotionState} />
}
