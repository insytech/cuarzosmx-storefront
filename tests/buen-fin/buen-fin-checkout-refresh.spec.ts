import { execFileSync } from "node:child_process"
import { BrowserContext, expect, Locator, Page, test } from "@playwright/test"
import { CheckoutPage } from "../checkout/checkout-page"
import { acceptCookiesUpfront, COUNTRY_CODE, toAmount } from "../helpers"

/**
 * Buen Fin follow-ups (odd/tasks/buen-fin-promociones.md T15, proposal P2):
 *
 * - BUEN-FIN-006 (P2a + P3): when the promotion window changes while a customer
 *   is already in checkout, entering the payment step refreshes the cart in the
 *   backend and the summary shows the recalculated total (no stale tier). The
 *   bank transfer the customer had chosen (deleted by Medusa when the total
 *   changes) is selected again automatically, with a notice.
 * - BUEN-FIN-007: the nav top bar never paints the default purple while a
 *   promotion is in force (the streaming fallback used to be purple).
 *
 * BUEN-FIN-006 EDITS THE LOCAL DEV DB ("Buen Fin 2026" row) through
 * `docker exec cuarzosmx-postgres` and always restores the original window
 * (starts 2026-11-10 06:00:00+00, ends 2026-11-21 05:59:59+00). It takes
 * ~2.5 min because it waits past the storefront's 60 s promotion caches twice.
 * No payment is made: it stops at the payment step.
 */

const PRODUCT_HANDLE =
  process.env.E2E_BUEN_FIN_PRODUCT_HANDLE ?? "catedrales-de-cuarzo-121"
const PROMO_ID = "spromo_01M742VZFJESKKAN8GS50NBG06"
const ORIGINAL_STARTS_AT = "2026-11-10 06:00:00+00"
const ORIGINAL_ENDS_AT = "2026-11-21 05:59:59+00"
const CACHE_WAIT_MS = 65_000
const PURPLE = "rgb(156, 114, 175)" // #9C72AF (bg-main-color)
const PROMOTION_RED = "rgb(220, 53, 69)" // #DC3545
const TRANSFER_RESTORED = "Tu total se actualizó; volvimos a seleccionar transferencia."

function psql(sql: string): string {
  return execFileSync(
    "docker",
    [
      "exec",
      "cuarzosmx-postgres",
      "sh",
      "-c",
      `psql -U "$POSTGRES_USER" -d cuarzosmx-db -Atc "${sql}"`,
    ],
    { encoding: "utf8" }
  ).trim()
}

function promoWindow(): string {
  return psql(
    `select id, starts_at, ends_at, is_active from store_promotion where id = '${PROMO_ID}'`
  )
}

function restorePromoWindow(): string {
  psql(
    `update store_promotion set starts_at = '${ORIGINAL_STARTS_AT}', ends_at = '${ORIGINAL_ENDS_AT}' where id = '${PROMO_ID}'`
  )
  return promoWindow()
}

async function blockThirdParty(context: BrowserContext): Promise<void> {
  await context.route("**/*", (route) => {
    const { hostname } = new URL(route.request().url())
    return hostname === "localhost" || hostname === "127.0.0.1"
      ? route.continue()
      : route.abort()
  })
}

function visible(page: Page, testId: string): Locator {
  return page.getByTestId(testId).locator("visible=true").first()
}

async function setQuantity(page: Page, target: number): Promise<void> {
  const row = page.getByTestId("product-row").first()
  const plus = row
    .locator("button:has(path[d='M12 4v16m8-8H4'])")
    .locator("visible=true")
    .first()
  const value = plus.locator("xpath=preceding-sibling::span[1]")
  await expect(value).toHaveText(/^\d+$/)
  let current = Number(await value.innerText())
  while (current < target) {
    await plus.click()
    await expect(value).toHaveText(String(current + 1))
    current += 1
  }
}

async function summaryTotal(page: Page): Promise<number> {
  return toAmount(await visible(page, "cart-total").getAttribute("data-value"))
}

async function enterPaymentStep(page: Page): Promise<void> {
  await page.goto(`/${COUNTRY_CODE}/checkout?step=payment`, {
    waitUntil: "domcontentloaded",
  })
  await expect(page.getByText("Pago con tarjeta", { exact: true }).first()).toBeVisible()
}

