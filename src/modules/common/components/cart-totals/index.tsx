"use client"

import { convertToLocale } from "@lib/util/money"
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
              Descuento
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

      {/* Total */}
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
