import { BrowserContext, expect, Page, test } from "@playwright/test"
import { acceptCookiesUpfront, COUNTRY_CODE } from "../helpers"
import {
  getSeasonPalette,
  parseStorePromotionState,
  type StorePromotion,
} from "../../src/lib/util/store-promotion"

/**
 * Season identity of the promotion in force (odd/tasks/promociones-identidad.md
 * S6, S7): menu text, page address, colour, headline and subtitle come from
 * GET /store/promotions/active instead of being hardcoded as Buen Fin.
 *
 * Nothing is mocked: the pages are server-rendered against the real backend,
 * so what each test can assert depends on the promotion in force in the local
 * dev DB. Only one promotion is in force at a time:
 *
 * - PROMO-ID-001 and PROMO-ID-004 run with ANY promotion in force.
 * - PROMO-ID-002 needs one with another identity, by default the "Hot Sale"
 *   example: menu "Hot Sale", address `hot-sale`, colour #C2410C. Activate it
 *   in the admin with dates that include today and a headline, or point the
 *   test at another promotion with E2E_PROMO_SLUG / E2E_PROMO_MENU_LABEL /
 *   E2E_PROMO_COLOR / E2E_PROMO_HEADLINE. Skipped otherwise.
 * - PROMO-ID-003 needs the Buen Fin identity (the backfilled "Buen Fin 2026",
 *   or a backend that does not send identity fields yet). Skipped otherwise.
 *
 * Only localhost traffic is allowed; third-party requests are aborted.
 */

const OTHER_IDENTITY = {
  slug: process.env.E2E_PROMO_SLUG ?? "hot-sale",
  menuLabel: process.env.E2E_PROMO_MENU_LABEL ?? "Hot Sale",
  color: process.env.E2E_PROMO_COLOR ?? "#C2410C",
  headline: process.env.E2E_PROMO_HEADLINE ?? null,
}

const BUEN_FIN_RED = "rgb(220, 53, 69)" // #DC3545
const BUEN_FIN_DARK_RED = "rgb(167, 29, 42)" // #A71D2A
const BUEN_FIN_HEADLINE = "Entre más cristales llevas, más ahorras"

/** "#C2410C" → "rgb(194, 65, 12)", the way getComputedStyle reports it. */
function rgb(hex: string): string {
  const channel = (i: number) => parseInt(hex.slice(i, i + 2), 16)
  return `rgb(${channel(1)}, ${channel(3)}, ${channel(5)})`
}

async function blockThirdParty(context: BrowserContext): Promise<void> {
  await context.route("**/*", (route) => {
    const { hostname } = new URL(route.request().url())
    return hostname === "localhost" || hostname === "127.0.0.1"
      ? route.continue()
      : route.abort()
  })
}

/**
 * Opens the home page and returns the promotion in force as the storefront
 * itself parses it (same fallbacks), taken from the browser's own request to
 * GET /store/promotions/active.
 */
async function openHome(page: Page): Promise<StorePromotion | null> {
  const response = page.waitForResponse(
    (res) =>
      res.url().includes("/store/promotions/active") &&
      res.request().method() === "GET" &&
      res.ok()
  )
  await page.goto(`/${COUNTRY_CODE}`, { waitUntil: "domcontentloaded" })
  return parseStorePromotionState(await (await response).json()).promotion
}