/** The bank transfer session survived: the review step summarises it as the method. */
async function expectTransferSelected(page: Page): Promise<void> {
  await page.goto(`/${COUNTRY_CODE}/checkout?step=review`, {
    waitUntil: "domcontentloaded",
  })
  await expect(visible(page, "payment-method-summary")).toHaveText(
    "Transferencia bancaria"
  )
}

test.use({ video: "off" })

test.beforeEach(async ({ context }) => {
  await context.clearCookies({ name: "_medusa_cart_id" })
  await acceptCookiesUpfront(context)
  await blockThirdParty(context)
})

test.afterEach(async ({ context }) => {
  await context.clearCookies({ name: "_medusa_cart_id" })
})

test.describe("Buen Fin - checkout total refresh", () => {
  test(
    "entering the payment step shows the total recalculated after the promotion window changes",
    { tag: ["@buen-fin", "@checkout", "@BUEN-FIN-006"] },
    async ({ page }) => {
      test.setTimeout(480_000)
      await page.setViewportSize({ width: 1440, height: 900 })
      expect(promoWindow()).toBe(
        `${PROMO_ID}|${ORIGINAL_STARTS_AT}|${ORIGINAL_ENDS_AT}|t`
      )

      const checkout = new CheckoutPage(page)
      await checkout.addProductToCart(PRODUCT_HANDLE)
      await checkout.openCart()
      await setQuantity(page, 4) // 4 × $400 = $1,600 → 20% tier
      await checkout.proceedToCheckout()
      await checkout.fillShippingAddress()
      await checkout.selectShippingMethod() // now at ?step=payment

      const tierRow = page.getByTestId("cart-tier-discount").locator("visible=true")
      await expect(tierRow).toHaveCount(1)
      const withTier = await summaryTotal(page)

      // Customer chooses bank transfer (creates the pp_system_default session).
      await page.getByText("Transferencia bancaria", { exact: true }).first().click()
      await page.getByTestId("submit-payment-button").click()
      await page.waitForURL("**/checkout?step=review**")
      await expectTransferSelected(page)

      try {
        // The promotion ends while the customer sits in checkout.
        psql(
          `update store_promotion set ends_at = now() - interval '1 minute' where id = '${PROMO_ID}'`
        )
        await page.waitForTimeout(CACHE_WAIT_MS)

        await enterPaymentStep(page)
        await expect
          .poll(() => summaryTotal(page), { timeout: 30_000 })
          .toBeCloseTo(withTier + 320, 2)
        await expect(tierRow).toHaveCount(0)
        await expect(page.getByTestId("payment-total-notice")).toHaveText(TRANSFER_RESTORED)
        await expectTransferSelected(page)
      } finally {
        const restored = restorePromoWindow()
        console.log(`[BUEN-FIN-006] restored row: ${restored}`)
        expect(restored).toBe(`${PROMO_ID}|${ORIGINAL_STARTS_AT}|${ORIGINAL_ENDS_AT}|t`)
      }

      // Promotion back in force: entering the payment step applies the tier again.
      await page.waitForTimeout(CACHE_WAIT_MS)
      await enterPaymentStep(page)
      await expect
        .poll(() => summaryTotal(page), { timeout: 30_000 })
        .toBeCloseTo(withTier, 2)
      await expect(tierRow).toHaveCount(1)
      await expect(page.getByTestId("payment-total-notice")).toHaveText(TRANSFER_RESTORED)
      await expectTransferSelected(page)
    }
  )
})

test.describe("Buen Fin - top bar colour while streaming", () => {
  test(
    "the top bar never paints purple on page load while a promotion is in force",
    { tag: ["@buen-fin", "@BUEN-FIN-007"] },
    async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      // Sample the bar from the first parsed byte: every DOM mutation and every
      // animation frame records the class and computed colour of the first
      // child of the sticky nav wrapper (fallback bar or real TopBar).
      await page.addInitScript(() => {
        type Sample = { cls: string; bg: string; id: string | null }
        const samples: Sample[] = []
        ;(window as unknown as { __topBar: Sample[] }).__topBar = samples
        const sample = () => {
          const bar = document.querySelector("div.sticky.top-0 > div:first-child")
          if (bar) {
            samples.push({
              cls: bar.className,
              bg: getComputedStyle(bar).backgroundColor,
              id: bar.getAttribute("data-testid"),
            })
          }
        }
        new MutationObserver(sample).observe(document, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: ["class"],
        })
        const loop = () => {
          sample()
          if (performance.now() < 20_000) requestAnimationFrame(loop)
        }
        requestAnimationFrame(loop)
      })

      for (const path of [`/${COUNTRY_CODE}`, `/${COUNTRY_CODE}/store`]) {
        await page.goto(path, { waitUntil: "domcontentloaded" })
        const topBar = page.getByTestId("top-bar")
        await expect(topBar).toHaveAttribute("data-season", "promotion")
        await expect(topBar).toHaveCSS("background-color", PROMOTION_RED)

        const samples = await page.evaluate(
          () => (window as unknown as { __topBar: { cls: string; bg: string; id: string | null }[] }).__topBar
        )
        expect(samples.length, `no top bar samples on ${path}`).toBeGreaterThan(0)
        const purple = samples.filter(
          (s) => s.bg === PURPLE || /\bbg-main-color\b/.test(s.cls)
        )
        expect(purple, `purple top bar painted on ${path}`).toEqual([])
      }
    }
  )
})

