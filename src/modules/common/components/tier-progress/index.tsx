import { convertToLocale } from "@lib/util/money"
import {
  formatPromotionBenefits,
  formatTierAmount,
  formatTierBenefit,
  formatTierBenefitShort,
  formatTierMarkLabel,
  accumulateTiers,
  getAmountMissing,
  getCurrentTier,
  getEligibleSubtotal,
  getMaxPercentage,
  getNextTier,
  getTierMarkPositions,
  getTierProgressPosition,
  hasPercentageTier,
  tierHasPercentage,
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
 * A tier may give a percentage, free shipping or both (S8): the copy names
 * what reaching the next tier adds ("Agrega $X más y obtén envío gratis").
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
  // Promotions without any percentage (free shipping only) talk about the
  // benefit, not about a "descuento".
  const anyPct = hasPercentageTier(tiers)
  const noneLabel = anyPct ? "Sin descuento" : "Sin envío gratis"
  const money = (amount: number) =>
    convertToLocale({ amount, currency_code: currencyCode })
  /** What reaching `next` adds: "25%", "envío gratis" or both. */
  const nextGain = next ? formatTierBenefit(next, current) : ""
  // Benefits accumulate (S14): each tier is shown with what it adds to the
  // previous ones ("20%", then "+ envío gratis"), never as a replacement.
  const effectiveTiers = accumulateTiers(tiers)
  const markLabels = effectiveTiers.map((tier, i) =>
    formatTierMarkLabel(tier, effectiveTiers[i - 1] ?? null)
  )

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
              Ya tienes{" "}
              <b className="text-main-color-dark">{formatTierBenefit(current)}</b>.
              Agrega <b className="text-main-color-dark">{money(missing)}</b> más y
              obtén <b className="text-main-color-dark">{nextGain}</b>.
            </>
          )}
          {!current && next && (
            <>
              Agrega <b className="text-main-color-dark">{money(missing)}</b> más y
              obtén <b className="text-main-color-dark">{nextGain}</b> con{" "}
              {name}.
            </>
          )}
          {current && !next && (
            tierHasPercentage(current) ? (
              <>
                ¡Tienes el descuento máximo:{" "}
                <b className="text-main-color-dark">
                  {formatTierBenefit(current)}
                </b>
                !
              </>
            ) : (
              <>
                ¡Ya tienes <b className="text-main-color-dark">envío gratis</b>{" "}
                con {name}!
              </>
            )
          )}
        </p>
        <div
          className="h-2 bg-white rounded-full overflow-hidden"
          role="progressbar"
          aria-label={
            next
              ? `Avance hacia ${nextGain}`
              : anyPct
                ? "Descuento máximo alcanzado"
                : "Envío gratis alcanzado"
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
              ? `${formatTierBenefitShort(current)} · ${formatTierAmount(current.min_amount)}`
              : noneLabel}
          </span>
          {next && (
            <span>
              {formatTierMarkLabel(next, current)} ·{" "}
              {formatTierAmount(next.min_amount)}
            </span>
          )}
        </div>
      </div>
    )
  }

  const marks = getTierMarkPositions(tiers.length)
  const lastTierMax = tiers[tiers.length - 1]?.min_amount ?? 0
  const fill = getTierProgressPosition(tiers, subtotal)

  const currentHasPct = tierHasPercentage(current)
  const title = current
    ? next
      ? currentHasPct
        ? `Ya tienes ${current.percentage}% de descuento${current.free_shipping ? " y envío gratis" : ""}`
        : "Ya tienes envío gratis"
      : currentHasPct
        ? current.free_shipping
          ? "¡Tienes el descuento máximo y envío gratis!"
          : "¡Tienes el descuento máximo!"
        : "¡Tienes envío gratis!"
    : `${name}: ${formatPromotionBenefits(promotion)}`
  const badge = current
    ? currentHasPct
      ? `−${current.percentage}%${current.free_shipping ? " + envío gratis" : ""}`
      : "Envío gratis"
    : noneLabel

  return (
    <div
      className="bg-white border border-main-color-light rounded-xl p-4"
      aria-live="polite"
      data-testid="tier-progress"
    >
      <div className="flex justify-between items-baseline gap-2">
        <b className="text-main-color-dark text-[15px]">{title}</b>
        <span className="bg-main-color text-white font-bold text-[13px] rounded-full px-2.5 py-0.5 whitespace-nowrap">
          {badge}
        </span>
      </div>
      <p className="mt-1.5 mb-3.5 text-[13px] text-grey-70">
        {next ? (
          <>
            Agrega <b>{money(missing)}</b> más y obtén <b>{nextGain}</b>
            {nextGain === "envío gratis"
              ? " en cualquier opción de envío."
              : " en toda tu compra."}
          </>
        ) : currentHasPct ? (
          <>
            Tu compra tiene {current?.percentage ?? maxPct}%
            {current?.free_shipping ? " y envío gratis" : ""}, el descuento
            más alto de {name}.
          </>
        ) : (
          <>Tu envío es gratis con {name}, en cualquier opción de envío.</>
        )}
      </p>
      <div
        className="relative h-2.5 bg-grey-10 rounded-full mx-1.5"
        role="progressbar"
        aria-label={
          anyPct
            ? "Avance hacia el siguiente descuento"
            : "Avance hacia el envío gratis"
        }
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
          const label = markLabels[i]
          // Free-shipping labels are wider than "30%": anchor the last one to
          // the right edge so it never overflows the card.
          const anchorRight = isLast && label.includes("envío")
          return (
            <div
              key={tier.min_amount}
              className={
                anchorRight
                  ? "absolute top-1.5 right-0 text-right text-[11px] text-grey-50 leading-[1.3] whitespace-nowrap"
                  : "absolute top-1.5 -translate-x-1/2 text-center text-[11px] text-grey-50 leading-[1.3] whitespace-nowrap"
              }
              style={
                anchorRight
                  ? undefined
                  : { left: isLast ? "calc(100% - 22px)" : `${marks[i]}%` }
              }
            >
              <b
                className={
                  reached
                    ? "block text-xs text-main-color-dark"
                    : "block text-xs text-grey-70"
                }
              >
                {reached && "✓ "}
                {label}
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