/** Asserts every identity-driven surface against `promotion`. */
async function expectIdentity(page: Page, promotion: StorePromotion) {
  const palette = getSeasonPalette(promotion.season_color)
  const pagePath = `/${COUNTRY_CODE}/promociones/${promotion.page_slug}`

  // Top bar: season colour
  const topBar = page.getByTestId("top-bar")
  await expect(topBar).toHaveAttribute("data-season", "promotion")
  await expect(topBar).toHaveCSS("background-color", rgb(palette.base))

  // Nav link (desktop): menu text, page address, darker shade of the colour
  const navLink = page.getByTestId("nav-buen-fin-link")
  await expect(navLink).toBeVisible()
  await expect(navLink).toHaveText(promotion.menu_label)
  await expect(navLink).toHaveAttribute("href", pagePath)
  await expect(navLink).toHaveCSS("color", rgb(palette.dark))

  // Home band (only when the promotion shows it)
  if (promotion.show_band) {
    const band = page.getByTestId("season-band")
    await expect(band).toBeVisible()
    await expect(band).toHaveCSS(
      "background-image",
      `linear-gradient(to right, ${rgb(palette.dark)}, ${rgb(palette.base)})`
    )
    const percent = band
      .getByRole("list", { name: "Descuentos por monto de compra" })
      .locator("b")
      .first()
    await expect(percent).toHaveCSS("color", rgb(palette.base))
    const cta = page.getByTestId("season-band-cta")
    await expect(cta).toHaveAttribute("href", pagePath)
    await expect(cta).toHaveCSS("color", rgb(palette.dark))
  }

  // Mobile nav link
  await page.setViewportSize({ width: 390, height: 844 })
  const mobileLink = page.getByTestId("nav-buen-fin-link-mobile")
  await expect(mobileLink).toBeVisible()
  await expect(mobileLink).toHaveText(promotion.menu_label)
  await expect(mobileLink).toHaveAttribute("href", pagePath)
  await expect(mobileLink).toHaveCSS("color", rgb(palette.dark))
  await page.setViewportSize({ width: 1440, height: 900 })

  // Promotion page: reached from the nav link, at /promociones/{slug}
  await navLink.click()
  await page.waitForURL(`**${pagePath}`)
  const root = page.getByTestId("buen-fin-page")
  await expect(root).toBeVisible()
  await expect(page.getByTestId("buen-fin-empty")).toHaveCount(0)

  const maxPct = Math.max(...promotion.tiers.map((t) => t.percentage))
  await expect(root.getByRole("heading", { level: 1 })).toHaveText(
    promotion.page_headline ?? BUEN_FIN_HEADLINE
  )
  await expect(
    root.getByText(
      promotion.page_subtitle ??
        `Hasta ${maxPct}% de descuento en toda la tienda, aplicado automáticamente en tu carrito. Se combina con cupones.`,
      { exact: true }
    )
  ).toBeVisible()

  const hero = root.locator("section[aria-labelledby='bf-h1']")
  await expect(hero).toHaveCSS(
    "background-image",
    `radial-gradient(120% 120% at 80% 0%, ${rgb(palette.light)} 0%, ${rgb(palette.base)} 45%, ${rgb(palette.dark)} 100%)`
  )
  const tierPercent = root
    .getByRole("heading", { name: "Tu descuento según tu compra" })
    .locator("xpath=..")
    .locator("b")
    .first()
  await expect(tierPercent).toHaveCSS("color", rgb(palette.base))
}

// Video needs Playwright's ffmpeg, blocked on this machine (see buen-fin.spec.ts).
test.use({ video: "off" })

test.beforeEach(async ({ context, page }) => {
  await acceptCookiesUpfront(context)
  await blockThirdParty(context)
  await page.setViewportSize({ width: 1440, height: 900 })
})