test.describe("Buen Fin - card charge rejected because the total changed", () => {
  const TOTAL_CHANGED = "El total de tu carrito cambió. Revísalo antes de pagar."
  const ALREADY_PAID = "Este carrito ya fue pagado. No se realizó ningún cargo nuevo."
  const CARD_ROUTE = "**/store/mercadopago-card-payment"

  /**
   * Cart at the review step with "captured" card data. The card route is
   * stubbed in the browser, so nothing reaches Mercado Pago and no charge or
   * token is created.
   */
  async function reviewWithCardData(page: Page, transactionAmount: number) {
    const checkout = new CheckoutPage(page)
    await checkout.addProductToCart(PRODUCT_HANDLE)
    await checkout.openCart()
    await checkout.proceedToCheckout()
    await checkout.fillShippingAddress()
    await checkout.selectShippingMethod()
    const cookies = await page.context().cookies()
    const cartId = cookies.find((c) => c.name === "_medusa_cart_id")?.value
    expect(cartId).toBeTruthy()
    await page.evaluate(
      ([id, amount]) =>
        sessionStorage.setItem(
          "mercadopago_card_data",
          JSON.stringify({
            token: "stub-token",
            payment_method_id: "master",
            installments: 1,
            issuer_id: "1",
            payer: { email: "playwright@example.com" },
            cart_id: id,
            transaction_amount: amount,
            payment_type_id: "credit_card",
          })
        ),
      [cartId, transactionAmount] as const
    )
    await page.goto(`/${COUNTRY_CODE}/checkout?step=review`, {
      waitUntil: "domcontentloaded",
    })
    await expect(page.getByTestId("submit-order-button")).toHaveText("Realizar pedido")
  }

  for (const [status, error] of [
    [400, "El monto del pago (1.00) no coincide con el total del carrito (565.88). El pago no fue procesado."],
    [409, "El total de tu carrito cambió. No se realizó ningún cargo; revisa tu carrito e intenta de nuevo."],
  ] as const) {
    test(
      `${status} total mismatch: back to payment with a clear notice, no retry`,
      { tag: ["@buen-fin", "@checkout", `@BUEN-FIN-008-${status}`] },
      async ({ page }) => {
        let calls = 0
        await page.route(CARD_ROUTE, (route) => {
          if (route.request().method() !== "POST") return route.continue()
          calls += 1
          return route.fulfill({ status, json: { error } })
        })
        await reviewWithCardData(page, 1)
        await page.getByTestId("submit-order-button").click()

        await page.waitForURL("**/checkout?step=payment**")
        await expect(page.getByTestId("payment-total-notice")).toHaveText(TOTAL_CHANGED)
        await expect(page.getByText("Pago con tarjeta", { exact: true }).first()).toBeVisible()
        expect(await page.evaluate(() => sessionStorage.getItem("mercadopago_card_data"))).toBeNull()
        await page.waitForTimeout(2_000)
        expect(calls).toBe(1)
      }
    )
  }

  test(
    "409 already paid keeps its own message on the review step",
    { tag: ["@buen-fin", "@checkout", "@BUEN-FIN-008-paid"] },
    async ({ page }) => {
      await page.route(CARD_ROUTE, (route) =>
        route.request().method() === "POST"
          ? route.fulfill({ status: 409, json: { error: ALREADY_PAID } })
          : route.continue()
      )
      await reviewWithCardData(page, 1)
      await page.getByTestId("submit-order-button").click()
      await expect(page.getByText(ALREADY_PAID)).toBeVisible()
      expect(page.url()).toContain("step=review")
      await expect(page.getByTestId("payment-total-notice")).toHaveCount(0)
    }
  )
})
