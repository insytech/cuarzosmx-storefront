"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeCartId,
  setCartId,
} from "./cookies"
import { getRegion } from "./regions"

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCart(cartId?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("carts")),
  }

  return await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
      method: "GET",
      query: {
        fields:
          "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name, +completed_at",
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ cart }) => cart)
    .catch(() => null)
}

export async function getOrSetCart(countryCode: string) {
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  let cart = await retrieveCart()

  // Un carrito YA COMPLETADO sigue respondiendo 200 en `GET /store/carts/:id`, asi
  // que `retrieveCart` lo devuelve como si estuviera vivo y todo lo que venga
  // despues le mete lineas y recibe 400 "Cart is already completed".
  //
  // Pasa de verdad y deja la tienda inservible para ese comprador: `removeCartId()`
  // solo se llama en el camino del navegador, asi que cuando el WEBHOOK completa el
  // carrito (Checkout Pro / Mercado Credito, o cualquier pago donde el webhook gane
  // la carrera) la cookie del navegador se queda apuntando al carrito comprado. A
  // partir de ahi ningun "agregar al carrito" vuelve a funcionar hasta que el
  // cliente borre cookies.
  // `completed_at` no esta en el tipo `StoreCart` de @medusajs/types aunque la API
  // lo devuelve cuando se pide en `fields`.
  if ((cart as { completed_at?: string | null } | null)?.completed_at) {
    await removeCartId()
    cart = null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  if (!cart) {
    const cartResp = await sdk.store.cart.create(
      { region_id: region.id },
      {},
      headers
    )
    cart = cartResp.cart

    await setCartId(cart.id)

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  if (cart && cart?.region_id !== region.id) {
    await sdk.store.cart.update(cart.id, { region_id: region.id }, {}, headers)
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  return cart
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found, please create one before updating")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(cartId, data, {}, headers)
    .then(async ({ cart }) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)

      return cart
    })
    .catch(medusaError)
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
  metadata,
}: {
  variantId: string
  quantity: number
  countryCode: string
  metadata?: Record<string, unknown>
}) {
  if (!variantId) {
    return { success: false, error: "Falta el ID de la variante" }
  }

  try {
    const cart = await getOrSetCart(countryCode)

    if (!cart) {
      return { success: false, error: "No se pudo obtener o crear el carrito" }
    }

    const headers = {
      ...(await getAuthHeaders()),
    }

    const anadirLinea = async (cartId: string) =>
      sdk.store.cart.createLineItem(
        cartId,
        {
          variant_id: variantId,
          quantity,
          ...(metadata ? { metadata } : {}),
        },
        {},
        headers
      )

    try {
      await anadirLinea(cart.id)
    } catch (error: any) {
      // "Cart is already completed": la cookie apunta a un carrito que YA se
      // convirtio en pedido.
      //
      // `getOrSetCart` ya comprueba `completed_at`, pero lee de la cache de datos
      // de Next: cuando el pedido lo completa el SERVIDOR (webhook, ruta de
      // recuperacion, job) nadie invalida la cache de esa sesion, asi que la
      // lectura cacheada aun no trae `completed_at` y la guarda no dispara. El
      // sintoma es un 400 en cada intento y una tienda inservible para ese
      // comprador hasta que algo refresque la cache.
      //
      // Aqui el estado ya no es ambiguo: el backend acaba de decir que el carrito
      // esta completado. Se tira la cookie, se abre uno nuevo y se reintenta UNA
      // vez. Sin bucle: si el segundo intento falla, el error sube.
      const mensaje =
        error?.response?.data?.message || error?.message || ""

      if (!/already completed/i.test(mensaje)) {
        throw error
      }

      await removeCartId()
      const cartCacheTagPrevio = await getCacheTag("carts")
      revalidateTag(cartCacheTagPrevio)

      const nuevo = await getOrSetCart(countryCode)
      if (!nuevo) {
        return { success: false, error: "No se pudo obtener o crear el carrito" }
      }

      await anadirLinea(nuevo.id)
    }

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)

    const fulfillmentCacheTag = await getCacheTag("fulfillment")
    revalidateTag(fulfillmentCacheTag)

    return { success: true }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Error desconocido"
    return { success: false, error: message }
  }
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when updating line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .updateLineItem(cartId, lineId, { quantity }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .deleteLineItem(cartId, lineId, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .addShippingMethod(cartId, { option_id: shippingMethodId }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    })
    .catch(medusaError)
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: HttpTypes.StoreInitializePaymentSession
) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.payment
    .initiatePaymentSession(cart, data, {}, headers)
    .then(async (resp) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return resp
    })
    .catch(medusaError)
}

