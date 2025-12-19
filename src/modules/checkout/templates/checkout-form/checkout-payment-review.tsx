"use client"

import { useState, useEffect } from "react"
import Payment, { MercadoPagoCardData } from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import { useFinancing } from "@modules/checkout/context/financing-context"

const MERCADOPAGO_CARD_DATA_KEY = "mercadopago_card_data"

export default function CheckoutPaymentReview({
    cart,
    availablePaymentMethods,
}: {
    cart: any
    availablePaymentMethods: any[]
}) {
    // State to hold MercadoPago card data between Payment and Review steps
    const [mercadoPagoCardData, setMercadoPagoCardData] = useState<MercadoPagoCardData | null>(null)
    const [isHydrated, setIsHydrated] = useState(false)
    const { setFinancingInfo, clearFinancingInfo } = useFinancing()

    // Load card data from sessionStorage on mount (to persist across server re-renders)
    useEffect(() => {
        setIsHydrated(true)
        try {
            const stored = sessionStorage.getItem(MERCADOPAGO_CARD_DATA_KEY)
            if (stored) {
                const parsed = JSON.parse(stored)
                // Only use if it's for the same cart
                if (parsed.cart_id === cart?.id) {

                    setMercadoPagoCardData(parsed)
                    // Update financing context
                    updateFinancingFromCardData(parsed)
                } else {
                    // Different cart, clear old data
                    sessionStorage.removeItem(MERCADOPAGO_CARD_DATA_KEY)
                    clearFinancingInfo()
                }
            }
        } catch (e) {
            console.error("Error loading card data from sessionStorage:", e)
        }
    }, [cart?.id])

    // Update financing context from card data
    const updateFinancingFromCardData = (cardData: MercadoPagoCardData | null) => {

        if (cardData?.transaction_amount && cardData.installments) {
            const installments = cardData.installments || 1
            const hasMultipleInstallments = installments > 1

            // Use financing_cost from API if available, otherwise calculate
            const financingCost = cardData.financing_cost ??
                ((cardData.total_financed_amount || cardData.transaction_amount) - cardData.transaction_amount)
            const totalFinanced = cardData.total_financed_amount || (cardData.transaction_amount + financingCost)
            const hasFinancingCost = financingCost > 0

            const financingInfo = {
                // Show financing section if user selected multiple installments
                hasFinancing: hasMultipleInstallments,
                hasFinancingCost, // Whether there's an actual financing fee
                originalAmount: cardData.transaction_amount,
                totalFinancedAmount: totalFinanced,
                financingCost: financingCost,
                installments: installments,
                installmentAmount: cardData.installment_amount || (totalFinanced / installments),
                paymentType: cardData.payment_type_id || 'credit_card',
            }

            setFinancingInfo(financingInfo)
        } else {

            clearFinancingInfo()
        }
    }

    // Handle card data change - also save to sessionStorage
    const handleMercadoPagoCardDataChange = (cardData: MercadoPagoCardData | null) => {

        setMercadoPagoCardData(cardData)

        if (cardData) {
            try {
                sessionStorage.setItem(MERCADOPAGO_CARD_DATA_KEY, JSON.stringify(cardData))
                // Update financing context
                updateFinancingFromCardData(cardData)
            } catch (e) {
                console.error("Error saving card data to sessionStorage:", e)
            }
        } else {
            sessionStorage.removeItem(MERCADOPAGO_CARD_DATA_KEY)
            clearFinancingInfo()
        }
    }

    // Clear card data after successful payment
    const clearCardData = () => {
        setMercadoPagoCardData(null)
        sessionStorage.removeItem(MERCADOPAGO_CARD_DATA_KEY)
        clearFinancingInfo()
    }

    return (
        <>
            <Payment
                cart={cart}
                availablePaymentMethods={availablePaymentMethods}
                onMercadoPagoCardDataChange={handleMercadoPagoCardDataChange}
                mercadoPagoCardData={mercadoPagoCardData}
            />
            <Review
                cart={cart}
                mercadoPagoCardData={mercadoPagoCardData}
                onPaymentComplete={clearCardData}
            />
        </>
    )
}
