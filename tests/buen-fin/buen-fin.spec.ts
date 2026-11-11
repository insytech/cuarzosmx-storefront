import { BrowserContext, expect, Locator, Page, test } from "@playwright/test"
import { CheckoutPage } from "../checkout/checkout-page"
import { acceptCookiesUpfront, COUNTRY_CODE } from "../helpers"

/**
 * Buen Fin tiered promotion (specs S9–S13), driven through the real UI.
 *
 * Preconditions (local dev DB, see odd/tasks/buen-fin-promociones.md L9/L11):
 * "Buen Fin 2026" in force 2026-11-10 00:00 → 2026-11-20 23:59 Mexico City,
 * tiers 1500/20, 5000/25, 10000/30, show_band on, logo and top-bar message set.
 * The cart tests use a $400 discountable product with a single variant.
 *
 * Only localhost traffic is allowed; third-party requests are aborted.
 * Each test starts from a fresh context with the cart cookie cleared.
 *
 * Note: the storefront renders the minus sign of discounts as U+2212 ("−"),
 * so the exact texts below use that character. Cart money goes through
 * convertToLocale (en-US + MXN) and renders as "MX$1,280.00"; tier thresholds
 * use formatTierAmount (es-MX, narrow symbol) and render as "$1,500".
 */

const PRODUCT_HANDLE =
  process.env.E2E_BUEN_FIN_PRODUCT_HANDLE ?? "catedrales-de-cuarzo-121"
const PROMO_NAME = "Buen Fin 2026"
const MINUS = "−"
const PROMOTION_RED = "rgb(220, 53, 69)" // #DC3545

type ActivePromotion = {
  bulk: { enabled: boolean; applies: boolean; threshold: number; percentage: number }
  promotion: {
    name: string
    topbar_message: string | null
    tiers: { min_amount: number; percentage: number }[]
  } | null
}

async function blockThirdParty(context: BrowserContext): Promise<void> {
  await context.route("**/*", (route) => {
    const { hostname } = new URL(route.request().url())
    return hostname === "localhost" || hostname === "127.0.0.1"
      ? route.continue()
      : route.abort()
  })
}

/** Resolves with the JSON the browser receives from GET /store/promotions/active. */
function waitForActivePromotion(page: Page): Promise<ActivePromotion> {
  return page
    .waitForResponse(
      (res) =>
        res.url().includes("/store/promotions/active") &&
        res.request().method() === "GET" &&
        res.ok()
    )
    .then((res) => res.json() as Promise<ActivePromotion>)
}

/** Quantity controls of the (single) cart row, desktop or mobile, whichever is visible. */
function quantityControls(page: Page) {
  const row = page.getByTestId("product-row").first()
  const plus = row
    .locator("button:has(path[d='M12 4v16m8-8H4'])")
    .locator("visible=true")
    .first()
  const minus = row
    .locator("button:has(path[d='M20 12H4'])")
    .locator("visible=true")
    .first()
  const value = plus.locator("xpath=preceding-sibling::span[1]")
  return { plus, minus, value }
}

/** Steps the quantity one unit at a time through the +/- buttons until `target`. */
async function setQuantity(page: Page, target: number): Promise<void> {
  const { plus, minus, value } = quantityControls(page)
  await expect(value).toHaveText(/^\d+$/)
  let current = Number(await value.innerText())
  while (current !== target) {
    const next = current < target ? current + 1 : current - 1
    await (current < target ? plus : minus).click()
    await expect(value).toHaveText(String(next))
    current = next
  }
}

function visible(page: Page, testId: string): Locator {
  return page.getByTestId(testId).locator("visible=true").first()
}

async function expectTotal(page: Page, text: string, value: number) {
  const total = visible(page, "cart-total")
  await expect(total).toHaveText(text)
  await expect(total).toHaveAttribute("data-value", String(value))
}

/** Adds the $400 product and opens the cart with `quantity` units. */
async function cartWith(page: Page, quantity: number): Promise<CheckoutPage> {
  const checkout = new CheckoutPage(page)
  await checkout.addProductToCart(PRODUCT_HANDLE)
  await checkout.openCart()
  await setQuantity(page, quantity)
  return checkout
}

// Video needs Playwright's downloaded ffmpeg, which this machine's policy
// blocks (PLAYWRIGHT_BROWSERS_PATH is an empty read-only dir). Traces and
// screenshots on failure are kept.
test.use({ video: "off" })

test.beforeEach(async ({ context }) => {
  await context.clearCookies({ name: "_medusa_cart_id" })
  await acceptCookiesUpfront(context)
  await blockThirdParty(context)
})