test.describe("Promotion identity", () => {
  test(
    "nav, top bar, home band and page follow the identity of the promotion in force",
    { tag: ["@buen-fin", "@promo-identity", "@PROMO-ID-001"] },
    async ({ page }) => {
      const promotion = await openHome(page)
      expect(promotion, "a promotion must be in force for this test").not.toBeNull()
      await expectIdentity(page, promotion!)
    }
  )

  test(
    "a promotion with another identity (Hot Sale) replaces every Buen Fin text, colour and address",
    { tag: ["@buen-fin", "@promo-identity", "@PROMO-ID-002"] },
    async ({ page }) => {
      const promotion = await openHome(page)
      test.skip(
        promotion?.page_slug !== OTHER_IDENTITY.slug,
        `needs the promotion with address "${OTHER_IDENTITY.slug}" in force (found "${promotion?.page_slug ?? "none"}")`
      )
      // The identity the admin configured, as literals
      expect(promotion!.menu_label).toBe(OTHER_IDENTITY.menuLabel)
      expect(promotion!.season_color).toBe(OTHER_IDENTITY.color.toUpperCase())
      expect(promotion!.season_color).not.toBe("#DC3545")
      if (OTHER_IDENTITY.headline) {
        expect(promotion!.page_headline).toBe(OTHER_IDENTITY.headline)
      }

      // Nothing on the home page keeps the Buen Fin label, address or red
      await expect(page.getByTestId("nav-buen-fin-link")).toHaveText(
        OTHER_IDENTITY.menuLabel
      )
      await expect(page.getByTestId("nav-buen-fin-link")).not.toHaveCSS(
        "color",
        BUEN_FIN_DARK_RED
      )
      await expect(page.getByTestId("top-bar")).toHaveCSS(
        "background-color",
        rgb(OTHER_IDENTITY.color)
      )
      await expect(page.locator(`a[href$="/buen-fin"]`)).toHaveCount(0)

      await expectIdentity(page, promotion!)
      if (promotion!.page_headline) {
        await expect(
          page.getByTestId("buen-fin-page").getByRole("heading", { level: 1 })
        ).not.toHaveText(BUEN_FIN_HEADLINE)
      }

      // The Buen Fin address is not the one in force: friendly message, no 404
      const response = await page.goto(
        `/${COUNTRY_CODE}/promociones/buen-fin`,
        { waitUntil: "domcontentloaded" }
      )
      expect(response?.status()).toBe(200)
      await expect(page.getByTestId("buen-fin-empty")).toBeVisible()
      await expect(page.getByTestId("buen-fin-page")).toHaveCount(0)
    }
  )

  test(
    "Buen Fin identity renders exactly as before",
    { tag: ["@buen-fin", "@promo-identity", "@PROMO-ID-003"] },
    async ({ page }) => {
      const promotion = await openHome(page)
      test.skip(
        promotion?.page_slug !== "buen-fin",
        `needs the Buen Fin promotion in force (found "${promotion?.page_slug ?? "none"}")`
      )

      // Same literals the storefront had hardcoded
      const topBar = page.getByTestId("top-bar")
      await expect(topBar).toHaveCSS("background-color", BUEN_FIN_RED)
      const navLink = page.getByTestId("nav-buen-fin-link")
      await expect(navLink).toHaveText("Buen Fin")
      await expect(navLink).toHaveCSS("color", BUEN_FIN_DARK_RED)
      await navLink.hover()
      await expect(navLink).toHaveCSS("color", BUEN_FIN_RED)

      const band = page.getByTestId("season-band")
      await expect(band).toHaveCSS(
        "background-image",
        `linear-gradient(to right, ${BUEN_FIN_DARK_RED}, ${BUEN_FIN_RED})`
      )
      await expect(band.locator("li b").first()).toHaveCSS("color", BUEN_FIN_RED)
      const cta = page.getByTestId("season-band-cta")
      await expect(cta).toHaveCSS("color", BUEN_FIN_DARK_RED)
      await expect(cta).toHaveAttribute(
        "href",
        `/${COUNTRY_CODE}/promociones/buen-fin`
      )

      // The old address redirects to the new one and shows the same page
      await page.goto(`/${COUNTRY_CODE}/buen-fin`, { waitUntil: "domcontentloaded" })
      await page.waitForURL(`**/${COUNTRY_CODE}/promociones/buen-fin`)
      const root = page.getByTestId("buen-fin-page")
      await expect(root).toBeVisible()
      await expect(root.getByRole("heading", { level: 1 })).toHaveText(
        BUEN_FIN_HEADLINE
      )
      await expect(
        root.getByText(
          "Hasta 30% de descuento en toda la tienda, aplicado automáticamente en tu carrito. Se combina con cupones.",
          { exact: true }
        )
      ).toBeVisible()
      await expect(root.locator("section[aria-labelledby='bf-h1']")).toHaveCSS(
        "background-image",
        "radial-gradient(120% 120% at 80% 0%, rgb(228, 80, 95) 0%, rgb(220, 53, 69) 45%, rgb(167, 29, 42) 100%)"
      )
      await expect(
        root
          .getByRole("heading", { name: "Tu descuento según tu compra" })
          .locator("xpath=..")
          .locator("b")
          .first()
      ).toHaveCSS("color", BUEN_FIN_RED)
      await expect(
        root.getByText("Todo suma para tu descuento").first()
      ).toHaveCSS("color", BUEN_FIN_DARK_RED)
    }
  )

  test(
    "/buen-fin redirects to /promociones/buen-fin and an unknown address shows the friendly message",
    { tag: ["@buen-fin", "@promo-identity", "@PROMO-ID-004"] },
    async ({ page, request }) => {
      // Temporary redirect (307): browsers must not cache it
      const hop = await request.get(`/${COUNTRY_CODE}/buen-fin`, {
        maxRedirects: 0,
      })
      expect(hop.status()).toBe(307)
      expect(hop.headers()["location"]).toBe(
        `/${COUNTRY_CODE}/promociones/buen-fin`
      )

      // Old address: always redirects, whatever promotion is in force
      await page.goto(`/${COUNTRY_CODE}/buen-fin`, { waitUntil: "domcontentloaded" })
      await page.waitForURL(`**/${COUNTRY_CODE}/promociones/buen-fin`)
      await expect(
        page.getByTestId("buen-fin-page").or(page.getByTestId("buen-fin-empty"))
      ).toBeVisible()

      // Address that no promotion owns: message + link to the store, no 404
      const response = await page.goto(
        `/${COUNTRY_CODE}/promociones/no-existe-esta-promo`,
        { waitUntil: "domcontentloaded" }
      )
      expect(response?.status()).toBe(200)
      // ...and kept out of search results
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        /noindex/
      )
      const empty = page.getByTestId("buen-fin-empty")
      await expect(empty).toBeVisible()
      await expect(empty.getByRole("heading", { level: 1 })).toHaveText(
        "Por ahora no hay promociones activas"
      )
      await expect(empty.getByRole("link", { name: "Ver la tienda" })).toHaveAttribute(
        "href",
        `/${COUNTRY_CODE}/store`
      )
      await expect(page.getByTestId("buen-fin-page")).toHaveCount(0)
    }
  )
})
