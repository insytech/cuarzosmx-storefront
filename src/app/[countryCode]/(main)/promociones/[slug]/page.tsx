import { Metadata } from "next"
import { buildOpenGraph } from "@lib/util/seo"
import { getActiveStorePromotion } from "@lib/data/store-promotions"
import {
  formatPromotionDateRange,
  formatTierAmount,
  formatTierList,
  getFreeShippingTier,
  getMaxPercentage,
  getPromotionPagePath,
  hasPercentageTier,
  type StorePromotion,
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
 * (never a 404), so old links keep working after an event ends. A promotion
 * without page (page_slug null, S13) owns no address at all; it is returned
 * apart so the message can mention it.
 */
async function getPromotionStateForSlug(slug: string): Promise<{
  state: StorePromotionState
  inForce: StorePromotion | null
}> {
  const state = await getActiveStorePromotion()
  if (state.promotion && state.promotion.page_slug !== slug) {
    return { state: { ...state, promotion: null }, inForce: state.promotion }
  }
  return { state, inForce: state.promotion }
}

/** "Buen Fin: hasta 30% de descuento" / "Diciembre: envío gratis desde $1,500" */
function getPromotionTitle(promotion: StorePromotion): string {
  const maxPct = getMaxPercentage(promotion.tiers)
  const freeTier = getFreeShippingTier(promotion.tiers)
  if (!freeTier) return `${promotion.name}: hasta ${maxPct}% de descuento`
  if (maxPct <= 0) {
    return `${promotion.name}: envío gratis desde ${formatTierAmount(freeTier.min_amount)}`
  }
  return `${promotion.name}: hasta ${maxPct}% de descuento y envío gratis`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const {
    state: { promotion },
  } = await getPromotionStateForSlug(slug)
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

  const title = getPromotionTitle(promotion)
  const description = `${formatPromotionDateRange(
    promotion.starts_at,
    promotion.ends_at
  )}: ${formatTierList(promotion.tiers)} en toda la tienda. ${
    hasPercentageTier(promotion.tiers) ? "El descuento se aplica" : "El envío gratis se aplica"
  } automáticamente en tu carrito.`

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
  const { state, inForce } = await getPromotionStateForSlug(slug)
  return <BuenFinTemplate promotionState={state} promotionInForce={inForce} />
}
