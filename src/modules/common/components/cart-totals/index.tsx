"use client"

import { convertToLocale } from "@lib/util/money"
import {
  calculateBulkDiscount,
  BULK_DISCOUNT_PERCENTAGE,
  BULK_DISCOUNT_THRESHOLD,
} from "@lib/util/bulk-discount"
import { HttpTypes } from "@medusajs/types"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    shipping_total?: number | null
    discount_total?: number | null
    gift_card_total?: number | null
    currency_code: string
    shipping_subtotal?: number | null
    items?: HttpTypes.StoreCartLineItem[]
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const {
    currency_code,
    total,
    subtotal,
    tax_total,
    discount_total,
    gift_card_total,
    shipping_subtotal,
  } = totals

  // Detectar si hay descuento bulk aplicado (viene del backend)
  const bulkDiscount = calculateBulkDiscount(totals as HttpTypes.StoreCart)
  const showBulkDiscount = bulkDiscount.hasBackendDiscount && bulkDiscount.discountAmount > 0

  return (
    <div>
      <div className="flex flex-col gap-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">
            Subtotal
          </span>
          <span className="font-medium text-gray-900" data-testid="cart-subtotal" data-value={subtotal || 0}>
            {convertToLocale({ amount: subtotal ?? 0, currency_code })}
          </span>
        </div>

        {!!discount_total && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Descuento promoción
            </span>
            <span
              className="font-medium text-green-600"
              data-testid="cart-discount"
              data-value={discount_total || 0}
            >
              - {convertToLocale({ amount: discount_total ?? 0, currency_code })}
            </span>
          </div>
        )}

        {/* Descuento por volumen (Bulk Discount) - ya aplicado por backend */}
        {showBulkDiscount && (
          <div className="flex items-center justify-between bg-green-50 -mx-2 px-2 py-2 rounded-lg">
            <span className="text-gray-700 flex items-center gap-1.5">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">
                Descuento {BULK_DISCOUNT_PERCENTAGE}% (+{BULK_DISCOUNT_THRESHOLD} productos)
              </span>
            </span>
            <span
              className="font-bold text-green-600"
              data-testid="cart-bulk-discount"
              data-value={bulkDiscount.discountAmount}
            >
              - {convertToLocale({ amount: bulkDiscount.discountAmount, currency_code })}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-gray-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            Envío
          </span>
          <span className="font-medium text-gray-900" data-testid="cart-shipping" data-value={shipping_subtotal || 0}>
            {shipping_subtotal ? convertToLocale({ amount: shipping_subtotal ?? 0, currency_code }) : 'Por calcular'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Impuestos (IVA)</span>
          <span className="font-medium text-gray-900" data-testid="cart-taxes" data-value={tax_total || 0}>
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </span>
        </div>

        {!!gift_card_total && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Tarjeta de regalo</span>
            <span
              className="font-medium text-green-600"
              data-testid="cart-gift-card-amount"
              data-value={gift_card_total || 0}
            >
              - {convertToLocale({ amount: gift_card_total ?? 0, currency_code })}
            </span>
          </div>
        )}
      </div>

      {/* Total - ya incluye el descuento bulk del backend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span
            className="text-2xl font-bold text-main-color"
            data-testid="cart-total"
            data-value={total || 0}
          >
            {convertToLocale({ amount: total ?? 0, currency_code })}
          </span>
        </div>
        <p className="text-xs text-gray-500 text-right mt-1">IVA incluido</p>
      </div>
    </div>
  )
}

export default CartTotals