test.afterEach(async ({ context }) => {
  await context.clearCookies({ name: "_medusa_cart_id" })
})

test.describe("Buen Fin - home", () => {
  test(
    "desktop: red top bar, nav link and season band with tiers and CTA",
    { tag: ["@buen-fin", "@BUEN-FIN-001"] },
    async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      const activePromotion = waitForActivePromotion(page)
      await page.goto(`/${COUNTRY_CODE}`, { waitUntil: "domcontentloaded" })
      const { promotion } = await activePromotion
      expect(promotion, "a promotion must be in force for this suite").not.toBeNull()
      expect(promotion!.name).toBe(PROMO_NAME)

      // S10: top bar shows the promotion message on red
      const topBar = page.getByTestId("top-bar")
      await expect(topBar).toHaveAttribute("data-season", "promotion")
      await expect(topBar).toHaveCSS("background-color", PROMOTION_RED)
      const expectedMessage =
        promotion!.topbar_message ??
        `${PROMO_NAME}: hasta 30% de descuento desde $1,500`
      await expect(topBar.locator("span").first()).toHaveText(expectedMessage)

      // S12: red "Buen Fin" nav link
      const navLink = page.getByTestId("nav-buen-fin-link")
      await expect(navLink).toBeVisible()
      await expect(navLink).toHaveText("Buen Fin")
      await expect(navLink).toHaveCSS("color", "rgb(167, 29, 42)") // #A71D2A

      // S11: band
      const band = page.getByTestId("season-band")
      await expect(band).toBeVisible()
      await expect(band).toHaveAttribute("aria-label", PROMO_NAME)
      await expect(band.getByRole("img", { name: `Logo de ${PROMO_NAME}` })).toBeVisible()
      await expect(band.getByRole("heading", { level: 2 })).toHaveText(
        "Hasta 30% de descuento en toda la tienda"
      )
      await expect(band.locator("p").first()).toHaveText(
        "Del 10 al 20 de noviembre · Se aplica solo en tu carrito."
      )
      const chips = band.getByRole("list", { name: "Descuentos por monto de compra" })
        .getByRole("listitem")
      await expect(chips).toHaveText([
        "20%desde $1,500",
        "25%desde $5,000",
        "30%desde $10,000",
      ])

      const cta = page.getByTestId("season-band-cta")
      await expect(cta).toHaveText("Ver promociones →")
      await cta.click()
      await page.waitForURL(`**/${COUNTRY_CODE}/buen-fin`)
      await expect(page.getByTestId("buen-fin-page")).toBeVisible()
    }
  )

  test(
    "390px: band stacks, CTA spans the band, mobile nav link visible",
    { tag: ["@buen-fin", "@BUEN-FIN-002"] },
    async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(`/${COUNTRY_CODE}`, { waitUntil: "domcontentloaded" })

      const navLink = page.getByTestId("nav-buen-fin-link-mobile")
      await expect(navLink).toBeVisible()
      await expect(navLink).toHaveText("Buen Fin")
      await expect(page.getByTestId("nav-buen-fin-link")).toBeHidden()

      const band = page.getByTestId("season-band")
      await expect(band).toBeVisible()
      await expect(band).toHaveCSS("flex-direction", "column")

      const logo = band.getByRole("img", { name: `Logo de ${PROMO_NAME}` })
      const heading = band.getByRole("heading", { level: 2 })
      const chips = band.getByRole("list", { name: "Descuentos por monto de compra" })
      const cta = page.getByTestId("season-band-cta")

      const [bLogo, bHeading, bChips, bCta, bBand] = await Promise.all(
        [logo, heading, chips, cta, band].map(async (l) => {
          const box = await l.boundingBox()
          expect(box).not.toBeNull()
          return box!
        })
      )
      // Stacked vertically: logo → heading → chips → CTA
      expect(bHeading.y).toBeGreaterThanOrEqual(bLogo.y + bLogo.height - 1)
      expect(bChips.y).toBeGreaterThanOrEqual(bHeading.y + bHeading.height - 1)
      expect(bCta.y).toBeGreaterThanOrEqual(bChips.y + bChips.height - 1)
      // Three chips on one row
      const chipBoxes = await Promise.all(
        [0, 1, 2].map(async (i) => (await chips.getByRole("listitem").nth(i).boundingBox())!)
      )
      expect(new Set(chipBoxes.map((b) => Math.round(b.y))).size).toBe(1)
      // CTA full width inside the band's 16px side padding
      expect(Math.abs(bCta.width - (bBand.width - 32))).toBeLessThanOrEqual(1)
      // Nothing overflows the viewport horizontally
      expect(bBand.x).toBeGreaterThanOrEqual(0)
      expect(bBand.x + bBand.width).toBeLessThanOrEqual(390)
    }
  )
})

