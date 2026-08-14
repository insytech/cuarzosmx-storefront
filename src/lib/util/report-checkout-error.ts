/**
 * Fire-and-forget checkout error telemetry.
 *
 * WHY: a card-form (Mercado Pago Brick) failure happens entirely in the browser.
 * MP never sees it (a card rejected by client-side validation never reaches MP)
 * and neither does our backend, so payment-step abandonment was unanswerable.
 * This posts the raw MP error code to `/store/checkout-error`, which logs one
 * `[checkout-error]` line for Railway. Observability only — nothing here may
 * ever block, delay or break the checkout.
 *
 * PRIVACY: only the fields below are ever sent. NEVER add card data (number,
 * BIN, CVV, expiry, cardholder name) or PII (email, address, phone) — the
 * backend whitelists and sanitizes anyway, but the rule starts here.
 */

export type CheckoutErrorStep =
    | "payment"
    | "payment_brick_mount"
    | "payment_tokenization"
    | "review"

type CheckoutErrorReport = {
    /** Raw MP error code, e.g. "no_payment_method_for_provided_bin". */
    code: string
    /** Broad MP category, e.g. "missing_payment_information". */
    cause?: string
    type?: "critical" | "non_critical"
    cartId?: string
    step: CheckoutErrorStep
}

/**
 * A single mis-typed card makes the Brick fire the same error on every
 * keystroke, so identical reports are collapsed: the same code for the same
 * cart is sent at most once per window.
 */
const DEDUPE_WINDOW_MS = 60 * 1000
const MAX_TRACKED_KEYS = 50

const recentlyReported = new Map<string, number>()

function shouldReport(key: string): boolean {
    const now = Date.now()

    // Opportunistic cleanup, keeps the map from growing on a long session.
    if (recentlyReported.size > MAX_TRACKED_KEYS) {
        recentlyReported.forEach((at, k) => {
            if (now - at > DEDUPE_WINDOW_MS) {
                recentlyReported.delete(k)
            }
        })
    }

    const last = recentlyReported.get(key)
    if (last !== undefined && now - last < DEDUPE_WINDOW_MS) {
        return false
    }

    recentlyReported.set(key, now)
    return true
}

export function reportCheckoutError(report: CheckoutErrorReport): void {
    try {
        if (typeof window === "undefined" || !report?.code) {
            return
        }

        const key = `${report.cartId || "none"}:${report.code}`
        if (!shouldReport(key)) {
            return
        }

        const backendUrl =
            process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

        // Not awaited on purpose: checkout never waits on telemetry.
        // `keepalive` lets the report survive the shopper navigating away.
        void fetch(`${backendUrl}/store/checkout-error`, {
            method: "POST",
            keepalive: true,
            headers: {
                "Content-Type": "application/json",
                // Every /store/* route in Medusa v2 requires this header.
                "x-publishable-api-key":
                    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
            },
            body: JSON.stringify({
                code: report.code,
                cause: report.cause,
                type: report.type,
                cart_id: report.cartId,
                step: report.step,
            }),
        }).catch(() => {
            // Swallowed: a failed report must never surface to the shopper
            // nor produce an unhandled rejection.
        })
    } catch {
        // Same contract for anything synchronous (bad env, blocked fetch, ...).
    }
}
