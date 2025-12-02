"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripe as isStripeFunc, isMercadoPago, isMercadoCredito, isManual, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession, retrieveCart, completeMercadoPagoOrder } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  MercadoPagoContainer,
  MercadoPagoPaymentBrickContainer,
  MercadoCreditoContainer,
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState, useId } from "react"

// Type for MercadoPago card data
export type MercadoPagoCardData = {
  token: string
  payment_method_id: string
  installments: number
  issuer_id: string
  payer: any
  cart_id: string
  transaction_amount: number
  card_last_four?: string
  // Additional info for better UX
  payment_type_id?: string // 'credit_card' | 'debit_card'
  total_financed_amount?: number // Total amount including financing costs
  installment_amount?: number // Amount per installment
  financing_cost?: number // Cost of financing (total - original)
}

const Payment = ({
  cart,
  availablePaymentMethods,
  onMercadoPagoCardDataChange,
  mercadoPagoCardData,
}: {
  cart: any
  availablePaymentMethods: any[]
  onMercadoPagoCardDataChange?: (cardData: MercadoPagoCardData | null) => void
  mercadoPagoCardData?: MercadoPagoCardData | null
}) => {
  const radioGroupId = useId()
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const isStripe = isStripeFunc(selectedPaymentMethod)

  useEffect(() => {
    setMounted(true)
  }, [])

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    // Create payment session for Stripe only
    // MercadoPago creates the session after successful payment
    if (isStripeFunc(method)) {
      try {
        await initiatePaymentSession(cart, {
          provider_id: method,
        })
      } catch (err: any) {
        console.error("Error creating payment session:", err)
      }
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  // Payment is ready if there's an active session OR if we have MercadoPago card data
  const hasMercadoPagoCardData = mercadoPagoCardData !== null && mercadoPagoCardData !== undefined
  const paymentReady =
    ((activeSession || hasMercadoPagoCardData) && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    // Clear MercadoPago card data when editing
    if (onMercadoPagoCardDataChange && hasMercadoPagoCardData) {
      onMercadoPagoCardDataChange(null)
    }
    router.push(`${pathname}?${createQueryString("step", "payment")}`, {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputCard =
        isStripeFunc(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      // For Stripe, create payment session if needed
      if (isStripeFunc(selectedPaymentMethod) && !checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      // For manual payment methods, create payment session if needed
      if (isManual(selectedPaymentMethod) && !checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      // For MercadoPago, the Wallet Brick handles the payment directly
      // User will be redirected to MercadoPago to complete payment
      if (isMercadoPago(selectedPaymentMethod)) {
        // MercadoPago Wallet Brick handles the redirect, no need to do anything here
        // The preference is already created by MercadoPagoContainer
        return
      }

      // Navigate to review step after payment session is created
      if (!shouldInputCard) {
        return router.push(
          `${pathname}?${createQueryString("step", "review")}`,
          {
            scroll: false,
          }
        )
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-xl font-semibold gap-x-2 items-center text-gray-800",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Pago
          {!isOpen && paymentReady && <CheckCircleSolid className="text-main-color w-5 h-5" />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-main-color hover:text-main-color-dark font-medium text-sm"
              data-testid="edit-payment-button"
            >
              Editar
            </button>
          </Text>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && availablePaymentMethods?.length && mounted && (
            <>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
              >
                {availablePaymentMethods.map((paymentMethod) => (
                  <div key={paymentMethod.id}>
                    {isStripeFunc(paymentMethod.id) ? (
                      <StripeCardContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        paymentInfoMap={paymentInfoMap}
                        setCardBrand={setCardBrand}
                        setError={setError}
                        setCardComplete={setCardComplete}
                      />
                    ) : isMercadoPago(paymentMethod.id) ? (
                      <MercadoPagoPaymentBrickContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        paymentInfoMap={paymentInfoMap}
                        cart={cart}
                        onCardDataReady={(cardData) => {
                          console.log("Datos de tarjeta listos:", cardData)
                          setCardComplete(true)
                          setCardBrand(cardData.payment_method_id?.toUpperCase() || "Tarjeta")
                          // Notify parent component about card data
                          if (onMercadoPagoCardDataChange) {
                            onMercadoPagoCardDataChange(cardData)
                          }
                          // Navigate to review step
                          router.push(
                            `${pathname}?${createQueryString("step", "review")}`,
                            { scroll: false }
                          )
                        }}
                        onPaymentError={(error) => {
                          console.error("Error de pago:", error)
                          setError(error.message || "Error en el pago")
                        }}
                      />
                    ) : (
                      <PaymentContainer
                        paymentInfoMap={paymentInfoMap}
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                      />
                    )}
                  </div>
                ))}

                {/* Add Mercado Crédito option if MercadoPago is available */}
                {availablePaymentMethods.some(pm => isMercadoPago(pm.id)) && (
                  <MercadoCreditoContainer
                    paymentProviderId="mercado_credito"
                    selectedPaymentOptionId={selectedPaymentMethod}
                    paymentInfoMap={paymentInfoMap}
                    cart={cart}
                    onPaymentSuccess={() => {
                      console.log("Mercado Crédito payment initiated")
                    }}
                  />
                )}
              </RadioGroup>
            </>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-gray-800 mb-1 font-semibold">
                Método de pago
              </Text>
              <Text
                className="txt-medium text-gray-500"
                data-testid="payment-method-summary"
              >
                Tarjeta de regalo
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          {/* Don't show submit button for MercadoPago or MercadoCredito as they handle the redirect */}
          {!isMercadoPago(selectedPaymentMethod) && !isMercadoCredito(selectedPaymentMethod) && (
            <Button
              size="large"
              className="mt-6 !bg-main-color hover:!bg-main-color-dark"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={
                (isStripe && !cardComplete) ||
                (!selectedPaymentMethod && !paidByGiftcard)
              }
              data-testid="submit-payment-button"
            >
              {!activeSession && isStripeFunc(selectedPaymentMethod)
                ? "Procesar pago"
                : "Continuar a revisar"}
            </Button>
          )}
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && (activeSession || hasMercadoPagoCardData) ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-gray-800 mb-1 font-semibold">
                  Método de pago
                </Text>
                <Text
                  className="txt-medium text-gray-500"
                  data-testid="payment-method-summary"
                >
                  {hasMercadoPagoCardData
                    ? `Tarjeta de ${mercadoPagoCardData?.payment_type_id === 'debit_card' ? 'Débito' : 'Crédito'}`
                    : (paymentInfoMap[activeSession?.provider_id]?.title ||
                      activeSession?.provider_id)}
                </Text>
              </div>
              <div className="flex flex-col w-2/3">
                <Text className="txt-medium-plus text-gray-800 mb-1 font-semibold">
                  Detalles del pago
                </Text>
                <div
                  className="flex gap-2 txt-medium text-gray-500 items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {hasMercadoPagoCardData
                      ? paymentInfoMap.pp_mercadopago_mercadopago?.icon || <CreditCard />
                      : (paymentInfoMap[selectedPaymentMethod]?.icon || <CreditCard />)}
                  </Container>
                  <div className="flex flex-col">
                    <Text>
                      {hasMercadoPagoCardData
                        ? (() => {
                          const cardType = mercadoPagoCardData?.payment_method_id?.toUpperCase() || "Tarjeta"
                          const installments = mercadoPagoCardData?.installments || 1
                          const installmentAmount = mercadoPagoCardData?.installment_amount || 0
                          const totalFinanced = mercadoPagoCardData?.total_financed_amount || 0
                          const originalAmount = mercadoPagoCardData?.transaction_amount || 0

                          if (installments > 1) {
                            const hasFinancingCost = totalFinanced > originalAmount
                            return (
                              <>
                                {cardType} - {installments}x ${installmentAmount.toFixed(2)} MXN
                                {hasFinancingCost && (
                                  <span className="text-xs text-gray-400 ml-1">
                                    (Total: ${totalFinanced.toFixed(2)})
                                  </span>
                                )}
                              </>
                            )
                          }
                          return `${cardType} - Pago de contado`
                        })()
                        : (isStripeFunc(selectedPaymentMethod) && cardBrand
                          ? cardBrand
                          : "Se mostrará otro paso")}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-gray-800 mb-1 font-semibold">
                Método de pago
              </Text>
              <Text
                className="txt-medium text-gray-500"
                data-testid="payment-method-summary"
              >
                Tarjeta de regalo
              </Text>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Payment
