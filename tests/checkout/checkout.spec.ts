import { expect, test } from "@playwright/test"
import { CheckoutPage } from "./checkout-page"
import {
  acceptCookiesUpfront,
  COUNTRY_CODE,
  MP_HOLDER,
  MP_TEST_CARDS,
} from "../helpers"

/**
 * Product used by the happy path: single variant, in stock, non-zero price.
 * Override with E2E_PRODUCT_HANDLE if this one is ever depleted or unpublished.
 */
const PRODUCT_HANDLE = process.env.E2E_PRODUCT_HANDLE ?? "catedrales-de-cuarzo-121"

test.beforeEach(async ({ context }) => {
  await acceptCookiesUpfront(context)
})

test.describe("Checkout - Mercado Pago", () => {
  test(
    "On-site card payment creates an order for the exact checkout total",
    { tag: ["@critical", "@e2e", "@checkout", "@mercadopago", "@CHECKOUT-E2E-001"] },
    async ({ page }) => {
      const checkout = new CheckoutPage(page)

      await checkout.addProductToCart(PRODUCT_HANDLE)

      await checkout.openCart()
      const subtotal = await checkout.cartTotal()
      expect(subtotal, "cart must not be empty / zero-priced").toBeGreaterThan(0)

      await checkout.proceedToCheckout()
      await checkout.fillShippingAddress()
      await checkout.selectShippingMethod()

      // The amount the customer is committing to, captured before paying.
      const amountDue = await checkout.checkoutTotal()
      // Shipping was selected, so the total must have grown past the subtotal.
      expect(
        amountDue,
        "checkout total should include the selected shipping cost"
      ).toBeGreaterThan(subtotal)

      await checkout.selectMercadoPagoCard()
      await checkout.fillCardForm({
        ...MP_TEST_CARDS.creditMastercard,
        holder: MP_HOLDER.approved,
      })
      // 1x = no financing, so the amount charged stays equal to the cart total.
      await checkout.selectInstallments(1)
      await checkout.submitCardForm()

      await checkout.placeOrder()

      // --- the assertions that actually matter -------------------------
      const orderNumber = await checkout.orderNumber()
      expect(orderNumber, "confirmation must show an order number").toMatch(/\d+/)

      const orderTotal = await checkout.orderTotal()
      expect(
        orderTotal,
        `order total (${orderTotal}) must equal the amount charged at checkout (${amountDue})`
      ).toBe(amountDue)

      await expect(page).toHaveURL(/\/order\/[^/]+\/confirmed/)
      await expect(
        page.getByText("Tu pedido se ha realizado con éxito.")
      ).toBeVisible()
    }
  )

  /**
   * SKIPPED ON PURPOSE — not part of the green path.
   *
   * The Checkout Pro / Wallet flow ("Hasta 12 pagos sin tarjeta con Mercado
   * Pago") redirects the browser to mercadopago.com, where the test would have
   * to log in as the sandbox buyer and click through a DOM we do not own and
   * that Mercado Pago changes without notice. It also frequently serves a
   * bot-detection challenge to headless Chromium.
   *
   * Kept here so the flow is documented and one `test.skip` removal away from
   * running manually (headed) when the redirect path needs verifying.
   *
   * To run it you additionally need, in the storefront env:
   *   MP_TEST_BUYER_USER / MP_TEST_BUYER_PASSWORD  (sandbox buyer credentials)
   * and the backend's MERCADOPAGO_WEBHOOK_URL pointed at a live tunnel, since
   * the order is only completed once MP calls /hooks/mercadopago back.
   */
  test.skip(
    "Checkout Pro redirect flow completes the order after paying on mercadopago.com",
    { tag: ["@high", "@e2e", "@checkout", "@mercadopago", "@CHECKOUT-E2E-002"] },
    async ({ page }) => {
      const checkout = new CheckoutPage(page)
      const buyerUser = process.env.MP_TEST_BUYER_USER
      const buyerPassword = process.env.MP_TEST_BUYER_PASSWORD

      test.skip(
        !buyerUser || !buyerPassword,
        "MP_TEST_BUYER_USER / MP_TEST_BUYER_PASSWORD are required"
      )

      await checkout.addProductToCart(PRODUCT_HANDLE)
      await checkout.openCart()
      await checkout.proceedToCheckout()
      await checkout.fillShippingAddress()
      await checkout.selectShippingMethod()

      const amountDue = await checkout.checkoutTotal()

      // Wallet Brick option, rendered by MercadoCreditoContainer.
      await page
        .getByText("Hasta 12 pagos sin tarjeta con Mercado Pago", { exact: true })
        .click()

      // The Wallet button itself is inside an MP-owned iframe.
      const wallet = page.frameLocator('iframe[src*="mercadopago"]').first()
      await wallet.getByRole("button").first().click()

      // --- foreign DOM from here on; every selector below is MP's, not ours.
      await page.waitForURL(/mercadopago\.com/, { timeout: 120_000 })
      await page.getByLabel(/correo|e-mail/i).fill(buyerUser!)
      await page.getByRole("button", { name: /continuar/i }).click()
      await page.getByLabel(/contraseña|password/i).fill(buyerPassword!)
      await page.getByRole("button", { name: /continuar|ingresar/i }).click()
      await page.getByRole("button", { name: /pagar/i }).click()

      // MP bounces back to the storefront, which completes the order once the
      // webhook (or the approved-redirect fallback in review/index.tsx) lands.
      await page.waitForURL(
        new RegExp(`/${COUNTRY_CODE}/order/[^/]+/confirmed`),
        { timeout: 180_000 }
      )

      expect(await checkout.orderTotal()).toBe(amountDue)
      expect(await checkout.orderNumber()).toMatch(/\d+/)
    }
  )
})
