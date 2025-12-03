"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export const listCartShippingMethods = async (cartId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("fulfillment")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreShippingOptionListResponse>(
      "/store/shipping-options",
      {
        method: "GET",
        query: {
          cart_id: cartId,
          fields:
            "+service_zone.fulfllment_set.type,*service_zone.fulfillment_set.location.address",
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ shipping_options }) => shipping_options)
    .catch(() => {
      return null
    })
}

export const calculatePriceForShippingOption = async (
  optionId: string,
  cartId: string,
  data?: Record<string, unknown>
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("fulfillment")),
  }

  const body = { cart_id: cartId, data }

  if (data) {
    body.data = data
  }

  return sdk.client
    .fetch<{ shipping_option: HttpTypes.StoreCartShippingOption }>(
      `/store/shipping-options/${optionId}/calculate`,
      {
        method: "POST",
        body,
        headers,
        next,
      }
    )
    .then(({ shipping_option }) => shipping_option)
    .catch((e) => {
      return null
    })
}

export type ShippingProviderInfo = {
  success: boolean
  type: string
  dest_zip: string
  provider?: string
  service?: string
  price?: number
  days?: number
  currency?: string
  message?: string
}

/**
 * Obtiene información del proveedor de envío seleccionado
 * @param destZip - Código postal de destino
 * @param type - 'standard' o 'express'
 */
export const getShippingProviderInfo = async (
  destZip: string,
  type: 'standard' | 'express'
): Promise<ShippingProviderInfo | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    const response = await sdk.client.fetch<ShippingProviderInfo>(
      "/store/shipping-provider-info",
      {
        method: "GET",
        query: {
          dest_zip: destZip,
          type,
        },
        headers,
      }
    )
    return response
  } catch (e) {
    console.error("[getShippingProviderInfo] Error:", e)
    return null
  }
}
