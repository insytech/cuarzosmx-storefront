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
   * OPT-IN (`RUN_CHECKOUT_PRO=1`) — no forma parte del camino verde.
   *
   * Estado verificado el 18 ago 2026 corriendo este test en dev contra el sandbox:
   * NUESTRA parte del flujo funciona completa — la preferencia se crea con el total
   * exacto del carrito, el Wallet Brick monta con `preferenceId`, el redirect a
   * Checkout Pro ocurre, MP acepta los datos de tarjeta y el webhook llega por el
   * tunel (3/3 HTTP 200, 385ms de media).
   *
   * Lo que NO se puede automatizar es el pago en si, y lo bloquea Mercado Pago por
   * los dos caminos posibles:
   *   - Con cuenta:  el login sirve reCAPTCHA tras varios intentos automatizados, y
   *                  MP prellena el correo con el `payer.email` de la preferencia,
   *                  sobrescribiendo el del test user.
   *   - Sin cuenta:  el antifraude responde "Por motivos de seguridad, tu pago fue
   *                  rechazado" (/congrats/rejected/) a una tarjeta de prueba desde
   *                  un navegador automatizado sin historial.
   *
   * Asi que este test llega hasta el pago y sirve para verificar TODO lo nuestro;
   * el veredicto aprobado hay que conseguirlo pagando con una cuenta en la que el
   * antifraude confie (test user con saldo y sesion guardada via storageState).
   *
   * Requisitos para correrlo:
   *   RUN_CHECKOUT_PRO=1
   *   backend con MERCADOPAGO_WEBHOOK_URL apuntando a un tunel vivo
   *   STORE_CORS con una URL https primero, o no habra `auto_return`
   *   --headed (headless agrava la deteccion de bot)
   */
  test(
    "Checkout Pro redirect flow completes the order after paying on mercadopago.com",
    { tag: ["@high", "@e2e", "@checkout", "@mercadopago", "@CHECKOUT-E2E-002"] },
    async ({ page }) => {
      // El redirect a MP, su formulario y el procesamiento del pago no caben en
      // los 180s de `playwright.config.ts`. Con el presupuesto por defecto el test
      // se queda sin tiempo justo esperando el pedido y el error que sale es
      // "browser has been closed", que no dice nada del flujo.
      test.setTimeout(10 * 60 * 1000)

      // Opt-in explicito. NO forma parte del camino verde: Mercado Pago bloquea
      // este flujo desde un navegador automatizado por los dos lados (ver el
      // bloque de arriba), asi que en la suite por defecto seria rojo permanente.
      test.skip(
        !process.env.RUN_CHECKOUT_PRO,
        "requiere RUN_CHECKOUT_PRO=1 — ver el comentario del test"
      )

      const checkout = new CheckoutPage(page)

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

      // El Wallet Brick de @mercadopago/sdk-react con redirectMode: 'self'
      // (payment-container/index.tsx:997) renderiza un boton NATIVO en nuestro
      // propio DOM, no dentro de un iframe. Versiones anteriores del SDK si usaban
      // iframe; buscarlo ahi es lo que tenia este test roto.
      // El checkout renderiza layout movil Y de escritorio, asi que el boton
      // aparece dos veces (mismo quirk que resuelve BasePage.testId()).
      await page
        .getByRole("button", { name: /Pagar con Mercado Pago/i })
        .filter({ visible: true })
        .first()
        .click()

      // --- foreign DOM from here on; every selector below is MP's, not ours.
      await page.waitForURL(/mercadopago\.com/, { timeout: 120_000 })

      // Checkout Pro abre en "¿Como quieres pagar?" con dos bloques:
      //   - "Con tu cuenta de Mercado Pago" -> login en mercadolibre.com
      //   - "Sin cuenta de Mercado Pago"    -> Tarjeta / Efectivo / SPEI
      //
      // Vamos por TARJETA SIN CUENTA a proposito. El camino con cuenta es un muro
      // para un test: el login sirve reCAPTCHA ("No soy un robot") a Chromium
      // automatizado, y MP prellena el campo de correo con el `payer.email` de la
      // preferencia, sobrescribiendo el del test user. Y lo que este test tiene que
      // cubrir es NUESTRO flujo — preferencia, redirect, webhook, pedido — no el
      // login de Mercado Pago.
      //
      // Hay que pulsar el BOTON envolvente, no el span del titulo: el
      // `button.andes-list__item-actionable` de MP intercepta los eventos.
      await page
        .getByRole("button", { name: /Tarjeta/i })
        .first()
        .click({ timeout: 60_000 })

      // Banner de cookies de MP: vive abajo y puede interceptar clicks.
      // Best-effort, no falla si no aparece.
      const cookies = page.getByRole("button", { name: /aceptar cookies/i })
      if (await cookies.isVisible().catch(() => false)) {
        await cookies.click().catch(() => {})
      }

      // El formulario de Checkout Pro reparte los campos entre iframes
      // cross-origin (numero, vencimiento y CVV, uno cada uno) y el documento
      // principal (nombre del titular). Buscar por nombre accesible en TODOS los
      // frames evita depender del orden o del nombre de cada iframe, que son de MP.
      const mpField = async (name: RegExp) => {
        const deadline = Date.now() + 60_000
        while (Date.now() < deadline) {
          for (const frame of page.frames()) {
            const box = frame.getByRole("textbox", { name })
            if (await box.count().catch(() => 0)) {
              return box.first()
            }
          }
          await page.waitForTimeout(500)
        }
        throw new Error(`campo de tarjeta no encontrado en ningun frame: ${name}`)
      }

      const card = MP_TEST_CARDS.creditVisa
      await (await mpField(/n[uú]mero de tarjeta/i)).fill(card.number)
      await (await mpField(/nombre del titular/i)).fill(MP_HOLDER.approved)
      await (await mpField(/vencimiento/i)).fill(card.expiry)
      await (await mpField(/c[oó]digo de seguridad/i)).fill(card.cvv)

      // Checkout Pro cobra en DOS pasos: "Continuar" cierra el formulario de
      // tarjeta y "Pagar" confirma en la pantalla "Revisa tu pago". Un solo click
      // de /pagar|continuar/ casaba con el primero y dejaba el pago sin confirmar.
      await page
        .getByRole("button", { name: /continuar/i })
        .first()
        .click({ timeout: 60_000 })

      const payButton = page.getByRole("button", { name: /^pagar$/i }).first()
      await payButton.waitFor({ state: "visible", timeout: 120_000 })
      await payButton.click()

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
