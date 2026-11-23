import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  accumulateTiers,
  formatCountdown,
  formatDayAfter,
  formatPromotionDateRange,
  formatPromotionValidity,
  formatPromotionBenefits,
  formatTierAmount,
  formatTierList,
  getFreeShippingTier,
  getPromotionPageHeadline,
  getPromotionPageHref,
  getPromotionPageSubtitle,
  getSeasonPalette,
  getTierExampleAmount,
  hasPercentageTier,
  tierHasPercentage,
  type StorePromotion,
  type StorePromotionState,
} from "@lib/util/store-promotion"

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-main-color-dark"

const CATEGORIES = [
  { name: "Joyería", image: "/categorias/JOYERIA.webp", href: "/categories/joyeria" },
  { name: "Decorativos", image: "/categorias/DECORATIVOS.webp", href: "/categories/cuarzos-decorativos" },
  { name: "Figuras", image: "/categorias/FIGURAS.webp", href: "/categories/figuras" },
  { name: "Artesanías", image: "/categorias/ARTESANIAS.webp", href: "/categories/artesanias" },
]

interface Step {
  title: string
  text: string
}

/** "Cómo funciona" steps for what the promotion gives (S8). */
function getSteps(hasPct: boolean, hasFree: boolean): Step[] {
  const choose: Step = {
    title: "Elige tus cristales",
    text: "Todos los productos suman para llegar al monto, incluidos los de oferta y por kilo.",
  }
  if (!hasFree) {
    return [
      choose,
      {
        title: "Mira tu avance",
        text: "En el carrito ves cuánto te falta para el siguiente descuento.",
      },
      {
        title: "Paga con descuento",
        text: "Se aplica el rango más alto que alcances, sobre el subtotal sin envío.",
      },
    ]
  }
  return [
    choose,
    {
      title: "Mira tu avance",
      text: hasPct
        ? "En el carrito ves cuánto te falta para el siguiente beneficio."
        : "En el carrito ves cuánto te falta para el envío gratis.",
    },
    hasPct
      ? {
          title: "Paga menos",
          text: "Los beneficios se suman: al llegar a un monto mayor conservas el descuento más alto alcanzado y el envío gratis, sobre el subtotal sin envío.",
        }
      : {
          title: "Recibe sin costo de envío",
          text: "Al llegar al monto, sobre el subtotal sin envío, cualquier opción de envío queda gratis.",
        },
  ]
}

/**
 * No promotion owns this address: friendly message + link (no 404). When a
 * promotion is in force elsewhere (another page, or none, S13) it is named.
 */
function NoPromotion({ inForce }: { inForce: StorePromotion | null }) {
  const inForceHref = inForce ? getPromotionPageHref(inForce) : null
  return (
    <div className="content-container py-16 md:py-24" data-testid="buen-fin-empty">
      <div className="max-w-xl mx-auto text-center bg-white border border-grey-20 rounded-2xl px-6 py-10">
        <h1 className="font-serenity text-3xl md:text-4xl text-gray-800 mb-3">
          {inForce
            ? "Esta promoción ya no está vigente"
            : "Por ahora no hay promociones activas"}
        </h1>
        <p className="text-grey-70 mb-8">
          {inForce
            ? `Ahora tenemos ${inForce.name}: ${formatPromotionBenefits(inForce)}, aplicado automáticamente en tu carrito.`
            : "Nuestra próxima temporada de descuentos se anunciará aquí. Mientras tanto, descubre todos nuestros cristales y cuarzos."}
        </p>
        <LocalizedClientLink
          href={inForceHref ?? "/store"}
          className={`inline-block w-full sm:w-auto bg-main-color hover:bg-main-color-dark text-white font-semibold rounded-xl px-[26px] py-3 transition-colors ${FOCUS_RING}`}
        >
          {inForceHref ? `Ver ${inForce?.name}` : "Ver la tienda"}
        </LocalizedClientLink>
      </div>
    </div>
  )
}

/**
 * Dedicated promotion page (design 08, S12). Colours, headline and subtitle
 * come from the promotion's identity; the admin colour is applied through
 * `style`, never as a Tailwind class.
 */
