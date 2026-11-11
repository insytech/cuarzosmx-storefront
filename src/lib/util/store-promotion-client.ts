"use client"

import { useEffect, useState } from "react"
import {
  FALLBACK_PROMOTION_STATE,
  parseStorePromotionState,
  resolvePromotionState,
  type StorePromotionState,
} from "./store-promotion"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
const TIMEOUT_MS = 3000
/** Same window as the backend cache, so a long-lived tab picks up changes. */
const MAX_AGE_MS = 60_000

let inflight: Promise<StorePromotionState> | null = null
let fetchedAt = 0

/**
 * Browser-side read of GET /store/promotions/active, for client components
 * whose server parent is outside this feature (e.g. the mini cart). One
 * request per page load; failures degrade to bulk-only.
 */
export function fetchActiveStorePromotionClient(): Promise<StorePromotionState> {
  if (!inflight || Date.now() - fetchedAt > MAX_AGE_MS) {
    fetchedAt = Date.now()
    inflight = fetch(`${BACKEND_URL}/store/promotions/active`, {
      headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) =>
        json === null
          ? FALLBACK_PROMOTION_STATE
          : resolvePromotionState(parseStorePromotionState(json))
      )
      .catch(() => {
        inflight = null
        return FALLBACK_PROMOTION_STATE
      })
  }
  return inflight
}

/** null while loading; then the resolved state (never throws). */
export function useActiveStorePromotion(): StorePromotionState | null {
  const [state, setState] = useState<StorePromotionState | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchActiveStorePromotionClient().then((value) => {
      if (!cancelled) setState(value)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
