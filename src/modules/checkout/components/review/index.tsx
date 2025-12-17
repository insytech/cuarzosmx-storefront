"use client"

import { Heading, Text, clx, Button } from "@medusajs/ui"
import { useState } from "react"
import { useRouter } from "next/navigation"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import { isMercadoPago } from "@lib/constants"
import { completeMercadoPagoOrder } from "@lib/data/cart"
import type { MercadoPagoCardData } from "../payment"

const Review = ({
  cart,
  mercadoPagoCardData,
  onPaymentComplete,
}: {
  cart: any
  mercadoPagoCardData?: MercadoPagoCardData | null
  onPaymentComplete?: () => void
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  // Check if payment is via MercadoPago
  const activeSession = cart?.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )
  const isMercadoPagoPayment = mercadoPagoCardData !== null && mercadoPagoCardData !== undefined

  const previousStepsCompleted =
    cart?.shipping_address &&
    (cart?.shipping_methods?.length ?? 0) > 0 &&
    (cart?.payment_collection || paidByGiftcard || isMercadoPagoPayment)

  // Process MercadoPago payment
  const handleMercadoPagoPayment = async () => {
    if (!mercadoPagoCardData) return

    setIsProcessing(true)
    setError(null)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
      const response = await fetch(`${backendUrl}/store/mercadopago-card-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        body: JSON.stringify({
          cart_id: mercadoPagoCardData.cart_id,
          token: mercadoPagoCardData.token,
          payment_method_id: mercadoPagoCardData.payment_method_id,
          installments: mercadoPagoCardData.installments,
          issuer_id: mercadoPagoCardData.issuer_id,
          payer: mercadoPagoCardData.payer,
          transaction_amount: mercadoPagoCardData.transaction_amount,
          // Include financing data for order metadata
          financing_data: {
            total_financed_amount: mercadoPagoCardData.total_financed_amount,
            installment_amount: mercadoPagoCardData.installment_amount,
            financing_cost: mercadoPagoCardData.financing_cost,
            installments: mercadoPagoCardData.installments,
          },
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || result.error || "Error procesando el pago")
      }

      // Save payment data to sessionStorage for the confirmation page
      // This includes both financing info and card type (debit/credit)
      try {
        sessionStorage.setItem("order_financing_data", JSON.stringify({
          total_financed_amount: mercadoPagoCardData.total_financed_amount,
          installment_amount: mercadoPagoCardData.installment_amount,
          financing_cost: mercadoPagoCardData.financing_cost || 0,
          installments: mercadoPagoCardData.installments,
          original_amount: mercadoPagoCardData.transaction_amount,
          payment_type: mercadoPagoCardData.payment_type_id, // 'credit_card' or 'debit_card'
          payment_method: mercadoPagoCardData.payment_method_id, // 'master', 'visa', etc.
        }))
      } catch (e) {
        console.error("Error saving payment data:", e)
      }

      // Clear card data from sessionStorage
      if (onPaymentComplete) {
        onPaymentComplete()
      }

      // Complete the order after successful payment
      const orderResult = await completeMercadoPagoOrder(
        cart?.id,
        result.payment_id,
        "pp_mercadopago_mercadopago"
      )

      if (orderResult.success && orderResult.redirectUrl) {
        router.push(orderResult.redirectUrl)
      } else {
        setError(orderResult.error || "Error al completar el pedido")
      }
    } catch (err: any) {
      console.error("Error processing payment:", err)
      setError(err.message || "Error al procesar el pago")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-xl font-semibold gap-x-2 items-center text-gray-800",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Revisar
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-plus text-gray-600 mb-1">
                Al hacer clic en el botón Realizar pedido, confirmas que has
                leído, entendido y aceptado nuestros{" "}
                <a
                  href="/mx/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-main-color hover:underline"
                >
                  Términos de Uso
                </a>
                ,{" "}
                <a
                  href="/mx/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-main-color hover:underline"
                >
                  Términos de Venta
                </a>
                {" "}y{" "}
                <a
                  href="/mx/shipping"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-main-color hover:underline"
                >
                  Política de Devoluciones
                </a>
                , y reconoces que has leído la{" "}
                <a
                  href="/mx/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-main-color hover:underline"
                >
                  Política de Privacidad
                </a>
                {" "}de CuarzosMX.
              </Text>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <Text className="text-sm text-red-600">{error}</Text>
            </div>
          )}

          {/* Use custom button for MercadoPago, standard PaymentButton for others */}
          {isMercadoPagoPayment ? (
            <Button
              size="large"
              className="w-full !bg-main-color hover:!bg-main-color-dark"
              onClick={handleMercadoPagoPayment}
              isLoading={isProcessing}
              disabled={isProcessing}
              data-testid="submit-order-button"
            >
              Realizar pedido
            </Button>
          ) : (
            <PaymentButton cart={cart} data-testid="submit-order-button" />
          )}
        </>
      )}
    </div>
  )
}

export default Review
