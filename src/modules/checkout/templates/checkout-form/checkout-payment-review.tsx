"use client"

import { useState, useEffect } from "react"
import Payment, { MercadoPagoCardData } from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"

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

  // Load card data from sessionStorage on mount (to persist across server re-renders)
  useEffect(() => {
    setIsHydrated(true)
    try {
      const stored = sessionStorage.getItem(MERCADOPAGO_CARD_DATA_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Only use if it's for the same cart
        if (parsed.cart_id === cart?.id) {
          console.log("Loaded MercadoPago card data from sessionStorage:", parsed)
          setMercadoPagoCardData(parsed)
        } else {
          // Different cart, clear old data
          sessionStorage.removeItem(MERCADOPAGO_CARD_DATA_KEY)
        }
      }
    } catch (e) {
      console.error("Error loading card data from sessionStorage:", e)
    }
  }, [cart?.id])

  // Handle card data change - also save to sessionStorage
  const handleMercadoPagoCardDataChange = (cardData: MercadoPagoCardData | null) => {
    console.log("Setting MercadoPago card data:", cardData)
    setMercadoPagoCardData(cardData)
    if (cardData) {
      try {
        sessionStorage.setItem(MERCADOPAGO_CARD_DATA_KEY, JSON.stringify(cardData))
      } catch (e) {
        console.error("Error saving card data to sessionStorage:", e)
      }
    } else {
      sessionStorage.removeItem(MERCADOPAGO_CARD_DATA_KEY)
    }
  }

  // Clear card data after successful payment
  const clearCardData = () => {
    setMercadoPagoCardData(null)
    sessionStorage.removeItem(MERCADOPAGO_CARD_DATA_KEY)
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
