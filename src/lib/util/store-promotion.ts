/**
 * Pure helpers for the store-wide automatic promotions (tiered "Promo por
 * monto", e.g. Buen Fin) and the bulk discount switch.
 *
 * Contract: GET /store/promotions/active (see odd/tasks/buen-fin-promociones.md).
 * Nothing in this file touches the network or Next.js APIs, so it can be used
 * from server and client components alike.
 */

export const PROMO_TIMEZONE = "America/Mexico_City"

/** Line-item adjustments written by the tier engine start with this prefix. */
export const TIER_ADJUSTMENT_PREFIX = "Promo por monto:"

export interface StorePromotionTier {
  min_amount: number
  percentage: number
}

export interface StorePromotion {
  id: string
  name: string
  starts_at: string
  ends_at: string
  tiers: StorePromotionTier[]
  show_band: boolean
  band_logo_url: string | null
  topbar_message: string | null
}

export interface StoreBulkState {
  enabled: boolean
  applies: boolean
  threshold: number
  percentage: number
}

export interface StorePromotionState {
  bulk: StoreBulkState
  promotion: StorePromotion | null
}

/** Behaves as the store did before promotions existed: bulk 20% from 12. */
export const FALLBACK_BULK_STATE: StoreBulkState = {
  enabled: true,
  applies: true,
  threshold: 12,
  percentage: 20,
}

export const FALLBACK_PROMOTION_STATE: StorePromotionState = {
  bulk: FALLBACK_BULK_STATE,
  promotion: null,
}

// ---------------------------------------------------------------------------
// Parsing (never trust the wire)
// ---------------------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function toFiniteNumber(value: unknown): number | null {
  const n = typeof value === "string" ? Number(value) : value
  return typeof n === "number" && Number.isFinite(n) ? n : null
}

function parseBulk(value: unknown): StoreBulkState {
  if (!isRecord(value)) return FALLBACK_BULK_STATE
  const threshold = toFiniteNumber(value.threshold)
  const percentage = toFiniteNumber(value.percentage)
  return {
    enabled:
      typeof value.enabled === "boolean"
        ? value.enabled
        : FALLBACK_BULK_STATE.enabled,
    applies:
      typeof value.applies === "boolean"
        ? value.applies
        : FALLBACK_BULK_STATE.applies,
    threshold:
      threshold !== null && threshold > 0
        ? threshold
        : FALLBACK_BULK_STATE.threshold,
    percentage:
      percentage !== null && percentage > 0
        ? percentage
        : FALLBACK_BULK_STATE.percentage,
  }
}

function parseTiers(value: unknown): StorePromotionTier[] {
  if (!Array.isArray(value)) return []
  const tiers: StorePromotionTier[] = []
  for (const raw of value) {
    if (!isRecord(raw)) continue
    const min = toFiniteNumber(raw.min_amount)
    const pct = toFiniteNumber(raw.percentage)
    if (min === null || pct === null || min < 0 || pct <= 0 || pct > 100) {
      continue
    }
    tiers.push({ min_amount: min, percentage: pct })
  }
  return tiers.sort((a, b) => a.min_amount - b.min_amount)
}

function isValidDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value))
}

function parsePromotion(value: unknown): StorePromotion | null {
  if (!isRecord(value)) return null
  if (!isValidDate(value.starts_at) || !isValidDate(value.ends_at)) return null
  const tiers = parseTiers(value.tiers)
  if (!tiers.length) return null
  const nonEmpty = (v: unknown): string | null =>
    typeof v === "string" && v.trim() ? v.trim() : null

  return {
    id: typeof value.id === "string" ? value.id : "",
    name: nonEmpty(value.name) ?? "Promoción",
    starts_at: value.starts_at,
    ends_at: value.ends_at,
    tiers,
    show_band: value.show_band === true,
    band_logo_url: nonEmpty(value.band_logo_url),
    topbar_message: nonEmpty(value.topbar_message),
  }
}

/**
 * Normalises the raw JSON of GET /store/promotions/active. Anything malformed
 * degrades to the pre-promotion behaviour (bulk only).
 */
export function parseStorePromotionState(raw: unknown): StorePromotionState {
  if (!isRecord(raw)) return FALLBACK_PROMOTION_STATE
  const promotion = parsePromotion(raw.promotion)
  const bulk = parseBulk(raw.bulk)
  return {
    // A promotion in force always pauses bulk (S2/S3), whatever the wire says.
    bulk: promotion ? { ...bulk, applies: false } : bulk,
    promotion,
  }
}

