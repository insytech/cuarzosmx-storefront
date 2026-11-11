import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  formatPromotionDateRange,
  formatTierAmount,
  getMaxPercentage,
  isPromotionInForce,
  type StorePromotion,
} from "@lib/util/store-promotion"

type SeasonBandProps = {
  promotion: StorePromotion | null
}

/**
 * Home band above the hero grid (design 07, S11). Rendered only while the
 * promotion is in force AND its "Franja en el inicio" switch is on. Dates and
 * tiers come from the admin. The grid banners are not touched.
 */
export default function SeasonBand({ promotion }: SeasonBandProps) {
  if (!isPromotionInForce(promotion) || !promotion.show_band) {
    return null
  }

  const maxPct = getMaxPercentage(promotion.tiers)
  const dates = formatPromotionDateRange(promotion.starts_at, promotion.ends_at)
  const logo = promotion.band_logo_url

  return (
    // 24px gap under the nav; side padding matches the hero grid below.
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-6 mb-3">
      <section
        aria-label={promotion.name}
        data-testid="season-band"
        className={`rounded-xl bg-gradient-to-r from-[#A71D2A] to-[#DC3545] text-white flex flex-col items-center text-center gap-4 px-4 pt-[14px] pb-5 lg:grid lg:items-center lg:text-left lg:gap-7 lg:px-8 lg:py-[14px] ${
          logo
            ? "lg:grid-cols-[132px_1fr_auto_auto]"
            : "lg:grid-cols-[1fr_auto_auto]"
        }`}
      >
        {logo && (
          // Plain <img>: the logo host is configured in the admin and may not
          // be listed in next.config images.remotePatterns.
          <img
            src={logo}
            alt={`Logo de ${promotion.name}`}
            width={132}
            className="w-[112px] lg:w-[132px] h-auto -mt-[30px] -mb-2 lg:-mb-[22px] drop-shadow-[0_8px_14px_rgba(0,0,0,0.25)]"
          />
        )}

        <div>
          <h2 className="m-0 text-[22px] lg:text-[28px] leading-[1.15] font-bold [text-wrap:balance]">
            Hasta {maxPct}% de descuento en toda la tienda
          </h2>
          <p className="mt-1 text-sm opacity-95">
            {dates} · Se aplica solo en tu carrito.
          </p>
        </div>

        <ul
          className="grid grid-cols-3 gap-2 w-full lg:flex lg:w-auto lg:gap-2.5"
          aria-label="Descuentos por monto de compra"
        >
          {promotion.tiers.map((tier) => (
            <li
              key={tier.min_amount}
              className="bg-white text-black rounded-[10px] px-2 lg:px-3.5 py-2 text-center"
            >
              <b className="block text-[#DC3545] text-2xl leading-none font-extrabold">
                {tier.percentage}%
              </b>
              <span className="block text-xs font-semibold text-grey-70 lg:whitespace-nowrap">
                desde {formatTierAmount(tier.min_amount)}
              </span>
            </li>
          ))}
        </ul>

        <LocalizedClientLink
          href="/buen-fin"
          className="block w-full lg:w-auto text-center bg-white text-[#A71D2A] font-bold rounded-xl px-[22px] py-3 whitespace-nowrap hover:bg-grey-5 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-white"
          data-testid="season-band-cta"
        >
          Ver promociones →
        </LocalizedClientLink>
      </section>
    </div>
  )
}
