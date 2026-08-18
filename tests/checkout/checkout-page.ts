import { expect, FrameLocator, Locator, Page } from "@playwright/test"
import { BasePage } from "../base-page"
import { COUNTRY_CODE, TEST_CUSTOMER, toAmount } from "../helpers"

export type CardInput = {
  number: string
  expiry: string
  cvv: string
  holder: string
}

/**
 * Covers the whole purchase funnel: product -> cart -> checkout (address,
 * delivery, payment, review) -> order confirmation.
 *
 * Selectors were verified by driving the real storefront on 2026-08-17;
 * see tests/README.md for the notable quirks they work around.
 */
export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  // ---------------------------------------------------------------- product

  async addProductToCart(handle: string): Promise<void> {
    await this.goto(`/${COUNTRY_CODE}/products/${handle}`)
    await this.testId("product-container").waitFor()

    // Products with >1 variant render option buttons; single-variant products
    // auto-select after hydration. Either way the add button stays disabled
    // ("Selecciona una opción") until a variant is resolved.
    const options = this.page.getByTestId("option-button")
    if (await options.count()) {
      await options.first().click()
    }

    const addButton = this.testId("add-product-button")
    await expect(addButton).toBeEnabled()
    await expect(addButton).toHaveText(/Agregar al carrito/i)

    // Adding to the cart is a server action; navigating away before it settles
    // silently loses the line item. Wait for the nav badge to actually count
    // the item rather than sleeping an arbitrary amount.
    const cartBadge = this.testId("nav-cart-link")
    await expect(cartBadge).toContainText("Carrito (0)")
    await addButton.click()
    await expect(cartBadge).not.toContainText("Carrito (0)")
  }

  // ------------------------------------------------------------------- cart

  async openCart(): Promise<void> {
    await this.goto(`/${COUNTRY_CODE}/cart`)
    await this.testId("cart-container").waitFor()
  }

  /** Cart total in pesos, read from `data-value` rather than the formatted string. */
  async cartTotal(): Promise<number> {
    const total = this.testId("cart-total")
    await total.waitFor()
    return toAmount(await total.getAttribute("data-value"))
  }

  async proceedToCheckout(): Promise<void> {
    await this.testId("checkout-button").click()
    await this.page.waitForURL("**/checkout?step=address**")
  }

  // --------------------------------------------------------------- addresses

  async fillShippingAddress(customer = TEST_CUSTOMER): Promise<void> {
    await this.testId("shipping-first-name-input").waitFor()
    await this.testId("shipping-first-name-input").fill(customer.firstName)
    await this.testId("shipping-last-name-input").fill(customer.lastName)
    await this.testId("shipping-address-input").fill(customer.address1)
    await this.testId("shipping-address-2-input").fill(customer.address2)
    await this.testId("shipping-postal-code-input").fill(customer.postalCode)
    await this.testId("shipping-city-input").fill(customer.city)
    await this.testId("shipping-country-select").selectOption(customer.countryCode)
    await this.testId("shipping-province-select").selectOption(customer.province)
    await this.testId("shipping-email-input").fill(customer.email)
    await this.testId("shipping-phone-input").fill(customer.phone)

    // Billing == shipping is the default; assert rather than assume, otherwise
    // the billing form appears and `submit-address-button` silently fails.
    await expect(this.testId("billing-address-checkbox")).toBeChecked()

    await this.testId("submit-address-button").click()
    await this.page.waitForURL("**/checkout?step=delivery**")
  }

  // ---------------------------------------------------------------- delivery

  /**
   * Selects a shipping (not pickup) option. Pickup is skipped on purpose:
   * it is free, which would make the amount assertions trivially pass.
   */
  async selectShippingMethod(): Promise<void> {
    await this.testId("delivery-options-container").waitFor()
    const radios = this.page.getByTestId("delivery-option-radio")
    await expect(radios.first()).toBeVisible()

    const count = await radios.count()
    let chosen: Locator | null = null
    for (let i = 0; i < count; i++) {
      const radio = radios.nth(i)
      if (await radio.isDisabled()) continue
      if ((await radio.innerText()).includes("Recoger")) continue
      chosen = radio
      break
    }
    if (!chosen) {
      throw new Error("No delivery (non-pickup) shipping option available")
    }

    await chosen.click()

    const submit = this.testId("submit-delivery-option-button")
    await expect(submit).toBeEnabled()
    await submit.click()
    await this.page.waitForURL("**/checkout?step=payment**")
  }

  // ----------------------------------------------------------------- payment

  /** Radio label rendered for `pp_mercadopago_mercadopago` (see lib/constants). */
  private get mercadoPagoCardOption(): Locator {
    return this.page.getByText("Pago con tarjeta", { exact: true }).first()
  }

  async selectMercadoPagoCard(): Promise<void> {
    await expect(this.mercadoPagoCardOption).toBeVisible()
    await this.mercadoPagoCardOption.click()
    // The CardPayment Brick mounts into this wrapper once `cart.total > 0`.
    await this.page.locator(".payment-brick-wrapper").waitFor({ state: "attached" })
  }

  /**
   * Total the customer is actually being asked to pay, read at the payment
   * step. This is what the Brick is initialized with (`initialization.amount`)
   * and what must survive all the way to the order.
   */
  async checkoutTotal(): Promise<number> {
    return this.cartTotal()
  }

  /**
   * The Brick's card fields live in three cross-origin iframes hosted on
   * secure-fields.mercadopago.com, each named after the field it owns.
   * Every iframe contains all five input ids, but only the one matching its
   * own name is interactive — so the frame name must match the input id.
   */
  private secureField(name: "cardNumber" | "expirationDate" | "securityCode"): FrameLocator {
    return this.page.frameLocator(`iframe[name="${name}"]`)
  }

  async fillCardForm(card: CardInput): Promise<void> {
    const brick = this.page.locator(".payment-brick-wrapper")
    await expect(brick).toBeVisible()

    await this.secureField("cardNumber").locator("#cardNumber").fill(card.number)
    await this.secureField("expirationDate").locator("#expirationDate").fill(card.expiry)
    await this.secureField("securityCode").locator("#securityCode").fill(card.cvv)

    // Cardholder name lives in the parent document, not an iframe. It is the
    // field that decides the sandbox outcome (APRO / OTHE / ...).
    await brick.locator('input[name="HOLDER_NAME"]').fill(card.holder)
  }

  /**
   * The Brick renders an installments ("cuotas") radio group once the BIN
   * resolves, and refuses to submit until one is picked ("Elige una opción
   * para avanzar"). Options are labelled `1x $577.48`, `3x $207.72`, ...
   *
   * Defaults to 1x on purpose: any other option adds financing, so Mercado
   * Pago would charge MORE than the cart total (3x charges $623.16 for a
   * $577.48 cart) and the amount assertion would legitimately diverge.
   */
  async selectInstallments(count = 1): Promise<void> {
    const brick = this.page.locator(".payment-brick-wrapper")
    const option = brick.getByRole("radio", {
      name: new RegExp(`^${count}x\\b`),
    })
    await expect(option).toBeVisible()
    await option.click()
  }

  /**
   * Submits the Brick ("Continuar"). This only tokenizes the card — the
   * charge happens on the review step. On success the storefront pushes
   * `?step=review`.
   */
  async submitCardForm(): Promise<void> {
    const brick = this.page.locator(".payment-brick-wrapper")
    const submit = brick.getByRole("button", { name: "Continuar" })
    await expect(submit).toBeEnabled()
    await submit.click()
    await this.page.waitForURL("**/checkout?step=review**")
  }

  // ------------------------------------------------------------------ review

  /** Charges the card and completes the order. Redirects to the confirmation. */
  async placeOrder(): Promise<void> {
    const submit = this.testId("submit-order-button")
    await expect(submit).toHaveText(/Realizar pedido/i)
    await submit.click()
    await this.page.waitForURL("**/order/*/confirmed**", { timeout: 120_000 })
  }

  // ------------------------------------------------------------ confirmation

  async orderNumber(): Promise<string> {
    await this.testId("order-complete-container").waitFor()
    return (await this.testId("order-id").innerText()).trim()
  }

  /** Order total in pesos, from the confirmation page's cart-totals block. */
  async orderTotal(): Promise<number> {
    const total = this.testId("cart-total")
    await total.waitFor()
    return toAmount(await total.getAttribute("data-value"))
  }
}
