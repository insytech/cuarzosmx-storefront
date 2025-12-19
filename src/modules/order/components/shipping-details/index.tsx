import { convertToLocale } from "@lib/util/money"
import { getShippingProviderInfo } from "@lib/data/fulfillment"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = async ({ order }: ShippingDetailsProps) => {
  const shippingMethod = (order as any).shipping_methods?.[0]

  // Intentar obtener info del proveedor desde el endpoint
  let providerInfo: { provider?: string; service?: string; days?: number } | null = null

  const destZip = order.shipping_address?.postal_code
  const shippingMethodName = shippingMethod?.name?.toLowerCase() || ""

  if (destZip) {
    // Determinar el tipo basado en el nombre del método
    const isExpress = shippingMethodName.includes("express") ||
      shippingMethodName.includes("rápido") ||
      shippingMethodName.includes("rapido")
    const type: 'standard' | 'express' = isExpress ? 'express' : 'standard'

    try {
      const response = await getShippingProviderInfo(destZip, type)
      if (response?.success) {
        providerInfo = {
          provider: response.provider,
          service: response.service,
          days: response.days,
        }
      }
    } catch (e) {
      // Silenciar error, simplemente no mostramos la info
    }
  }

  return (
    <div>
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6 text-gray-800">
        Envío
      </Heading>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="flex flex-col break-words min-w-0"
          data-testid="shipping-address-summary"
        >
          <Text className="txt-medium-plus text-gray-800 mb-1 font-semibold">
            Dirección de envío
          </Text>
          <Text className="txt-medium text-gray-600">
            {order.shipping_address?.first_name}{" "}
            {order.shipping_address?.last_name}
          </Text>
          <Text className="txt-medium text-gray-600">
            {order.shipping_address?.address_1}{" "}
            {order.shipping_address?.address_2}
          </Text>
          <Text className="txt-medium text-gray-600">
            {order.shipping_address?.postal_code},{" "}
            {order.shipping_address?.city}
          </Text>
          <Text className="txt-medium text-gray-600">
            {order.shipping_address?.country_code?.toUpperCase()}
          </Text>
        </div>

        <div
          className="flex flex-col break-words min-w-0"
          data-testid="shipping-contact-summary"
        >
          <Text className="txt-medium-plus text-gray-800 mb-1 font-semibold">Contacto</Text>
          <Text className="txt-medium text-gray-600">
            {order.shipping_address?.phone}
          </Text>
          <Text className="txt-medium text-gray-600">{order.email}</Text>
        </div>

        <div
          className="flex flex-col break-words min-w-0"
          data-testid="shipping-method-summary"
        >
          <Text className="txt-medium-plus text-gray-800 mb-1 font-semibold">Método</Text>
          <Text className="txt-medium text-gray-600">
            {shippingMethod?.name} (
            {convertToLocale({
              amount: order.shipping_methods?.[0]?.total ?? 0,
              currency_code: order.currency_code,
            })
              .replace(/,/g, "")
              .replace(/\./g, ",")}
            )
          </Text>
          {/* Mostrar info del proveedor si está disponible */}
          {providerInfo && (
            <Text className="txt-small text-gray-500 mt-1">
              vía {providerInfo.provider?.toUpperCase()}
              {providerInfo.service && ` - ${providerInfo.service}`}
              {providerInfo.days && (
                <span className="ml-1 text-green-600 font-medium">
                  ({providerInfo.days} {providerInfo.days === 1 ? 'día' : 'días'})
                </span>
              )}
            </Text>
          )}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default ShippingDetails
