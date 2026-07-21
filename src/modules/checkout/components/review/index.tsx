"use client"

import { Heading, Text, clx, Button } from "@medusajs/ui"
import { useCallback, useEffect, useRef, useState } from "react"
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
  // MercadoPago payment id of an ALREADY-charged card payment. Persisted so a
  // retry after a failed order completion never charges the card again.
  const [paidPaymentId, setPaidPaymentId] = useState<string | null>(() => {
    if (typeof window === "undefined" || !cart?.id) {
      return null
    }
    try {
      return sessionStorage.getItem(`mp_paid_payment_${cart.id}`)
    } catch {
      return null
    }
  })

  const isOpen = searchParams.get("step") === "review"

  // MercadoPago redirect return (Wallet / Mercado Crédito): the preference
  // back_urls point to /checkout?step=review&payment_status=success and
  // MercadoPago appends payment_id, status, collection_id, collection_status,
  // external_reference, etc. When the payment is approved we must complete the
  // order automatically — the customer already paid on MercadoPago's site.
  const paymentStatusParam = searchParams.get("payment_status")
  const collectionStatusParam = searchParams.get("collection_status")
  const statusParam = searchParams.get("status")
  const redirectPaymentId =
    searchParams.get("payment_id") || searchParams.get("collection_id")
  const externalReferenceParam = searchParams.get("external_reference")

  const isApprovedRedirect =
    isOpen &&
    (paymentStatusParam === "success" ||
      collectionStatusParam === "approved" ||
      statusParam === "approved")

  const [isCompletingRedirect, setIsCompletingRedirect] = useState(false)
  const redirectHandledRef = useRef(false)

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

  // Complete the order for a payment approved on MercadoPago's site
  // (redirect/wallet/Mercado Crédito flow)
  const completeRedirectOrder = useCallback(async () => {
    const cartId = cart?.id || externalReferenceParam

    if (!cartId) {
      setError("No se encontró el carrito para confirmar el pedido")
      return
    }

    setIsCompletingRedirect(true)
    setError(null)

    try {
      const orderResult = await completeMercadoPagoOrder(
        cartId,
        redirectPaymentId || undefined,
        "pp_mercadopago_mercadopago"
      )

      if (orderResult.success && orderResult.redirectUrl) {
        if (onPaymentComplete) {
          onPaymentComplete()
        }
        router.push(orderResult.redirectUrl)
        // Keep the spinner while navigating
        return
      }

      setError(orderResult.error || "Error al completar el pedido")
      setIsCompletingRedirect(false)
    } catch (err: any) {
      console.error("Error completing MercadoPago redirect order:", err)
      setError(err.message || "Error al completar el pedido")
      setIsCompletingRedirect(false)
    }
  }, [cart?.id, externalReferenceParam, redirectPaymentId, onPaymentComplete, router])

  useEffect(() => {
    if (!isApprovedRedirect || redirectHandledRef.current) {
      return
    }
    if (!cart?.id && !externalReferenceParam) {
      return
    }
    redirectHandledRef.current = true
    completeRedirectOrder()
  }, [isApprovedRedirect, cart?.id, externalReferenceParam, completeRedirectOrder])

  // Process MercadoPago card payment
  const handleMercadoPagoPayment = async () => {
    if (!mercadoPagoCardData) return

    setIsProcessing(true)
    setError(null)

    try {
      // Charge the card only if this cart wasn't already charged (a retry
      // after a failed completion must NOT create a second payment)
      let paymentId = paidPaymentId

      if (!paymentId) {
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

        paymentId = result.payment_id ? String(result.payment_id) : null

        // Remember the successful charge so a completion retry never
        // charges the card twice (state + sessionStorage for reloads)
        if (paymentId) {
          setPaidPaymentId(paymentId)
          try {
            sessionStorage.setItem(`mp_paid_payment_${cart?.id}`, paymentId)
          } catch (e) {
            // sessionStorage unavailable — in-memory state still protects us
          }
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
      }

      // Complete the order after successful payment. Passing the payment id
      // lets the backend validate against the strongly consistent
      // GET /v1/payments/{id} instead of the eventually consistent search.
      const orderResult = await completeMercadoPagoOrder(
        cart?.id,
        paymentId || undefined,
        "pp_mercadopago_mercadopago"
      )

      if (orderResult.success && orderResult.redirectUrl) {
        // Clear card data ONLY after the order is fully completed — clearing
        // it earlier made a failed completion unrecoverable for the customer
        if (onPaymentComplete) {
          onPaymentComplete()
        }
        try {
          sessionStorage.removeItem(`mp_paid_payment_${cart?.id}`)
        } catch (e) {
          // ignore
        }
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
      {isOpen && isApprovedRedirect && (
        <div className="w-full">
          {isCompletingRedirect ? (
            <div className="flex flex-col items-center gap-y-3 py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main-color" />
              <Text className="txt-medium-plus text-gray-700">
                Tu pago fue aprobado. Estamos confirmando tu pedido...
              </Text>
              <Text className="text-sm text-gray-500">
                No cierres esta ventana.
              </Text>
            </div>
          ) : error ? (
            <div className="w-full">
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <Text className="text-sm text-red-600">
                  Tu pago fue procesado por Mercado Pago, pero no pudimos
                  confirmar tu pedido: {error}
                </Text>
              </div>
              <Button
                size="large"
                className="w-full !bg-main-color hover:!bg-main-color-dark"
                onClick={completeRedirectOrder}
                data-testid="retry-complete-order-button"
              >
                Reintentar confirmación
              </Button>
              <Text className="text-xs text-gray-500 mt-3">
                Si el problema persiste, contáctanos con tu comprobante de pago
                de Mercado Pago — no se te cobrará de nuevo.
              </Text>
            </div>
          ) : null}
        </div>
      )}
      {isOpen && !isApprovedRedirect && previousStepsCompleted && (
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
              {paidPaymentId ? "Reintentar confirmación" : "Realizar pedido"}
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