export async function applyPromotions(codes: string[]) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(cartId, { promo_codes: codes }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function applyGiftCard(code: string) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function removeDiscount(code: string) {
  // const cartId = getCartId()
  // if (!cartId) return "No cartId cookie found"
  // try {
  //   await deleteDiscount(cartId, code)
  //   revalidateTag("cart")
  // } catch (error: any) {
  //   throw error
  // }
}

export async function removeGiftCard(
  codeToRemove: string,
  giftCards: any[]
  // giftCards: GiftCard[]
) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, {
  //       gift_cards: [...giftCards]
  //         .filter((gc) => gc.code !== codeToRemove)
  //         .map((gc) => ({ code: gc.code })),
  //     }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function submitPromotionForm(
  currentState: unknown,
  formData: FormData
) {
  const code = formData.get("code") as string
  try {
    await applyPromotions([code])
  } catch (e: any) {
    return e.message
  }
}

// TODO: Pass a POJO instead of a form entity here
export async function setAddresses(currentState: unknown, formData: FormData) {
  try {
    if (!formData) {
      throw new Error("No form data found when setting addresses")
    }
    const cartId = getCartId()
    if (!cartId) {
      throw new Error("No existing cart found when setting addresses")
    }

    const data = {
      shipping_address: {
        first_name: formData.get("shipping_address.first_name"),
        last_name: formData.get("shipping_address.last_name"),
        address_1: formData.get("shipping_address.address_1"),
        address_2: formData.get("shipping_address.address_2"),
        company: formData.get("shipping_address.company"),
        postal_code: formData.get("shipping_address.postal_code"),
        city: formData.get("shipping_address.city"),
        country_code: formData.get("shipping_address.country_code"),
        province: formData.get("shipping_address.province"),
        phone: formData.get("shipping_address.phone"),
      },
      email: formData.get("email"),
    } as any

    const sameAsBilling = formData.get("same_as_billing")
    if (sameAsBilling === "on") data.billing_address = data.shipping_address

    if (sameAsBilling !== "on")
      data.billing_address = {
        first_name: formData.get("billing_address.first_name"),
        last_name: formData.get("billing_address.last_name"),
        address_1: formData.get("billing_address.address_1"),
        address_2: formData.get("billing_address.address_2"),
        company: formData.get("billing_address.company"),
        postal_code: formData.get("billing_address.postal_code"),
        city: formData.get("billing_address.city"),
        country_code: formData.get("billing_address.country_code"),
        province: formData.get("billing_address.province"),
        phone: formData.get("billing_address.phone"),
      }
    await updateCart(data)
  } catch (e: any) {
    return e.message
  }

  redirect(
    `/${formData.get("shipping_address.country_code")}/checkout?step=delivery`
  )
}

/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The cart object if the order was successful, or null if not.
 */
export async function placeOrder(cartId?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    throw new Error("No existing cart found when placing an order")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const cartRes = await sdk.store.cart
    .complete(id, {}, headers)
    .then(async (cartRes) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return cartRes
    })
    .catch(medusaError)

  if (cartRes?.type === "order") {
    const countryCode =
      cartRes.order.shipping_address?.country_code?.toLowerCase()

    const orderCacheTag = await getCacheTag("orders")
    revalidateTag(orderCacheTag)

    removeCartId()
    redirect(`/${countryCode}/order/${cartRes?.order.id}/confirmed`)
  }

  return cartRes.cart
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = await getCartId()
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  if (cartId) {
    await updateCart({ region_id: region.id })
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  const regionCacheTag = await getCacheTag("regions")
  revalidateTag(regionCacheTag)

  const productsCacheTag = await getCacheTag("products")
  revalidateTag(productsCacheTag)

  redirect(`/${countryCode}${currentPath}`)
}

export async function listCartOptions() {
  const cartId = await getCartId()
  const headers = {
    ...(await getAuthHeaders()),
  }
  const next = {
    ...(await getCacheOptions("shippingOptions")),
  }

  return await sdk.client.fetch<{
    shipping_options: HttpTypes.StoreCartShippingOption[]
  }>("/store/shipping-options", {
    query: { cart_id: cartId },
    next,
    headers,
    cache: "force-cache",
  })
}

/**
 * Creates a MercadoPago preference for the Wallet Brick integration
 * @param cartId - The ID of the cart to create a preference for
 * @returns The preference data including preference_id, init_point, and sandbox_init_point
 */
export async function createMercadoPagoPreference(cartId?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    throw new Error("No cart ID provided when creating MercadoPago preference")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const backendUrl = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

  const response = await fetch(`${backendUrl}/store/mercadopago-preference`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // All /store/* routes require the publishable API key
      "x-publishable-api-key":
        process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      ...headers,
    },
    body: JSON.stringify({ cart_id: id }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || "Error creating MercadoPago preference")
  }

  return response.json()
}

