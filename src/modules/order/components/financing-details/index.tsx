"use client"

import { useEffect, useState } from "react"
import { Text, Container } from "@medusajs/ui"
import { CreditCard } from "@medusajs/icons"

type PaymentData = {
    total_financed_amount: number
    installment_amount: number
    financing_cost: number
    installments: number
    original_amount: number
    payment_type?: string // 'credit_card' or 'debit_card'
    payment_method?: string // 'master', 'visa', etc.
}

const FINANCING_STORAGE_KEY = "order_financing_data"

export default function FinancingDetails() {
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null)

    useEffect(() => {
        // Load payment data from sessionStorage
        try {
            const stored = sessionStorage.getItem(FINANCING_STORAGE_KEY)
            if (stored) {
                const data = JSON.parse(stored)
                setPaymentData(data)

                // Clear it after loading (one-time use)
                sessionStorage.removeItem(FINANCING_STORAGE_KEY)
            }
        } catch (e) {
            console.error("Error loading payment data:", e)
        }
    }, [])

    if (!paymentData) {
        return null
    }

    const isDebitCard = paymentData.payment_type === 'debit_card'
    const hasFinancingCost = paymentData.financing_cost > 0
    const cardTypeLabel = isDebitCard ? 'Tarjeta de Débito' : 'Tarjeta de Crédito'
    const cardBrand = paymentData.payment_method?.toUpperCase() || ''

    // For debit cards without financing, show simple payment info
    if (isDebitCard || (!hasFinancingCost && paymentData.installments === 1)) {
        return (
            <div className="mt-4 pt-4 border-t border-dashed border-green-200 bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Container className="flex items-center h-7 w-fit p-2 bg-green-100">
                        <CreditCard className="text-green-700" />
                    </Container>
                    <Text className="text-sm font-semibold text-green-800">
                        Pago con {cardTypeLabel}
                    </Text>
                </div>
                <Text className="text-sm text-green-700">
                    {cardBrand} - Pago de contado MX${paymentData.original_amount.toFixed(2)}
                </Text>
            </div>
        )
    }

    // For credit cards with installments
    return (
        <div className="mt-4 pt-4 border-t border-dashed border-orange-200 bg-orange-50 rounded-lg p-4">
            <Text className="text-sm font-semibold text-orange-800 mb-3">
                Detalles del pago - {cardTypeLabel}
            </Text>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Text className="text-sm text-gray-600">
                        Precio del producto
                    </Text>
                    <Text className="text-sm text-gray-700">
                        MX${paymentData.original_amount.toFixed(2)}
                    </Text>
                </div>

                {hasFinancingCost && (
                    <div className="flex justify-between items-center">
                        <Text className="text-sm text-orange-600">
                            Costo de financiamiento
                        </Text>
                        <Text className="text-sm text-orange-600">
                            + MX${paymentData.financing_cost.toFixed(2)}
                        </Text>
                    </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-orange-200">
                    <Text className="text-sm font-semibold text-orange-800">
                        Total a pagar ({paymentData.installments} cuotas)
                    </Text>
                    <Text className="text-lg font-bold text-orange-600">
                        MX${paymentData.total_financed_amount.toFixed(2)}
                    </Text>
                </div>

                <div className="text-center mt-2">
                    <Text className="text-xs text-orange-500">
                        {cardBrand} - {paymentData.installments} cuotas de MX${paymentData.installment_amount.toFixed(2)}
                    </Text>
                </div>
            </div>
        </div>
    )
}
