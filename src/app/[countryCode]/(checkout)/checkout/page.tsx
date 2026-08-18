import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { FinancingProvider } from "@modules/checkout/context/financing-context"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

type MpReturnParams = {
  step?: string
  payment_status?: string
  collection_status?: string
  status?: string
  payment_id?: string
  collection_id?: string
  external_reference?: string
}

export default async function Checkout({
  params: routeParams,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<MpReturnParams>
}) {
  const { countryCode } = await routeParams
  const cart = await retrieveCart()

  if (!cart) {
    // Vuelta de Checkout Pro con el pago APROBADO y sin carrito activo.
    //
    // Pasa siempre que el webhook gana la carrera al navegador: completa el
    // carrito en pedido y, cuando Mercado Pago devuelve al comprador a
    // `back_urls.success` (/checkout?step=review&payment_status=success&...),
    // ya no hay carrito que recuperar. Sin esto, `notFound()` le enseña un 404
    // a alguien que acaba de pagar bien.
    //
    // El fallback de `review/index.tsx` cubre el caso contrario — navegador
    // primero — pero no puede ejecutarse aqui: la ruta responde 404 antes de que
    // el componente llegue a montarse.
    //
    // `sdk.store.cart.complete()` es idempotente por resultado
    // (`completeCartWorkflow` consulta `order_cart`), asi que reusar la misma via
    // devuelve el pedido ya creado en vez de duplicarlo.
    const params = await searchParams
    const aprobado =
      params.payment_status === "success" ||
      params.collection_status === "approved" ||
      params.status === "approved"
    const cartId = params.external_reference

    if (aprobado && cartId) {
      // NO se puede reusar `completeMercadoPagoOrder` aqui: llama a
      // `revalidateTag()` tras completar, y eso LANZA si corre durante el render
      // de un server component. Su propio try/catch se lo traga y devuelve
      // `success:false`, asi que el 404 volvia igual y sin rastro del motivo.
      const backendUrl =
        process.env.MEDUSA_BACKEND_URL ||
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
        "http://localhost:9000"

      let destino: string | undefined

      try {
        // `/store/mercadopago-recover-order` y NO `/store/carts/:id/complete`:
        // en Checkout Pro el carrito puede no tener payment collection en Medusa
        // (lo que se crea es una PREFERENCIA en MP), y completar a pelo devuelve
        // 400 "Payment collection has not been initiated for cart". Esa ruta valida
        // el pago contra MP, crea la sesion si falta y completa, reusando las mismas
        // funciones que el webhook y el job de reconciliacion.
        const respuesta = await fetch(
          `${backendUrl}/store/mercadopago-recover-order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-publishable-api-key":
                process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "",
            },
            body: JSON.stringify({
              cart_id: cartId,
              payment_id: params.payment_id || params.collection_id,
            }),
            cache: "no-store",
          }
        )

        const datos = await respuesta.json()

        if (respuesta.ok && datos?.order_id) {
          destino = `/${countryCode}/order/${datos.order_id}/confirmed`
        } else {
          console.error(
            `[checkout] no se pudo resolver el pedido de un pago aprobado ` +
              `cart_id=${cartId} status=${respuesta.status} ` +
              `respuesta=${JSON.stringify(datos)?.slice(0, 300)}`
          )
        }
      } catch (error: any) {
        console.error(
          `[checkout] error resolviendo el pedido de un pago aprobado ` +
            `cart_id=${cartId}: ${error?.message}`
        )
      }

      // `redirect()` lanza para navegar, asi que va FUERA del try/catch.
      if (destino) {
        redirect(destino)
      }
    }

    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <FinancingProvider>
      <div className="grid grid-cols-1 small:grid-cols-[1fr_400px] content-container gap-x-12 gap-y-8 py-8 small:py-12">
        <PaymentWrapper cart={cart}>
          <CheckoutForm cart={cart} customer={customer} />
        </PaymentWrapper>
        <CheckoutSummary cart={cart} />
      </div>
    </FinancingProvider>
  )
}