test.describe("Buen Fin - /buen-fin page", () => {
  test(
    "hero, tier card with examples, how it works and terms",
    { tag: ["@buen-fin", "@BUEN-FIN-003"] },
    async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      const activePromotion = waitForActivePromotion(page)
      await page.goto(`/${COUNTRY_CODE}/buen-fin`, { waitUntil: "domcontentloaded" })
      const { bulk } = await activePromotion

      const root = page.getByTestId("buen-fin-page")
      await expect(root).toBeVisible()
      await expect(page.getByTestId("buen-fin-empty")).toHaveCount(0)

      // Hero
      await expect(root.getByRole("img", { name: `Logo de ${PROMO_NAME}` })).toBeVisible()
      await expect(root.getByText(`${PROMO_NAME} en Cuarzos MX`, { exact: true })).toBeVisible()
      await expect(root.getByRole("heading", { level: 1 })).toHaveText(
        "Entre más cristales llevas, más ahorras"
      )
      await expect(
        root.getByText(
          "Hasta 30% de descuento en toda la tienda, aplicado automáticamente en tu carrito. Se combina con cupones."
        )
      ).toBeVisible()
      await expect(
        root.getByText(/^Del 10 al 20 de noviembre · termina en \d+ días?( \d+ h)?$/)
      ).toBeVisible()

      // Tier calculator card
      const card = root
        .getByRole("heading", { name: "Tu descuento según tu compra" })
        .locator("xpath=..")
      await expect(card.getByRole("listitem")).toHaveText([
        "20%Desde $1,500$2,000 → pagas $1,600",
        "25%Desde $5,000$6,000 → pagas $4,500",
        "30%Desde $10,000$12,000 → pagas $8,400",
      ])

      // Cómo funciona
      const how = root.locator("section[aria-labelledby='bf-how']")
      await expect(how.getByRole("heading", { level: 2 })).toHaveText("CÓMO FUNCIONA")
      await expect(how.getByText("Sin códigos: el descuento aparece solo en tu carrito.")).toBeVisible()
      await expect(how.getByRole("heading", { level: 3 })).toHaveText([
        "Elige tus cristales",
        "Mira tu avance",
        "Paga con descuento",
      ])

      // Terms generated from the promotion
      const terms = root.locator("section[aria-labelledby='bf-terms']")
      await expect(terms.getByRole("heading", { level: 2 })).toHaveText(
        "Términos de la promoción"
      )
      await expect(terms.getByRole("listitem")).toHaveText([
        "Vigencia: del 10 de noviembre a las 00:00 al 20 de noviembre de 2026 a las 23:59 (hora del centro de México).",
        "Descuentos: 20% desde $1,500, 25% desde $5,000, 30% desde $10,000.",
        "El monto se calcula sobre el subtotal de productos, sin envío. Se aplica un solo rango: el más alto alcanzado.",
        "Los productos con oferta reciben el descuento sobre su precio rebajado. Los productos por kilo suman para el monto pero no reciben descuento.",
        bulk.enabled
          ? "Se combina con cupones. No se combina con el descuento por mayoreo, que regresa el 21 de noviembre."
          : "Se combina con cupones. No se combina con el descuento por mayoreo.",
      ])
    }
  )
})