export default function BuenFinTemplate({
  promotionState,
  promotionInForce = null,
}: {
  promotionState: StorePromotionState
  /** Promotion in force even when it does not own this page (or has none). */
  promotionInForce?: StorePromotion | null
}) {
  const { promotion, bulk } = promotionState
  if (!promotion) return <NoPromotion inForce={promotionInForce} />

  // Tiers may give a percentage, free shipping or both (S8): the copy only
  // talks about "descuento" when some tier has a percentage.
  const hasPct = hasPercentageTier(promotion.tiers)
  const hasFree = getFreeShippingTier(promotion.tiers) !== null
  const benefitWord = !hasFree ? "descuento" : hasPct ? "beneficio" : "envío gratis"
  const steps = getSteps(hasPct, hasFree)

  const palette = getSeasonPalette(promotion.season_color)
  const dates = formatPromotionDateRange(promotion.starts_at, promotion.ends_at)
  const countdown = formatCountdown(promotion.starts_at, promotion.ends_at)
  const logo = promotion.band_logo_url
  const money = (amount: number) => formatTierAmount(amount)

  return (
    <div className="bg-light-gray pb-12" data-testid="buen-fin-page">
      <div className="h-6" />

      {/* Hero */}
      <section
        aria-labelledby="bf-h1"
        style={{
          backgroundImage: `radial-gradient(120% 120% at 80% 0%, ${palette.light} 0%, ${palette.base} 45%, ${palette.dark} 100%)`,
        }}
        className={`mx-4 sm:mx-6 lg:mx-8 xl:mx-12 rounded-2xl text-white flex flex-col gap-8 px-5 py-8 sm:px-8 lg:grid lg:items-center lg:gap-10 lg:px-12 lg:py-10 ${
          logo
            ? "lg:grid-cols-[minmax(0,240px)_1fr_minmax(0,400px)] xl:grid-cols-[300px_1fr_400px]"
            : "lg:grid-cols-[1fr_minmax(0,400px)]"
        }`}
      >
        {logo && (
          <img
            src={logo}
            alt={`Logo de ${promotion.name}`}
            className="w-40 sm:w-48 lg:w-full h-auto mx-auto drop-shadow-[0_10px_18px_rgba(0,0,0,0.25)]"
          />
        )}
        <div className="text-center lg:text-left">
          <div className="text-[13px] font-bold tracking-[0.12em] uppercase">
            {promotion.name} en Cuarzos MX
          </div>
          <h1
            id="bf-h1"
            className="text-3xl sm:text-4xl lg:text-[44px] leading-[1.05] font-bold mt-1.5 mb-2.5"
          >
            {getPromotionPageHeadline(promotion)}
          </h1>
          <p className="text-base opacity-95">
            {getPromotionPageSubtitle(promotion)}
          </p>
          <span className="inline-block mt-[18px] bg-black/20 rounded-full px-3.5 py-1.5 font-semibold text-sm">
            {dates}
            {countdown && ` · ${countdown}`}
          </span>
        </div>

        <div className="bg-white text-black rounded-2xl p-[22px]">
          <h2 className="text-[15px] font-bold text-main-color-dark mb-2.5">
            {hasFree ? "Tus beneficios según tu compra" : "Tu descuento según tu compra"}
          </h2>
          <ul>
            {/* Benefits accumulate (S14): each row shows everything the
                cart has from that amount, so the examples keep the % */}
            {accumulateTiers(promotion.tiers).map((tier) => {
              const example = getTierExampleAmount(tier)
              const pays = tierHasPercentage(tier)
                ? Math.round(example * (1 - tier.percentage / 100) * 100) / 100
                : example
              return (
                <li
                  key={tier.min_amount}
                  className="grid grid-cols-[84px_1fr] items-center py-2.5 border-t border-grey-20 first:border-t-0"
                >
                  {tierHasPercentage(tier) ? (
                    <b
                      className="text-[32px] font-extrabold leading-none"
                      style={{ color: palette.base }}
                    >
                      {tier.percentage}%
                    </b>
                  ) : (
                    <b
                      className="text-lg font-extrabold leading-tight"
                      style={{ color: palette.base }}
                    >
                      Envío gratis
                    </b>
                  )}
                  <span className="text-sm">
                    Desde {money(tier.min_amount)}
                    {tierHasPercentage(tier) && tier.free_shipping && (
                      <b className="block text-xs" style={{ color: palette.dark }}>
                        + envío gratis
                      </b>
                    )}
                    <small className="block text-grey-50 text-xs">
                      {tierHasPercentage(tier)
                        ? `${money(example)} → pagas ${money(pays)}${tier.free_shipping ? " sin costo de envío" : ""}`
                        : "En cualquier opción de envío"}
                    </small>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Cómo funciona */}
      <section
        aria-labelledby="bf-how"
        className="px-4 sm:px-6 lg:px-8 xl:px-12 pt-10"
      >
        <h2
          id="bf-how"
          className="font-serenity font-normal text-[28px] sm:text-[34px] text-center tracking-[0.03em] mb-1.5"
        >
          CÓMO FUNCIONA
        </h2>
        <p className="text-center text-grey-70 mb-6">
          Sin códigos: el {benefitWord} aparece solo en tu carrito.
        </p>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="bg-white border border-grey-20 rounded-xl p-5"
            >
              <b
                className="inline-flex w-[30px] h-[30px] rounded-full bg-main-color-light text-main-color-dark items-center justify-center mb-2"
                aria-hidden="true"
              >
                {i + 1}
              </b>
              <h3 className="text-base font-semibold mb-1">{step.title}</h3>
              <p className="text-sm text-grey-70">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Compra por categoría */}
      <section
        aria-labelledby="bf-cats"
        className="px-4 sm:px-6 lg:px-8 xl:px-12 pt-10"
      >
        <h2
          id="bf-cats"
          className="font-serenity font-normal text-[28px] sm:text-[34px] text-center tracking-[0.03em] mb-1.5"
        >
          COMPRA POR CATEGORÍA
        </h2>
        <p className="text-center text-grey-70 mb-6">
          Toda la tienda participa. Ideas para llegar a tu{" "}
          {hasFree && !hasPct ? "envío gratis" : `siguiente ${benefitWord}`}.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {CATEGORIES.map((cat) => (
            <LocalizedClientLink
              key={cat.href}
              href={cat.href}
              className={`block bg-white rounded-xl overflow-hidden border border-grey-20 hover:shadow-lg transition-shadow ${FOCUS_RING}`}
            >
              <img
                src={cat.image}
                alt=""
                width={300}
                height={300}
                loading="lazy"
                className="w-full aspect-square object-cover"
              />
              <div className="px-3.5 py-3">
                <h3 className="text-sm font-semibold mb-1">{cat.name}</h3>
                <span
                  className="block text-xs font-semibold"
                  style={{ color: palette.dark }}
                >
                  Todo suma para tu {benefitWord}
                </span>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
        <p className="text-center mt-5">
          <LocalizedClientLink
            href="/store"
            className={`inline-block w-full sm:w-auto bg-main-color hover:bg-main-color-dark text-white font-semibold rounded-xl px-[26px] py-3 transition-colors ${FOCUS_RING}`}
          >
            Ver toda la tienda
          </LocalizedClientLink>
        </p>
      </section>

      {/* Términos generados desde la promoción */}
      <section
        aria-labelledby="bf-terms"
        className="mx-4 sm:mx-6 lg:mx-8 xl:mx-12 mt-10 bg-white border border-grey-20 rounded-xl px-6 py-5 text-sm text-grey-70"
      >
        <h2 id="bf-terms" className="text-base font-semibold text-black mb-2">
          Términos de la promoción
        </h2>
        <ul className="list-disc pl-[18px] space-y-1">
          <li>
            Vigencia:{" "}
            {formatPromotionValidity(promotion.starts_at, promotion.ends_at)}{" "}
            (hora del centro de México).
          </li>
          {hasFree ? (
            <li>Beneficios: {formatTierList(promotion.tiers)}.</li>
          ) : (
            <li>
              Descuentos: {promotion.tiers
                .map((t) => `${t.percentage}% desde ${money(t.min_amount)}`)
                .join(", ")}
              .
            </li>
          )}
          {hasFree && hasPct ? (
            <li>
              El monto se calcula sobre el subtotal de productos, sin envío.
              Los beneficios se acumulan: aplica el descuento más alto
              alcanzado y el envío gratis desde que llegas a su monto.
            </li>
          ) : (
            <li>
              El monto se calcula sobre el subtotal de productos, sin envío. Se
              aplica un solo rango: el más alto alcanzado.
            </li>
          )}
          {hasFree && (
            <li>El envío gratis aplica a todas las opciones de envío.</li>
          )}
          {hasPct && (
            <li>
              Los productos con oferta reciben el descuento sobre su precio
              rebajado. Los productos por kilo suman para el monto pero no
              reciben descuento.
            </li>
          )}
          <li>
            Se combina con cupones.{" "}
            {bulk.enabled
              ? `No se combina con el descuento por mayoreo, que regresa el ${formatDayAfter(promotion.ends_at)}.`
              : "No se combina con el descuento por mayoreo."}
          </li>
        </ul>
      </section>
    </div>
  )
}
