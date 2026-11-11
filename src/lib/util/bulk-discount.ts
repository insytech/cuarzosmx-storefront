import { HttpTypes } from "@medusajs/types"
import { FALLBACK_BULK_STATE, type PromoLineItemLike } from "./store-promotion"

/**
 * Fallback values only. The live threshold/percentage come from
 * GET /store/promotions/active (`bulk`), see `@lib/data/store-promotions`.
 */
export const BULK_DISCOUNT_THRESHOLD = FALLBACK_BULK_STATE.threshold
export const BULK_DISCOUNT_PERCENTAGE = FALLBACK_BULK_STATE.percentage
export const BULK_DISCOUNT_CODE = "BULK_20_AUTO"

/**
 * The backend writes the bulk adjustment without a `code` and marks it by its
 * description ("Descuento 20% mayoreo (+12 productos)"). The legacy code is kept
 * for adjustments created before that change.
 */
export function isBulkAdjustment(
    adj: { code?: string | null; description?: string | null } | null | undefined
): boolean {
    if (!adj) {
        return false
    }
    if (adj.code === BULK_DISCOUNT_CODE) {
        return true
    }
    return !adj.code && /^Descuento \d+(\.\d+)?% mayoreo/.test(adj.description ?? "")
}

export interface BulkDiscountResult {
    isEligible: boolean
    totalItems: number
    itemsNeeded: number
    discountAmount: number // Monto del descuento (ya aplicado por backend)
    hasBackendDiscount: boolean // Si el descuento ya fue aplicado por el backend
}

interface BulkCartLike {
    items?: PromoLineItemLike[] | null
}

/**
 * Detecta el descuento por volumen (bulk discount) para un carrito.
 * El descuento se aplica en el backend, esta función solo detecta si está aplicado.
 * - Se aplica a partir de `threshold` productos (por defecto 12)
 * - Solo aplica a productos que NO tienen otro descuento previo
 */
export function calculateBulkDiscount(
    cart: HttpTypes.StoreCart | BulkCartLike | null,
    threshold: number = BULK_DISCOUNT_THRESHOLD
): BulkDiscountResult {
    const defaultResult: BulkDiscountResult = {
        isEligible: false,
        totalItems: 0,
        itemsNeeded: threshold + 1,
        discountAmount: 0,
        hasBackendDiscount: false,
    }

    const items = (cart?.items ?? []) as PromoLineItemLike[]
    if (!items.length) {
        return defaultResult
    }

    // Contar total de items
    const totalItems = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0)
    const itemsNeeded = Math.max(0, threshold - totalItems)
    const isEligible = totalItems >= threshold

    // Buscar si hay descuentos bulk ya aplicados en los items (por el backend)
    let bulkDiscountTotal = 0
    let hasBulkAdjustment = false

    for (const item of items) {
        for (const adj of item.adjustments ?? []) {
            if (isBulkAdjustment(adj)) {
                bulkDiscountTotal += Number(adj.amount) || 0
                hasBulkAdjustment = true
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