test.describe("Buen Fin - cart tiers", () => {
  test(
    "cart moves through no discount → 20% → 25% → no discount",
    { tag: ["@buen-fin", "@cart", "@BUEN-FIN-004"] },
    async ({ page }) => {
      test.setTimeout(300_000)
      await page.setViewportSize({ width: 1440, height: 900 })
      await cartWith(page, 3)

      const progress = visible(page, "tier-progress")
      const tierRow = page.getByTestId("cart-tier-discount")

      // 3 × $400 = $1,200 → below the first tier
      await expect(visible(page, "cart-subtotal")).toHaveText("MX$1,200.00")
      await expect(progress.locator("b").first()).toHaveText(
        `${PROMO_NAME}: hasta 30% de descuento`
      )
      await expect(progress.locator("span").first()).toHaveText("Sin descuento")
      await expect(progress.locator("p")).toHaveText(
        "Agrega MX$300.00 más y obtén 20% en toda tu compra."
      )
      await expect(tierRow).toHaveCount(0)
      await expectTotal(page, "MX$1,200.00", 1200)

      // 4 × $400 = $1,600 → 20%
      await setQuantity(page, 4)
      await expect(progress.locator("b").first()).toHaveText("Ya tienes 20% de descuento")
      await expect(progress.locator("span").first()).toHaveText(`${MINUS}20%`)
      await expect(progress.locator("p")).toHaveText(
        "Agrega MX$3,400.00 más y obtén 25% en toda tu compra."
      )
      await expect(tierRow).toHaveText(`${MINUS}MX$320.00`)
      await expect(tierRow).toHaveAttribute("data-value", "320")
      await expect(tierRow.locator("xpath=..")).toHaveText(
        `${PROMO_NAME} ${MINUS}20%${MINUS}MX$320.00`
      )
      await expect(visible(page, "product-tier-discount")).toHaveText(
        `${MINUS}20% ${PROMO_NAME}`
      )
      await expect(page.getByTestId("cart-tier-savings")).toHaveText(
        `Ahorras MX$320.00 con ${PROMO_NAME}`
      )
      await expectTotal(page, "MX$1,280.00", 1280)

      // 13 × $400 = $5,200 → 25%; bulk (12+ units) stays paused
      await setQuantity(page, 13)
      await expect(progress.locator("b").first()).toHaveText("Ya tienes 25% de descuento")
      await expect(progress.locator("p")).toHaveText(
        "Agrega MX$4,800.00 más y obtén 30% en toda tu compra."
      )
      await expect(tierRow.locator("xpath=..")).toHaveText(
        `${PROMO_NAME} ${MINUS}25%${MINUS}MX$1,300.00`
      )
      await expectTotal(page, "MX$3,900.00", 3900)
      await expect(page.getByTestId("cart-bulk-discount")).toHaveCount(0)
      await expect(page.getByText("¡Felicidades! Descuento aplicado")).toHaveCount(0)
      await expect(page.getByText(/Estás muy cerca del/)).toHaveCount(0)
      await expect(page.getByText("No aplica desc. mayoreo")).toHaveCount(0)

      // Back to 3 units → discount removed
      await setQuantity(page, 3)
      await expect(progress.locator("span").first()).toHaveText("Sin descuento")
      await expect(progress.locator("p")).toHaveText(
        "Agrega MX$300.00 más y obtén 20% en toda tu compra."
      )
      await expect(tierRow).toHaveCount(0)
      await expect(page.getByTestId("product-tier-discount")).toHaveCount(0)
      await expect(page.getByTestId("cart-tier-savings")).toHaveCount(0)
      await expectTotal(page, "MX$1,200.00", 1200)
    }
  )
})

test.describe("Buen Fin - mini cart and checkout", () => {
  test(
    "mini cart and checkout summary show the tier row",
    { tag: ["@buen-fin", "@cart", "@BUEN-FIN-005"] },
    async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await cartWith(page, 4)
      await expectTotal(page, "MX$1,280.00", 1280)

      // Mini cart (nav dropdown) on a non-cart page
      await page.goto(`/${COUNTRY_CODE}/buen-fin`, { waitUntil: "domcontentloaded" })
      const cartLink = page.getByTestId("nav-cart-link").locator("visible=true").first()
      await expect(cartLink).toHaveText("Carrito (4)")
      await cartLink.hover()
      const dropdown = page.getByTestId("nav-cart-dropdown")
      await expect(dropdown).toBeVisible()
      await expect(dropdown.getByTestId("cart-dropdown-tier-discount")).toHaveText(
        `${PROMO_NAME} ${MINUS}20% incluido${MINUS}MX$320.00`
      )
      await expect(dropdown.getByTestId("tier-progress-compact").locator("p")).toHaveText(
        "Ya tienes 20%. Agrega MX$3,400.00 más y obtén 25%."
      )

      // Checkout summary
      await page.goto(`/${COUNTRY_CODE}/checkout?step=address`, {
        waitUntil: "domcontentloaded",
      })
      const compact = visible(page, "tier-progress-compact")
      await expect(compact.locator("p")).toHaveText(
        "Ya tienes 20%. Agrega MX$3,400.00 más y obtén 25%."
      )
      const tierRow = visible(page, "cart-tier-discount")
      await expect(tierRow).toHaveText(`${MINUS}MX$320.00`)
      await expect(tierRow.locator("xpath=..")).toHaveText(
        `${PROMO_NAME} ${MINUS}20%${MINUS}MX$320.00`
      )
      await expect(visible(page, "product-tier-discount")).toHaveText(
        `${MINUS}20% ${PROMO_NAME}`
      )
      await expectTotal(page, "MX$1,280.00", 1280)
    }
  )
})