/**
 * Completes the order after a successful MercadoPago payment
 * @param cartId - The ID of the cart to complete
 * @param paymentId - The MercadoPago payment ID. When provided, the backend
 *   validates it via the strongly consistent GET /v1/payments/{id} instead of
 *   the eventually consistent payments/search (which can miss payments created
 *   seconds ago and wrongly block completion).
 * @param providerId - The payment provider ID (e.g., pp_mercadopago_mercadopago)
 * @returns The order confirmation URL or null if failed
 */
export async function completeMercadoPagoOrder(
  cartId?: string,
  paymentId?: string,
  providerId = "pp_mercadopago_mercadopago"
) {
  const id = cartId || (await getCartId())

  if (!id) {
    throw new Error("No cart ID found when completing MercadoPago order")
  }



  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    // Verify server-side (against the MercadoPago API) that this cart has an
    // APPROVED payment matching the cart total BEFORE completing the order.
    const backendUrl =
      process.env.MEDUSA_BACKEND_URL ||
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
      "http://localhost:9000"

    const validationResponse = await fetch(
      `${backendUrl}/store/mercadopago-validate-payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          ...headers,
        },
        body: JSON.stringify({
          cart_id: id,
          ...(paymentId ? { payment_id: paymentId } : {}),
        }),
      }
    )

    const validation = await validationResponse.json().catch(() => null)

    if (!validationResponse.ok || !validation?.valid) {
      console.error(
        `[mercadopago] PAYMENT VALIDATION FAILED for cart_id=${id}: ` +
          `expected_amount=${validation?.expected_amount} ` +
          `approved_payments=${JSON.stringify(
            validation?.approved_payments ?? []
          )}. Order NOT completed.`
      )
      return {
        success: false,
        error:
          validation?.message ||
          "No pudimos verificar tu pago con Mercado Pago. El pedido no fue completado.",
      }
    }

    // First, get the cart to check if payment session exists
    const cart = await retrieveCart(id)

    // Create payment session if it doesn't exist
    const hasPaymentSession = cart?.payment_collection?.payment_sessions?.some(
      (session: any) => session.provider_id === providerId
    )

    if (!hasPaymentSession) {
      await sdk.store.payment
        .initiatePaymentSession(cart!, { provider_id: providerId }, {}, headers)
        .catch((e) => {
          // Silenciar error, simplemente no mostramos la info
        })
    }

    // Complete the cart
    const cartRes = await sdk.store.cart
      .complete(id, {}, headers)
      .then(async (cartRes) => {
        const cartCacheTag = await getCacheTag("carts")
        revalidateTag(cartCacheTag)
        return cartRes
      })
      .catch((err) => {
        throw err
      })

    if (cartRes?.type === "order") {
      const countryCode =
        cartRes.order.shipping_address?.country_code?.toLowerCase()

      const orderCacheTag = await getCacheTag("orders")
      revalidateTag(orderCacheTag)

      removeCartId()

      // Return the redirect URL instead of redirecting directly
      return {
        success: true,
        redirectUrl: `/${countryCode}/order/${cartRes?.order.id}/confirmed`
      }
    }

    return {
      success: false,
      error: "No se pudo completar el pedido"
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Error al completar el pedido"
    }
  }
}
