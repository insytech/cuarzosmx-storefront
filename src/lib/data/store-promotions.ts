import "server-only"

import {
  FALLBACK_PROMOTION_STATE,
  parseStorePromotionState,
  resolvePromotionState,
  type StorePromotionState,
} from "@lib/util/store-promotion"

const BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  "http://localhost:9000"

const PUBLISHABLE_API_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

/** The backend endpoint is cacheable for 60s; keep the same window here. */
const REVALIDATE_SECONDS = 60
const TIMEOUT_MS = 3000

/**
 * Active store-wide promotion + bulk discount switch
 * (GET /store/promotions/active).
 *
 * Never throws: on error, timeout or a malformed body it returns the
 * pre-promotion behaviour (bulk 20% from 12 pieces, no promotion), so the
 * storefront keeps working while the backend is down or not deployed yet.
 */
export async function getActiveStorePromotion(): Promise<StorePromotionState> {
  try {
    const response = await fetch(`${BACKEND_URL}/store/promotions/active`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": PUBLISHABLE_API_KEY,
      },
      next: { revalidate: REVALIDATE_SECONDS, tags: ["store-promotions"] },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })

    if (!response.ok) {
      console.warn(
        `store/promotions/active returned ${response.status}, using bulk-only fallback`
      )
      return FALLBACK_PROMOTION_STATE
    }

    const state = parseStorePromotionState(await response.json())
    // A cached response may outlive the promotion window (or start early).
    return resolvePromotionState(state)
  } catch (error) {
    console.warn(
      "store/promotions/active failed, using bulk-only fallback:",
      error
    )
    return FALLBACK_PROMOTION_STATE
  }
}