/** in force = starts_at <= now <= ends_at (the API already filters is_active). */
export function isPromotionInForce(
  promotion: StorePromotion | null | undefined,
  now: Date = new Date()
): promotion is StorePromotion {
  if (!promotion) return false
  const t = now.getTime()
  return (
    Date.parse(promotion.starts_at) <= t && t <= Date.parse(promotion.ends_at)
  )
}

/**
 * Guards against a cached response that outlived the promotion window: the
 * promotion is dropped and bulk is restored (if its switch is on).
 */
export function resolvePromotionState(
  state: StorePromotionState,
  now: Date = new Date()
): StorePromotionState {
  if (!state.promotion || isPromotionInForce(state.promotion, now)) return state
  return {
    bulk: { ...state.bulk, applies: state.bulk.enabled },
    promotion: null,
  }
}

// ---------------------------------------------------------------------------
// Tiers
// ---------------------------------------------------------------------------

export function getMaxPercentage(tiers: StorePromotionTier[]): number {
  return tiers.reduce((max, t) => Math.max(max, t.percentage), 0)
}

/** Highest tier reached by `amount` (only one tier ever applies). */
export function getCurrentTier(
  tiers: StorePromotionTier[],
  amount: number
): StorePromotionTier | null {
  let current: StorePromotionTier | null = null
  for (const tier of tiers) {
    if (amount >= tier.min_amount) current = tier
  }
  return current
}

/** Lowest tier not reached yet, or null when the max tier is reached. */
export function getNextTier(
  tiers: StorePromotionTier[],
  amount: number
): StorePromotionTier | null {
  return tiers.find((tier) => amount < tier.min_amount) ?? null
}

/** Amount (rounded to cents) still missing to reach the next tier. */
export function getAmountMissing(
  tiers: StorePromotionTier[],
  amount: number
): number {
  const next = getNextTier(tiers, amount)
  if (!next) return 0
  return Math.max(0, Math.round((next.min_amount - amount) * 100) / 100)
}

/**
 * Position (0-100) of each tier mark on the progress track. Matches the
 * approved design: first tier at 15%, last at 100%, the rest evenly between
 * 50% and 100% (3 tiers → 15 / 50 / 100).
 */
export function getTierMarkPositions(count: number): number[] {
  if (count <= 0) return []
  if (count === 1) return [100]
  if (count === 2) return [15, 100]
  const positions = [15]
  for (let i = 1; i < count; i++) {
    positions.push(50 + (50 * (i - 1)) / (count - 2))
  }
  return positions
}

/** Piecewise-linear fill (0-100) so every tier mark stays readable. */
export function getTierProgressPosition(
  tiers: StorePromotionTier[],
  amount: number
): number {
  if (!tiers.length || amount <= 0) return 0
  const marks = getTierMarkPositions(tiers.length)
  let prevAmount = 0
  let prevPos = 0
  for (let i = 0; i < tiers.length; i++) {
    const { min_amount } = tiers[i]
    if (amount <= min_amount) {
      const span = min_amount - prevAmount
      const ratio = span > 0 ? (amount - prevAmount) / span : 1
      return prevPos + ratio * (marks[i] - prevPos)
    }
    prevAmount = min_amount
    prevPos = marks[i]
  }
  return 100
}

// ---------------------------------------------------------------------------
// Line items / adjustments (cart and order share the shape)
// ---------------------------------------------------------------------------

export interface PromoAdjustmentLike {
  code?: string | null
  description?: string | null
  amount?: number | string | null
}

export interface PromoProductLike {
  discountable?: boolean | null
}

export interface PromoLineItemLike {
  unit_price?: number | null
  quantity?: number | null
  is_discountable?: boolean | null
  product?: PromoProductLike | null
  adjustments?: PromoAdjustmentLike[] | null
}

export interface TierAdjustmentInfo {
  name: string
  percentage: number | null
}

export interface TierDiscountSummary {
  /** Sum of every tier adjustment amount in the cart/order. */
  amount: number
  name: string
  percentage: number | null
}

/**
 * Σ unit_price × quantity of ALL items (sale and by-kilo items included),
 * before any discount or coupon and without shipping (S4/S5).
 */
