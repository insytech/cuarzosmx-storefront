import { HttpTypes } from "@medusajs/types"

export const BULK_DISCOUNT_THRESHOLD = 12
export const BULK_DISCOUNT_PERCENTAGE = 20
export const BULK_DISCOUNT_CODE = "BULK_20_AUTO"

export interface BulkDiscountResult {
    isEligible: boolean
    totalItems: number
    itemsNeeded: number
    discountAmount: number // Monto del descuento (ya aplicado por backend)
    hasBackendDiscount: boolean // Si el descuento ya fue aplicado por el backend
}

/**
 * Detecta el descuento por volumen (bulk discount) para un carrito.
 * El descuento se aplica en el backend, esta función solo detecta si está aplicado.
 * - Se aplica cuando hay más de 12 productos
 * - Solo aplica a productos que NO tienen otro descuento previo
 * - Descuento del 20% sobre productos elegibles
 */
export function calculateBulkDiscount(
    cart: HttpTypes.StoreCart | null
): BulkDiscountResult {
    const defaultResult: BulkDiscountResult = {
        isEligible: false,
        totalItems: 0,
        itemsNeeded: BULK_DISCOUNT_THRESHOLD + 1,
        discountAmount: 0,
        hasBackendDiscount: false,
    }

    if (!cart?.items?.length) {
        return defaultResult
    }

    // Contar total de items
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)
    const itemsNeeded = Math.max(0, BULK_DISCOUNT_THRESHOLD - totalItems)
    const isEligible = totalItems >= BULK_DISCOUNT_THRESHOLD

    // Buscar si hay descuentos bulk ya aplicados en los items (por el backend)
    let bulkDiscountTotal = 0
    let hasBulkAdjustment = false

    for (const item of cart.items) {
        const itemAny = item as any
        if (itemAny.adjustments) {
            for (const adj of itemAny.adjustments) {
                if (adj?.code === BULK_DISCOUNT_CODE) {
                    bulkDiscountTotal += adj.amount || 0
                    hasBulkAdjustment = true
                }
            }
        }
    }

    return {
        isEligible,
        totalItems,
        itemsNeeded,
        discountAmount: bulkDiscountTotal,
        hasBackendDiscount: hasBulkAdjustment,
    }
}

/**
 * Verifica si el carrito tiene descuento bulk aplicado
 */
export function hasBulkDiscount(cart: HttpTypes.StoreCart | null): boolean {
    const result = calculateBulkDiscount(cart)
    return result.hasBackendDiscount && result.discountAmount > 0
}
