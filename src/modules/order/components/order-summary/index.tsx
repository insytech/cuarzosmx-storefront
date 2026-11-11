import { convertToLocale } from "@lib/util/money"
import { getTierDiscount } from "@lib/util/store-promotion"
import { HttpTypes } from "@medusajs/types"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  // Descuento por monto (Buen Fin, ...) detectado por la descripción del ajuste.
  // Solo se separa si el pedido trae los ajustes de sus líneas.
  const tierDiscount = getTierDiscount(order.items)
  const otherDiscount = Math.max(
    0,
    Math.round(
      ((order.discount_total ?? 0) - (tierDiscount?.amount ?? 0)) * 100
    ) / 100
  )

  return (
    <div>
      <h2 className="text-base-semi text-gray-800">Resumen del Pedido</h2>
      <div className="text-small-regular text-gray-600 my-2">
        <div className="flex items-center justify-between text-base-regular text-gray-800 mb-2">
          <span>Subtotal</span>
          <span>{getAmount(order.subtotal)}</span>
        </div>
        <div className="flex flex-col gap-y-1">
          {tierDiscount && (
            <div
              className="flex items-center justify-between font-semibold text-green-700"
              data-testid="order-tier-discount"
            >
              <span>
                {tierDiscount.name}
                {tierDiscount.percentage !== null &&
                  ` −${tierDiscount.percentage}%`}
              </span>
              <span>−{getAmount(tierDiscount.amount)}</span>
            </div>
          )}
          {otherDiscount > 0 && (
            <div className="flex items-center justify-between">
              <span>Descuento</span>
              <span className="text-green-600">- {getAmount(otherDiscount)}</span>
            </div>
          )}
          {order.gift_card_total > 0 && (
            <div className="flex items-center justify-between">
              <span>Tarjeta de regalo</span>
              <span className="text-green-600">- {getAmount(order.gift_card_total)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span>Envío</span>
            <span>{getAmount(order.shipping_total)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Impuestos (IVA)</span>
            <span>{getAmount(order.tax_total)}</span>
          </div>
        </div>
        <div className="h-px w-full border-b border-gray-200 border-dashed my-4" />
        <div className="flex items-center justify-between text-base-regular text-gray-800 mb-2">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-main-color">{getAmount(order.total)}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
