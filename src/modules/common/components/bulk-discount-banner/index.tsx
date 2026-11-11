"use client"

import { convertToLocale } from "@lib/util/money"
import { calculateBulkDiscount } from "@lib/util/bulk-discount"
import {
    FALLBACK_BULK_STATE,
    type StoreBulkState,
} from "@lib/util/store-promotion"
import { HttpTypes } from "@medusajs/types"

type BulkDiscountBannerProps = {
    cart: HttpTypes.StoreCart | null
    variant?: "full" | "compact" | "mini"
    /** Live bulk switch/values from GET /store/promotions/active. */
    bulk?: StoreBulkState
}

const BulkDiscountBanner = ({
    cart,
    variant = "full",
    bulk = FALLBACK_BULK_STATE,
}: BulkDiscountBannerProps) => {
    const { threshold, percentage } = bulk
    const bulkDiscount = calculateBulkDiscount(cart, threshold)

    // Bulk switched off in admin, or paused by a tiered promotion in force.
    if (!bulk.applies) {
        return null
    }
    const currencyCode = cart?.currency_code ?? "MXN"

    // Si el descuento ya fue aplicado por el backend
    const hasDiscount = bulkDiscount.hasBackendDiscount && bulkDiscount.discountAmount > 0

    if (hasDiscount) {
        if (variant === "mini") {
            return (
                <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>-{percentage}% aplicado</span>
                </div>
            )
        }

        if (variant === "compact") {
            return (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-green-800">
                                ¡Descuento por volumen aplicado!
                            </p>
                            <p className="text-xs text-green-600">
                                Ahorraste{" "}
                                <span className="font-bold">
                                    {convertToLocale({
                                        amount: bulkDiscount.discountAmount,
                                        currency_code: currencyCode,
                                    })}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            )
        }

        // Full variant
        return (
            <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <svg
                            className="w-7 h-7 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-green-800">
                                🎉 ¡Felicidades! Descuento aplicado
                            </h3>
                        </div>
                        <p className="text-sm text-green-700 mb-2">
                            Por tener más de {threshold} productos, obtuviste{" "}
                            <span className="font-bold">
                                {percentage}% de descuento
                            </span>{" "}
                            en productos sin promoción.
                        </p>
                        <div className="bg-white/60 rounded-lg p-2 inline-block">
                            <p className="text-green-800">
                                <span className="text-sm">Tu ahorro:</span>{" "}
                                <span className="text-xl font-bold text-green-600">
                                    {convertToLocale({
                                        amount: bulkDiscount.discountAmount,
                                        currency_code: currencyCode,
                                    })}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Si le faltan productos para el descuento
    if (bulkDiscount.itemsNeeded > 0 && bulkDiscount.totalItems > 0) {
        const progress = Math.min(
            (bulkDiscount.totalItems / threshold) * 100,
            100
        )

        if (variant === "mini") {
            return (
                <div className="text-xs text-purple-600">
                    ¡Agrega {bulkDiscount.itemsNeeded} más para -{percentage}
                    %!
                </div>
            )
        }

        if (variant === "compact") {
            return (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-purple-800">
                                ¡Te faltan solo{" "}
                                <span className="font-bold">{bulkDiscount.itemsNeeded}</span>{" "}
                                productos!
                            </p>
                            <p className="text-xs text-purple-600">
                                Para obtener {percentage}% de descuento
                            </p>
                        </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 w-full bg-purple-200 rounded-full h-1.5">
                        <div
                            className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )
        }

        // Full variant
        return (
            <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-violet-50 border-2 border-purple-300 rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
                        <svg
                            className="w-7 h-7 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-purple-800 mb-1">
                            💎 ¡Estás muy cerca del{" "}
                            <span className="text-indigo-600">
                                {percentage}%
                            </span>{" "}
                            de descuento!
                        </h3>
                        <p className="text-sm text-purple-700 mb-3">
                            Agrega{" "}
                            <span className="font-bold text-lg text-purple-600">
                                {bulkDiscount.itemsNeeded}
                            </span>{" "}
                            {bulkDiscount.itemsNeeded === 1 ? "producto más" : "productos más"}{" "}
                            a tu carrito y obtén{" "}
                            <span className="font-bold">
                                {percentage}% de descuento
                            </span>{" "}
                            en productos sin promoción.
                        </p>
                        {/* Progress bar */}
                        <div className="w-full bg-purple-200 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-1"
                                style={{ width: `${progress}%` }}
                            >
                                {progress > 20 && (
                                    <span className="text-[10px] text-white font-bold">
                                        {bulkDiscount.totalItems}/{threshold}
                                    </span>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-purple-500 mt-1">
                            {bulkDiscount.totalItems} de {threshold}{" "}
                            productos necesarios
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // Si el carrito está vacío o tiene muy pocos items, no mostrar nada
    return null
}

export default BulkDiscountBanner
