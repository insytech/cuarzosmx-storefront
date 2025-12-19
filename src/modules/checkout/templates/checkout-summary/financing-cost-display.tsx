"use client"

import { useFinancing } from "@modules/checkout/context/financing-context"
import { Text } from "@medusajs/ui"

export default function FinancingCostDisplay() {
    const { financingInfo } = useFinancing()



    if (!financingInfo || !financingInfo.hasFinancing) {
        return null
    }

    // Check if we have actual financing cost to show
    const showFinancingCost = financingInfo.hasFinancingCost && financingInfo.financingCost > 0

    return (
        <div className="mt-4 pt-4 border-t border-dashed border-blue-200 bg-blue-50 -mx-6 px-6 pb-4">
            {/* Installment info - always show when multiple installments */}
            <div className="flex justify-between items-center">
                <Text className="text-sm text-blue-700 font-medium">
                    Pago en cuotas
                </Text>
                <Text className="text-sm font-semibold text-blue-800">
                    {financingInfo.installments}x ${financingInfo.installmentAmount.toFixed(2)} MXN
                </Text>
            </div>

            {/* Only show financing cost if we actually have that information */}
            {showFinancingCost && (
                <>
                    <div className="flex justify-between items-center mt-2">
                        <Text className="text-xs text-orange-600">
                            Costo de financiamiento
                        </Text>
                        <Text className="text-xs text-orange-600">
                            + MX${financingInfo.financingCost.toFixed(2)}
                        </Text>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <Text className="text-xs font-semibold text-orange-700">
                            Total con financiamiento
                        </Text>
                        <Text className="text-sm font-bold text-orange-600">
                            MX${financingInfo.totalFinancedAmount.toFixed(2)}
                        </Text>
                    </div>
                </>
            )}

            {/* Note when we don't have financing cost info */}
            {!showFinancingCost && (
                <Text className="text-xs text-blue-500 mt-2">
                    El costo de financiamiento se mostrará en el resumen de pago de Mercado Pago
                </Text>
            )}
        </div>
    )
}
