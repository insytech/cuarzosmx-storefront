import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  formatCountdown,
  formatDayAfter,
  formatPromotionDateRange,
  formatPromotionValidity,
  formatTierAmount,
  getMaxPercentage,
  getTierExampleAmount,
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

const STEPS = [
  {
    title: "Elige tus cristales",
    text: "Todos los productos suman para llegar al monto, incluidos los de oferta y por kilo.",
  },
  {
    title: "Mira tu avance",
    text: "En el carrito ves cuánto te falta para el siguiente descuento.",
  },
  {
    title: "Paga con descuento",
    text: "Se aplica el rango más alto que alcances, sobre el subtotal sin envío.",
  },
]

/** No promotion in force: friendly message + link to the store (no 404). */
function NoPromotion() {
  return (
    <div className="content-container py-16 md:py-24" data-testid="buen-fin-empty">
      <div className="max-w-xl mx-auto text-center bg-white border border-grey-20 rounded-2xl px-6 py-10">
        <h1 className="font-serenity text-3xl md:text-4xl text-gray-800 mb-3">
          Por ahora no hay promociones activas
        </h1>
        <p className="text-grey-70 mb-8">
          Nuestra próxima temporada de descuentos se anunciará aquí. Mientras
          tanto, descubre todos nuestros cristales y cuarzos.
        </p>
        <LocalizedClientLink
          href="/store"
          className={`inline-block w-full sm:w-auto bg-main-color hover:bg-main-color-dark text-white font-semibold rounded-xl px-[26px] py-3 transition-colors ${FOCUS_RING}`}
        >
          Ver la tienda
        </LocalizedClientLink>
      </div>
    </div>
  )
}

/** Dedicated promotion page (design 08, S12). */
export default function BuenFinTemplate({
  promotionState,
}: {
  promotionState: StorePromotionState
}) {
  const { promotion, bulk } = promotionState
  if (!promotion) return <NoPromotion />

  const maxPct = getMaxPercentage(promotion.tiers)
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
        className={`mx-4 sm:mx-6 lg:mx-8 xl:mx-12 rounded-2xl text-white bg-[radial-gradient(120%_120%_at_80%_0%,#E4505F_0%,#DC3545_45%,#A71D2A_100%)] flex flex-col gap-8 px-5 py-8 sm:px-8 lg:grid lg:items-center lg:gap-10 lg:px-12 lg:py-10 ${
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
            Entre más cristales llevas, más ahorras
          </h1>
          <p className="text-base opacity-95">
            Hasta {maxPct}% de descuento en toda la tienda, aplicado
            automáticamente en tu carrito. Se combina con cupones.
          </p>
          <span className="inline-block mt-[18px] bg-black/20 rounded-full px-3.5 py-1.5 font-semibold text-sm">
            {dates}
            {countdown && ` · ${countdown}`}
          </span>
        </div>

        <div className="bg-white text-black rounded-2xl p-[22px]">
          <h2 className="text-[15px] font-bold text-main-color-dark mb-2.5">
            Tu descuento según tu compra
          </h2>
          <ul>
            {promotion.tiers.map((tier) => {
              const example = getTierExampleAmount(tier)
              const pays =
                Math.round(example * (1 - tier.percentage / 100) * 100) / 100
              return (
                <li
                  key={tier.min_amount}
                  className="grid grid-cols-[84px_1fr] items-center py-2.5 border-t border-grey-20 first:border-t-0"
                >
                  <b className="text-[32px] text-[#DC3545] font-extrabold leading-none">
                    {tier.percentage}%
                  </b>
                  <span className="text-sm">
                    Desde {money(tier.min_amount)}
                    <small className="block text-grey-50 text-xs">
                      {money(example)} → pagas {money(pays)}
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
          Sin códigos: el descuento aparece solo en tu carrito.
        </p>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map((step, i) => (
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
          Toda la tienda participa. Ideas para llegar a tu siguiente descuento.
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
                <span className="block text-xs font-semibold text-[#A71D2A]">
                  Todo suma para tu descuento
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
          <li>
            Descuentos: {promotion.tiers
              .map((t) => `${t.percentage}% desde ${money(t.min_amount)}`)
              .join(", ")}
            .
          </li>
          <li>
            El monto se calcula sobre el subtotal de productos, sin envío. Se
            aplica un solo rango: el más alto alcanzado.
          </li>
          <li>
            Los productos con oferta reciben el descuento sobre su precio
            rebajado. Los productos por kilo suman para el monto pero no
            reciben descuento.
          </li>
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