export function getEligibleSubtotal(
  items: PromoLineItemLike[] | null | undefined
): number {
  if (!items?.length) return 0
  const total = items.reduce((sum, item) => {
    const unit = toFiniteNumber(item.unit_price) ?? 0
    const qty = toFiniteNumber(item.quantity) ?? 0
    return sum + unit * qty
  }, 0)
  return Math.round(total * 100) / 100
}

export function isItemDiscountable(item: PromoLineItemLike): boolean {
  return item.is_discountable !== false && item.product?.discountable !== false
}

export function isTierAdjustment(
  adjustment: PromoAdjustmentLike | null | undefined
): boolean {
  return (
    !adjustment?.code &&
    typeof adjustment?.description === "string" &&
    adjustment.description.startsWith(TIER_ADJUSTMENT_PREFIX)
  )
}

/** "Promo por monto: Buen Fin 2026 -25%" → { name: "Buen Fin 2026", percentage: 25 } */
export function parseTierAdjustmentDescription(
  description: string
): TierAdjustmentInfo {
  const rest = description.slice(TIER_ADJUSTMENT_PREFIX.length).trim()
  const match = rest.match(/^(.*?)\s*-\s*(\d+(?:[.,]\d+)?)\s*%\s*$/)
  if (!match) return { name: rest || "Promoción", percentage: null }
  return {
    name: match[1].trim() || "Promoción",
    percentage: Number(match[2].replace(",", ".")),
  }
}

/** Tier adjustment info of one item, or null if the tier did not touch it. */
export function getItemTierAdjustment(
  item: PromoLineItemLike
): TierDiscountSummary | null {
  const tierAdjustments = (item.adjustments ?? []).filter(isTierAdjustment)
  if (!tierAdjustments.length) return null
  const info = parseTierAdjustmentDescription(
    tierAdjustments[0].description as string
  )
  const amount = tierAdjustments.reduce(
    (sum, adj) => sum + (toFiniteNumber(adj.amount) ?? 0),
    0
  )
  return { ...info, amount }
}

/** Aggregated tier discount of a cart/order, or null when none applied. */
export function getTierDiscount(
  items: PromoLineItemLike[] | null | undefined
): TierDiscountSummary | null {
  const itemTiers = (items ?? [])
    .map(getItemTierAdjustment)
    .filter((tier): tier is TierDiscountSummary => tier !== null)
  if (!itemTiers.length) return null
  const amount = itemTiers.reduce((sum, tier) => sum + tier.amount, 0)
  if (amount <= 0) return null
  return {
    name: itemTiers[0].name,
    percentage: itemTiers[0].percentage,
    amount: Math.round(amount * 100) / 100,
  }
}

// ---------------------------------------------------------------------------
// Spanish text (America/Mexico_City)
// ---------------------------------------------------------------------------

interface ZonedDateParts {
  day: number
  month: string
  year: number
  time: string
}

