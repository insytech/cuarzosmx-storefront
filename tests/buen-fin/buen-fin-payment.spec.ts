import { BrowserContext, expect, Locator, Page, test } from "@playwright/test"
import { CheckoutPage } from "../checkout/checkout-page"
import { acceptCookiesUpfront, MP_HOLDER, MP_TEST_CARDS } from "../helpers"

/**
 * Buen Fin tier + Mercado Pago CardPayment Brick, against the MP SANDBOX
 * (specs S9, S14; odd/tasks/buen-fin-promociones.md T11).
 *
 * Proves that an on-site card payment with the 20% tier applied charges the
 * discounted total and that the order is created for that same amount.
 *
 * Preconditions: see tests/README.md (Checkout API "TEST-" credential pair
 * active in BOTH running services) and tests/buen-fin/buen-fin.spec.ts
 * ("Buen Fin 2026" in force, $400 discountable single-variant product).
 * Smoke only (cuarzosmx/docs/pruebas-de-pagos.md §3.3): no webhook tunnel.
 * Verify the run in the DB afterwards (same doc, §4).
 *
 * THIS COMPLETES A (SANDBOX) PURCHASE. Never run it with production keys.
 */

const PRODUCT_HANDLE =
  process.env.E2E_BUEN_FIN_PRODUCT_HANDLE ?? "catedrales-de-cuarzo-121"
const PROMO_NAME = "Buen Fin 2026"
const MINUS = "−" // U+2212, as rendered by the storefront

/** Hosts the CardPayment Brick needs (SDK, secure fields, BIN lookup, assets). */
const MP_HOST = /(^|\.)(mercadopago|mercadolibre|mlstatic)\.com(\.mx)?$/

async function allowOnlyLocalAndMercadoPago(context: BrowserContext): Promise<void> {
  await context.route("**/*", (route) => {
    const { hostname } = new URL(route.request().url())
    return hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      MP_HOST.test(hostname)
      ? route.continue()
      : route.abort()
  })
}

function visible(page: Page, testId: string): Locator {
  return page.getByTestId(testId).locator("visible=true").first()
}

/** Steps the (single) cart row quantity through the +/- buttons until `target`. */
async function setQuantity(page: Page, target: number): Promise<void> {
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
  await expect(value).toHaveText(/^\d+$/)
  let current = Number(await value.innerText())
  while (current !== target) {
    const next = current < target ? current + 1 : current - 1
    await (current < target ? plus : minus).click()
    await expect(value).toHaveText(String(next))
    current = next
  }
}

/** Asserts the "Buen Fin 2026 −20%  −MX$320.00" row of a CartTotals block. */
async function expectTierRow(page: Page): Promise<void> {
  const tierRow = visible(page, "cart-tier-discount")
  await expect(tierRow).toHaveText(`${MINUS}MX$320.00`)
  await expect(tierRow).toHaveAttribute("data-value", "320")
  await expect(tierRow.locator("xpath=..")).toHaveText(
    `${PROMO_NAME} ${MINUS}20%${MINUS}MX$320.00`
  )
}

// Video needs Playwright's ffmpeg, blocked on this machine (see buen-fin.spec.ts).
test.use({ video: "off" })

test.beforeEach(async ({ context }) => {
  await context.clearCookies({ name: "_medusa_cart_id" })
  await acceptCookiesUpfront(context)
  await allowOnlyLocalAndMercadoPago(context)
})

test.afterEach(async ({ context }) => {
  await context.clearCookies({ name: "_medusa_cart_id" })
})

test.describe("Buen Fin - Mercado Pago card payment", () => {
  test(
    "Brick charges the tier-discounted total and the order keeps it",
    {
      tag: ["@buen-fin", "@e2e", "@checkout", "@mercadopago", "@BUEN-FIN-PAY-001"],
    },
    async ({ page }) => {
      test.setTimeout(300_000)
      await page.setViewportSize({ width: 1440, height: 900 })
      const checkout = new CheckoutPage(page)

      // 4 × $400 = $1,600 → 20% tier → products $1,280
      await checkout.addProductToCart(PRODUCT_HANDLE)
      await checkout.openCart()
      await setQuantity(page, 4)
      await expect(visible(page, "cart-subtotal")).toHaveText("MX$1,600.00")
      await expectTierRow(page)
      expect(await checkout.cartTotal()).toBe(1280)

      await checkout.proceedToCheckout()
      await checkout.fillShippingAddress()
      await checkout.selectShippingMethod()

      // Checkout summary at the payment step: tier row + total incl. shipping.
      await expectTierRow(page)
      const shipping = Number(
        await visible(page, "cart-shipping").getAttribute("data-value")
      )
      expect(shipping, "a paid shipping method must be selected").toBeGreaterThan(0)
      const amountDue = await checkout.checkoutTotal()
      expect(amountDue).toBeCloseTo(1280 + shipping, 2)

      await checkout.selectMercadoPagoCard()
      await checkout.fillCardForm({
        ...MP_TEST_CARDS.creditMastercard,
        holder: MP_HOLDER.approved,
      })
      // 1x = no financing, so MP charges exactly the cart total.
      await checkout.selectInstallments(1)
      await checkout.submitCardForm()

      // Review step still shows the discounted total before charging.
      await expectTierRow(page)
      expect(await checkout.checkoutTotal()).toBe(amountDue)

      await checkout.placeOrder()

      // --- confirmation ---------------------------------------------------
      await expect(page).toHaveURL(/\/order\/[^/]+\/confirmed/)
      await expect(page.getByText("Tu pedido se ha realizado con éxito.")).toBeVisible()
      const orderNumber = await checkout.orderNumber()
      expect(orderNumber).toMatch(/\d+/)
      await expectTierRow(page)
      const orderTotal = await checkout.orderTotal()
      expect(
        orderTotal,
        `order total (${orderTotal}) must equal the amount charged at checkout (${amountDue})`
      ).toBe(amountDue)

      console.log(
        `[buen-fin-payment] order ${orderNumber} url=${page.url()} ` +
          `shipping=${shipping} amountDue=${amountDue} orderTotal=${orderTotal}`
      )
    }
  )
})
