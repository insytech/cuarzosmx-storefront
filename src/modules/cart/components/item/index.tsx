"use client"

import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // Calculate max quantity based on variant settings (same logic as product page)
  const canAddUnlimited =
    !item.variant?.manage_inventory || item.variant?.allow_backorder

  // Get the max quantity user can add
  const maxQuantity = canAddUnlimited
    ? Infinity
    : (item.variant?.inventory_quantity || 0)

  if (type === "preview") {
    return (
      <div className="flex gap-3 py-3" data-testid="product-row">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className="w-16 flex-shrink-0"
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
        <div className="flex flex-col flex-1 justify-between min-w-0">
          <div>
            <p className="text-sm font-medium text-gray-900 truncate" data-testid="product-title">
              {item.product_title}
            </p>
            <LineItemOptions variant={item.variant} data-testid="product-variant" />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-gray-500">{item.quantity}x</span>
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-4 sm:py-5" data-testid="product-row">
      {/* Mobile Layout */}
      <div className="sm:hidden">
        <div className="flex gap-4">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
          >
            <Thumbnail
              thumbnail={item.thumbnail}
              images={item.variant?.product?.images}
              size="square"
            />
          </LocalizedClientLink>

          <div className="flex-1 min-w-0">
            <LocalizedClientLink href={`/products/${item.product_handle}`}>
              <p className="font-medium text-gray-900 truncate" data-testid="product-title">
                {item.product_title}
              </p>
            </LocalizedClientLink>
            <LineItemOptions variant={item.variant} data-testid="product-variant" />

            <div className="mt-2 flex items-center justify-between">
              <LineItemPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </div>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => item.quantity > 1 && changeQuantity(item.quantity - 1)}
              disabled={updating || item.quantity <= 1}
              className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
            </button>
            <span className="w-10 text-center font-medium text-gray-900">
              {updating ? <Spinner className="w-4 h-4 mx-auto" /> : item.quantity}
            </span>
            <button
              onClick={() => changeQuantity(item.quantity + 1)}
              disabled={updating || item.quantity >= maxQuantity}
              className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <DeleteButton
            id={item.id}
            data-testid="product-delete-button"
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Eliminar
          </DeleteButton>
        </div>
        <ErrorMessage error={error} data-testid="product-error-message" />
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:grid sm:grid-cols-12 gap-4 items-center">
        {/* Product Info */}
        <div className="col-span-6 flex gap-4">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
          >
            <Thumbnail
              thumbnail={item.thumbnail}
              images={item.variant?.product?.images}
              size="square"
            />
          </LocalizedClientLink>

          <div className="flex flex-col justify-center min-w-0">
            <LocalizedClientLink href={`/products/${item.product_handle}`}>
              <p className="font-medium text-gray-900 hover:text-main-color transition-colors" data-testid="product-title">
                {item.product_title}
              </p>
            </LocalizedClientLink>
            <LineItemOptions variant={item.variant} data-testid="product-variant" />
            <DeleteButton
              id={item.id}
              data-testid="product-delete-button"
              className="text-red-500 hover:text-red-700 text-xs font-medium mt-1 w-fit"
            >
              Eliminar
            </DeleteButton>
          </div>
        </div>

        {/* Quantity */}
        <div className="col-span-2 flex items-center justify-center">
          <div className="flex items-center gap-1">
            <button
              onClick={() => item.quantity > 1 && changeQuantity(item.quantity - 1)}
              disabled={updating || item.quantity <= 1}
              className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
            </button>
            <span className="w-8 text-center font-medium text-gray-900 text-sm">
              {updating ? <Spinner className="w-3 h-3 mx-auto" /> : item.quantity}
            </span>
            <button
              onClick={() => changeQuantity(item.quantity + 1)}
              disabled={updating || item.quantity >= maxQuantity}
              className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </div>

        {/* Unit Price */}
        <div className="col-span-2 text-right">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </div>

        {/* Total */}
        <div className="col-span-2 text-right">
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </div>
      </div>
    </div>
  )
}

export default Item