function zonedParts(iso: string): ZonedDateParts {
  const date = new Date(iso)
  const get = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("es-MX", {
      timeZone: PROMO_TIMEZONE,
      ...options,
    }).format(date)
  return {
    day: Number(get({ day: "numeric" })),
    month: get({ month: "long" }),
    year: Number(get({ year: "numeric" })),
    time: get({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
  }
}

/** "Del 13 al 20 de noviembre" (months/years are added only when they differ). */
export function formatPromotionDateRange(
  startsAt: string,
  endsAt: string
): string {
  const s = zonedParts(startsAt)
  const e = zonedParts(endsAt)
  if (s.year !== e.year) {
    return `Del ${s.day} de ${s.month} de ${s.year} al ${e.day} de ${e.month} de ${e.year}`
  }
  if (s.month !== e.month) {
    return `Del ${s.day} de ${s.month} al ${e.day} de ${e.month}`
  }
  return `Del ${s.day} al ${e.day} de ${e.month}`
}

/** "20 de noviembre" */
export function formatPromotionDay(iso: string): string {
  const p = zonedParts(iso)
  return `${p.day} de ${p.month}`
}

/** "del 13 de noviembre a las 00:00 al 20 de noviembre de 2026 a las 23:59" */
export function formatPromotionValidity(
  startsAt: string,
  endsAt: string
): string {
  const s = zonedParts(startsAt)
  const e = zonedParts(endsAt)
  const startYear = s.year !== e.year ? ` de ${s.year}` : ""
  return `del ${s.day} de ${s.month}${startYear} a las ${s.time} al ${e.day} de ${e.month} de ${e.year} a las ${e.time}`
}

/** Day after the promotion ends, i.e. when bulk comes back: "21 de noviembre". */
export function formatDayAfter(iso: string): string {
  return formatPromotionDay(new Date(Date.parse(iso) + 1000).toISOString())
}

/** "termina en 2 días 14 h" / "empieza en 5 h 20 min" / "" when it ended. */
export function formatCountdown(
  startsAt: string,
  endsAt: string,
  now: Date = new Date()
): string {
  const t = now.getTime()
  const start = Date.parse(startsAt)
  const end = Date.parse(endsAt)
  const [verb, target] = t < start ? ["empieza", start] : ["termina", end]
  const ms = target - t
  if (ms <= 0) return ""

  const minutes = Math.floor(ms / 60_000)
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const mins = minutes % 60

  if (days > 0) {
    const dayText = `${days} ${days === 1 ? "día" : "días"}`
    return `${verb} en ${dayText}${hours ? ` ${hours} h` : ""}`
  }
  if (hours > 0) return `${verb} en ${hours} h${mins ? ` ${mins} min` : ""}`
  return `${verb} en ${Math.max(1, mins)} min`
}

/** "$1,500" for tier thresholds (whole pesos, no decimals when exact). */
export function formatTierAmount(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/** "20% desde $1,500, 25% desde $5,000 y 30% desde $10,000" */
export function formatTierList(tiers: StorePromotionTier[]): string {
  const parts = tiers.map(
    (t) => `${t.percentage}% desde ${formatTierAmount(t.min_amount)}`
  )
  if (parts.length <= 1) return parts.join("")
  return `${parts.slice(0, -1).join(", ")} y ${parts[parts.length - 1]}`
}

/** Default top-bar copy when the admin left topbar_message empty. */
export function getDefaultTopbarMessage(promotion: StorePromotion): string {
  const first = promotion.tiers[0]
  return `${promotion.name}: hasta ${getMaxPercentage(promotion.tiers)}% de descuento desde ${formatTierAmount(first.min_amount)}`
}

/**
 * Example cart amount for the tier calculator: 20% above the threshold,
 * rounded up to the next thousand ($1,500 → $2,000, $5,000 → $6,000).
 */
export function getTierExampleAmount(tier: StorePromotionTier): number {
  return Math.max(1000, Math.ceil((tier.min_amount * 1.2) / 1000) * 1000)
}

// ---------------------------------------------------------------------------
// FAQ (S13)
// ---------------------------------------------------------------------------

export const BULK_FAQ_QUESTION = "¿Tienen descuentos por mayoreo?"

/** Paragraphs of the bulk FAQ answer for the current state (plain text). */
export function getBulkFaqParagraphs(state: StorePromotionState): string[] {
  const { bulk, promotion } = state

  if (promotion) {
    const range = formatPromotionDateRange(promotion.starts_at, promotion.ends_at)
    const bulkNote = bulk.enabled
      ? `Durante esas fechas no aplica el descuento de ${bulk.threshold} piezas; regresa el ${formatDayAfter(promotion.ends_at)}.`
      : "Durante esas fechas no aplica el descuento por mayoreo."
    return [
      `${range} tenemos ${promotion.name}: ${formatTierList(promotion.tiers)} en tu compra.`,
      `${bulkNote} No aplica a productos por kilo.`,
    ]
  }

  if (bulk.enabled) {
    return [
      `Por mayoreo manejamos un descuento de ${bulk.percentage}% a partir de ${bulk.threshold} piezas. Pueden ser de productos diferentes.`,
      "El descuento no aplica a productos por kilo ni a productos que ya cuenten con un descuento o promoción activa.",
      `El descuento para los pedidos realizados por la página web entrará automáticamente cuando seleccione ${bulk.threshold} piezas o más. En el carrito podrá ver a qué productos se les aplicó el descuento.`,
    ]
  }

  return [
    "Por el momento no tenemos un descuento automático por mayoreo en la tienda en línea.",
    "Escríbenos por WhatsApp y con gusto te ayudamos con tu pedido de mayoreo.",
  ]
}
