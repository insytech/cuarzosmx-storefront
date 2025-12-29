import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse rounded-lg" />
  }

  return (
    <div className="flex flex-col gap-1">
      {/* Main Price */}
      <div className="flex items-baseline gap-3">
        <span
          className={clx(
            "text-3xl font-bold",
            selectedPrice.price_type === "sale"
              ? "text-red-600"
              : "text-gray-900"
          )}
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {!variant && <span className="text-lg font-normal text-gray-500">Desde </span>}
          {selectedPrice.calculated_price}
        </span>

        {/* Original Price (if on sale) */}
        {selectedPrice.price_type === "sale" && (
          <span
            className="text-lg text-gray-400 line-through"
            data-testid="original-product-price"
            data-value={selectedPrice.original_price_number}
          >
            {selectedPrice.original_price}
          </span>
        )}
      </div>

      {/* Discount Badge */}
      {selectedPrice.price_type === "sale" && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
            -{selectedPrice.percentage_diff}% OFF
          </span>
          <span className="text-sm text-green-600 font-medium">
            ¡Ahorras {selectedPrice.original_price_number && selectedPrice.calculated_price_number
              ? `$${(selectedPrice.original_price_number - selectedPrice.calculated_price_number).toFixed(2)}`
              : ""}
          </span>
        </div>
      )}

      {/* Tax info */}

    </div>
  )
}
