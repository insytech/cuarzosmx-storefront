import { convertToLocale } from "@lib/util/money"
import {
  formatTierAmount,
  getAmountMissing,
  getCurrentTier,
  getEligibleSubtotal,
  getMaxPercentage,
  getNextTier,
  getTierMarkPositions,
  getTierProgressPosition,
  type PromoLineItemLike,
  type StorePromotion,
} from "@lib/util/store-promotion"

type TierProgressProps = {
  promotion: StorePromotion
  items: PromoLineItemLike[] | null | undefined
  currencyCode: string
  /** "card": cart summary (design 03). "compact": mini cart/checkout (design 04). */
  variant?: "card" | "compact"
}

/**
 * Progress toward the next tier of the store promotion in force. The tier is
 * measured on Σ unit_price × quantity of all items (no shipping, no coupons).
 * Presentational only (no hooks), so it renders in server and client trees.
 */
const TierProgress = ({
  promotion,
  items,
  currencyCode,
  variant = "card",
}: TierProgressProps) => {
  const { tiers, name } = promotion
  const subtotal = getEligibleSubtotal(items)
  const current = getCurrentTier(tiers, subtotal)
  const next = getNextTier(tiers, subtotal)
  const missing = getAmountMissing(tiers, subtotal)
  const maxPct = getMaxPercentage(tiers)
  const money = (amount: number) =>
    convertToLocale({ amount, currency_code: currencyCode })

  if (variant === "compact") {
    const from = current?.min_amount ?? 0
    const to = next?.min_amount ?? from
    const fill = next
      ? Math.min(100, Math.max(0, ((subtotal - from) / (to - from || 1)) * 100))
      : 100

    return (
      <div
        className="bg-light-gray rounded-[10px] p-3"
        aria-live="polite"
        data-testid="tier-progress-compact"
      >
        <p className="mb-2 text-[13px] text-black">
          {current && next && (
            <>
              Ya tienes <b className="text-main-color-dark">{current.percentage}%</b>.
              Agrega <b className="text-main-color-dark">{money(missing)}</b> más y
              obtén <b className="text-main-color-dark">{next.percentage}%</b>.
            </>
          )}
          {!current && next && (
            <>
              Agrega <b className="text-main-color-dark">{money(missing)}</b> más y
              obtén <b className="text-main-color-dark">{next.percentage}%</b> con{" "}
              {name}.
            </>
          )}
          {current && !next && (
            <>
              ¡Tienes el descuento máximo:{" "}
              <b className="text-main-color-dark">{current.percentage}%</b>!
            </>
          )}
        </p>
        <div
          className="h-2 bg-white rounded-full overflow-hidden"
          role="progressbar"
          aria-label={
            next ? `Avance hacia ${next.percentage}%` : "Descuento máximo alcanzado"
          }
          aria-valuemin={from}
          aria-valuemax={to}
          aria-valuenow={Math.min(subtotal, to)}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-main-color to-main-color-dark transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${fill}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-grey-50 mt-1">
          <span>
            {current
              ? `${current.percentage}% · ${formatTierAmount(current.min_amount)}`
              : "Sin descuento"}
          </span>
          {next && (
            <span>
              {next.percentage}% · {formatTierAmount(next.min_amount)}
            </span>
          )}
        </div>
      </div>
    )
  }

  const marks = getTierMarkPositions(tiers.length)
  const lastTierMax = tiers[tiers.length - 1]?.min_amount ?? 0
  const fill = getTierProgressPosition(tiers, subtotal)

  const title = current
    ? next
      ? `Ya tienes ${current.percentage}% de descuento`
      : "¡Tienes el descuento máximo!"
    : `${name}: hasta ${maxPct}% de descuento`

  return (
    <div
      className="bg-white border border-main-color-light rounded-xl p-4"
      aria-live="polite"
      data-testid="tier-progress"
    >
      <div className="flex justify-between items-baseline gap-2">
        <b className="text-main-color-dark text-[15px]">{title}</b>
        <span className="bg-main-color text-white font-bold text-[13px] rounded-full px-2.5 py-0.5 whitespace-nowrap">
          {current ? `−${current.percentage}%` : "Sin descuento"}
        </span>
      </div>
      <p className="mt-1.5 mb-3.5 text-[13px] text-grey-70">
        {next ? (
          <>
            Agrega <b>{money(missing)}</b> más y obtén <b>{next.percentage}%</b>{" "}
            en toda tu compra.
          </>
        ) : (
          <>
            Tu compra tiene {maxPct}%, el descuento más alto de {name}.
          </>
        )}
      </p>
      <div
        className="relative h-2.5 bg-grey-10 rounded-full mx-1.5"
        role="progressbar"
        aria-label="Avance hacia el siguiente descuento"
        aria-valuemin={0}
        aria-valuemax={lastTierMax}
        aria-valuenow={Math.min(subtotal, lastTierMax)}
        aria-valuetext={`${money(subtotal)} de subtotal`}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-main-color to-main-color-dark transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${fill}%` }}
        />
        {marks.slice(0, -1).map((left) => (
          <i
            key={left}
            className="absolute -top-0.5 w-0.5 h-3.5 bg-white"
            style={{ left: `${left}%` }}
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="relative h-[38px] mx-1.5" aria-hidden="true">
        {tiers.map((tier, i) => {
          const reached = subtotal >= tier.min_amount
          const isLast = i === tiers.length - 1
          return (
            <div
              key={tier.min_amount}
              className="absolute top-1.5 -translate-x-1/2 text-center text-[11px] text-grey-50 leading-[1.3] whitespace-nowrap"
              style={{
                left: isLast ? "calc(100% - 22px)" : `${marks[i]}%`,
              }}
            >
              <b
                className={
                  reached
                    ? "block text-xs text-main-color-dark"
                    : "block text-xs text-grey-70"
                }
              >
                {reached && "✓ "}
                {tier.percentage}%
              </b>
              {formatTierAmount(tier.min_amount)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TierProgress
