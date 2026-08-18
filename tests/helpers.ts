import { BrowserContext } from "@playwright/test"

/** Storefront region prefix. Only `mx` exists today (region Mexico / MXN). */
export const COUNTRY_CODE = "mx"

/**
 * Mercado Pago test cards for Mexico (siteId MLM).
 * Source: Mercado Pago docs, "Tarjetas de prueba" (MLM table).
 *
 * The payment RESULT is driven by the cardholder name, not the card number:
 * `APRO` -> approved, `OTHE` -> rejected, `FUND` -> insufficient funds, etc.
 * MLM does not require an identification document, which is why the Brick
 * renders no document field for this site.
 *
 * These only work against a TEST access token / TEST public key.
 */
export const MP_TEST_CARDS = {
  creditMastercard: {
    number: "5474925432670366",
    expiry: "11/30",
    cvv: "123",
  },
  creditVisa: {
    number: "4075595716483764",
    expiry: "11/30",
    cvv: "123",
  },
  debitMastercard: {
    number: "5579053461482647",
    expiry: "11/30",
    cvv: "123",
  },
} as const

/** Cardholder names that select the payment outcome in MP's sandbox. */
export const MP_HOLDER = {
  approved: "APRO",
  rejectedGeneral: "OTHE",
  pending: "CONT",
  insufficientFunds: "FUND",
  invalidCvv: "SECU",
} as const

export const TEST_CUSTOMER = {
  firstName: "Test",
  lastName: "Playwright",
  address1: "Av Siempre Viva 742",
  address2: "Centro",
  postalCode: "98000",
  city: "Zacatecas",
  countryCode: "mx",
  /** Value of the <option>, not its label — the select uses state codes. */
  province: "ZAC",
  /**
   * Must be a domain Mercado Pago accepts: it validates `payer.email` and
   * rejects reserved TLDs like `.test` with "payer.email must be a valid
   * email", which fails the charge *after* the card is already tokenized.
   * Do not use the seller test user's own address either — MP refuses
   * payments where payer and collector are the same account.
   */
  email: "e2e-checkout@example.com",
  phone: "4921234567",
} as const

/**
 * The cookie-consent banner renders a full-screen overlay (z-9998/9999) that
 * swallows every click until dismissed. Seeding the same localStorage keys the
 * banner itself writes keeps it from ever mounting, which is far more stable
 * than racing its animation on each page.
 *
 * Keys come from src/lib/context/cookie-consent-context.tsx.
 */
export async function acceptCookiesUpfront(context: BrowserContext): Promise<void> {
  await context.addInitScript(() => {
    localStorage.setItem("cuarzosmx_cookie_consent", "true")
    localStorage.setItem(
      "cuarzosmx_cookie_preferences",
      JSON.stringify({
        necessary: true,
        functional: true,
        analytics: false,
        marketing: false,
      })
    )
  })
}

/** Parses the `data-value` of a cart-totals node into a number of pesos. */
export function toAmount(dataValue: string | null): number {
  const n = Number(dataValue)
  if (!Number.isFinite(n)) {
    throw new Error(`Expected a numeric data-value, got: ${dataValue}`)
  }
  return n
}
