import { Radio as RadioGroupOption } from "@headlessui/react"
import { Text, clx } from "@medusajs/ui"
import React, { useCallback, useContext, useEffect, useMemo, useState, type JSX } from "react"
import { HttpTypes } from "@medusajs/types"
import { initMercadoPago, Wallet, CardPayment, Payment as MercadoPagoPayment } from "@mercadopago/sdk-react"

import Radio from "@modules/common/components/radio"

// Initialize Mercado Pago SDK with your Public Key
const mercadopagoPublicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
if (mercadopagoPublicKey) {
  initMercadoPago(mercadopagoPublicKey, {
    locale: 'es-MX'
  })
}

import { isManual, isMercadoPago } from "@lib/constants"
import SkeletonCardDetails from "@modules/skeletons/components/skeleton-card-details"
import { CardElement } from "@stripe/react-stripe-js"
import { StripeCardElementOptions } from "@stripe/stripe-js"
import PaymentTest from "../payment-test"
import { StripeContext } from "../payment-wrapper/stripe-wrapper"

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  children?: React.ReactNode
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  children,
}) => {
  const isSelected = selectedPaymentOptionId === paymentProviderId
  const isTransfer = isManual(paymentProviderId)

  return (
    <RadioGroupOption
      key={paymentProviderId}
      value={paymentProviderId}
      disabled={disabled}
      className={clx(
        "flex flex-col gap-y-2 text-small-regular cursor-pointer py-4 border rounded-lg px-3 sm:px-6 mb-2 transition-all",
        {
          "border-main-color bg-main-color-light/20 shadow-sm":
            isSelected,
          "border-gray-200 hover:border-main-color/50 hover:bg-gray-50":
            !isSelected,
        }
      )}
    >
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-x-4">
          <Radio checked={isSelected} />
          <Text className="text-base-regular text-gray-700">
            {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
          </Text>
        </div>
        <span className="justify-self-end text-ui-fg-base">
          {paymentInfoMap[paymentProviderId]?.icon}
        </span>
      </div>

      {/* Show bank transfer instructions when selected */}
      {isTransfer && isSelected && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Text className="text-sm font-semibold text-blue-800 mb-2">
            Instrucciones para transferencia bancaria
          </Text>
          <div className="space-y-2 text-sm text-blue-700">
            <p><strong>Banco:</strong> Banamex</p>
            <p><strong>Nombre:</strong> Mario Alberto Trujillo Dueñas</p>
            <p><strong>CLABE:</strong> 002930701038297964</p>
            <p><strong>Cuenta:</strong> 70103829796</p>
            <p><strong>ó para Deposito en Oxxo:</strong> 5206 9877 3441 6596</p>
          </div>
          <Text className="text-xs text-blue-600 mt-3">
            Una vez realizada la transferencia, envía tu comprobante a <strong>ventas@cuarzos.mx</strong> con tu número de pedido.
          </Text>
        </div>
      )}

      {children}
    </RadioGroupOption>
  )
}

export default PaymentContainer

export const MercadoPagoContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  cartId,
}: Omit<PaymentContainerProps, "children"> & {
  cartId?: string
}) => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create MercadoPago preference when this payment method is selected
  useEffect(() => {
    const createPreference = async () => {
      if (selectedPaymentOptionId !== paymentProviderId || !cartId) {
        return
      }

      // Don't create a new preference if we already have one
      if (preferenceId) {
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
        const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        }

        if (publishableKey) {
          headers["x-publishable-api-key"] = publishableKey
        }

        const response = await fetch(`${backendUrl}/store/mercadopago-preference`, {
          method: "POST",
          headers,
          body: JSON.stringify({ cart_id: cartId }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || "Error creating MercadoPago preference")
        }

        const data = await response.json()
        setPreferenceId(data.preference_id)
      } catch (err: any) {
        console.error('Error creating MercadoPago preference:', err)
        setError(err.message || "Error al crear preferencia de MercadoPago")
      } finally {
        setIsLoading(false)
      }
    }

    createPreference()
  }, [selectedPaymentOptionId, paymentProviderId, cartId, preferenceId])

  // Reset preference when payment method changes away from MercadoPago
  useEffect(() => {
    if (selectedPaymentOptionId !== paymentProviderId) {
      setPreferenceId(null)
      setError(null)
    }
  }, [selectedPaymentOptionId, paymentProviderId])

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >
      {selectedPaymentOptionId === paymentProviderId && (
        <div className="my-4 transition-all duration-150 ease-in-out">
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            Completa tu pago con Mercado Pago:
          </Text>
          {error ? (
            <div className="text-center py-4 border border-red-200 rounded-md bg-red-50">
              <Text className="text-sm text-red-600 mb-2">
                Error al configurar Mercado Pago
              </Text>
              <Text className="text-xs text-red-500">
                {error}
              </Text>
            </div>
          ) : isLoading ? (
            <div className="text-center py-4">
              <Text className="text-sm text-ui-fg-subtle">
                Preparando opciones de pago...
              </Text>
              <div className="mt-2 flex justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ui-fg-base" />
              </div>
            </div>
          ) : preferenceId ? (
            <div className="w-full max-w-[200px] mx-auto my-3">
              <Wallet
                initialization={{ preferenceId }}
                onReady={() => { }}
                onError={(walletError) => {
                  console.error('Mercado Pago Wallet error:', walletError)
                  setError("Error al cargar el botón de Mercado Pago")
                }}
              />
            </div>
          ) : (
            <div className="text-center py-4">
              <Text className="text-sm text-ui-fg-subtle">
                Preparando opciones de pago...
              </Text>
              <div className="mt-2 flex justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ui-fg-base" />
              </div>
            </div>
          )}
        </div>
      )}
    </PaymentContainer>
  )
}

export const StripeCardContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  setCardBrand,
  setError,
  setCardComplete,
}: Omit<PaymentContainerProps, "children"> & {
  setCardBrand: (brand: string) => void
  setError: (error: string | null) => void
  setCardComplete: (complete: boolean) => void
}) => {
  const stripeReady = useContext(StripeContext)

  const useOptions: StripeCardElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: "Inter, sans-serif",
          color: "#424270",
          "::placeholder": {
            color: "rgb(107 114 128)",
          },
        },
      },
      classes: {
        base: "pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover transition-all duration-300 ease-in-out",
      },
    }
  }, [])

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >
      {selectedPaymentOptionId === paymentProviderId &&
        (stripeReady ? (
          <div className="my-4 transition-all duration-150 ease-in-out">
            <Text className="txt-medium-plus text-gray-800 mb-1">
              Ingresa los datos de tu tarjeta:
            </Text>
            <CardElement
              options={useOptions as StripeCardElementOptions}
              onChange={(e) => {
                setCardBrand(
                  e.brand && e.brand.charAt(0).toUpperCase() + e.brand.slice(1)
                )
                setError(e.error?.message || null)
                setCardComplete(e.complete)
              }}
            />
          </div>
        ) : (
          <SkeletonCardDetails />
        ))}
    </PaymentContainer>
  )
}

export const StripeCardContainerES = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  setCardBrand,
  setError,
  setCardComplete,
}: Omit<PaymentContainerProps, "children"> & {
  setCardBrand: (brand: string) => void
  setError: (error: string | null) => void
  setCardComplete: (complete: boolean) => void
}) => {
  const stripeReady = useContext(StripeContext)

  const useOptions: StripeCardElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: "Inter, sans-serif",
          color: "#424270",
          "::placeholder": {
            color: "rgb(107 114 128)",
          },
        },
      },
      classes: {
        base: "pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover transition-all duration-300 ease-in-out",
      },
    }
  }, [])

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >
      {selectedPaymentOptionId === paymentProviderId &&
        (stripeReady ? (
          <div className="my-4 transition-all duration-150 ease-in-out">
            <Text className="txt-medium-plus text-gray-800 mb-1">
              Ingresa los datos de tu tarjeta:
            </Text>
            <CardElement
              options={useOptions as StripeCardElementOptions}
              onChange={(e) => {
                setCardBrand(
                  e.brand && e.brand.charAt(0).toUpperCase() + e.brand.slice(1)
                )
                setError(e.error?.message || null)
                setCardComplete(e.complete)
              }}
            />
          </div>
        ) : (
          <SkeletonCardDetails />
        ))}
    </PaymentContainer>
  )
}

export const MercadoPagoCardContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled,
  cart,
  setCardComplete,
  setError,
  onPaymentSuccess,
}: Omit<PaymentContainerProps, "children"> & {
  cart: HttpTypes.StoreCart | null
  setCardComplete: (complete: boolean) => void
  setError: (error: string | null) => void
  onPaymentSuccess?: (paymentId: string) => void
}) => {
  const [isReady, setIsReady] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const initialization = useMemo(() => {
    if (!cart) return { amount: 0 }
    return {
      amount: cart.total ? cart.total / 100 : 0,
    }
  }, [cart])

  const customization = useMemo(() => ({
    visual: {
      style: {
        theme: "default" as const,
      },
    },
    paymentMethods: {
      maxInstallments: 12,
    },
  }), [])

  const onReady = useCallback(() => {
    setIsReady(true)
  }, [])

  const onSubmit = useCallback(async (formData: any) => {
    if (!cart?.id) {
      setError("No se encontró el carrito")
      return Promise.reject(new Error("No cart"))
    }

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
          cart_id: cart.id,
          ...formData
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || result.error || "Error procesando el pago")
      }


      setCardComplete(true)

      if (onPaymentSuccess) {
        onPaymentSuccess(result.payment_id)
      }

      return Promise.resolve()
    } catch (error: any) {
      console.error("Error en pago:", error)
      setError(error.message || "Error procesando el pago")
      setCardComplete(false)
      return Promise.reject(error)
    } finally {
      setIsProcessing(false)
    }
  }, [cart, setError, setCardComplete, onPaymentSuccess])

  const onError = useCallback((error: any) => {
    console.error("MercadoPago CardPayment error:", error)
    setError(error?.message || "Error en el formulario de pago")
    setCardComplete(false)
  }, [setError, setCardComplete])

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >
      {selectedPaymentOptionId === paymentProviderId && (
        <div className="my-4 transition-all duration-150 ease-in-out">
          {!isReady && <SkeletonCardDetails />}
          <div className={!isReady ? "hidden" : ""}>
            <CardPayment
              initialization={initialization}
              customization={customization}
              onReady={onReady}
              onSubmit={onSubmit}
              onError={onError}
            />
            {isProcessing && (
              <div className="mt-2 text-center text-sm text-gray-500">
                Procesando pago...
              </div>
            )}
          </div>
        </div>
      )}
    </PaymentContainer>
  )
}

// Payment Brick Container - Uses CardPayment for tokenization, payment is processed in review step
export const MercadoPagoPaymentBrickContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled,
  cart,
  onCardDataReady,
  onPaymentError,
}: Omit<PaymentContainerProps, "children"> & {
  cart: HttpTypes.StoreCart | null
  onCardDataReady?: (cardData: any) => void
  onPaymentError?: (error: any) => void
}) => {
  const [isReady, setIsReady] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Store installment options when bin changes
  const [installmentOptions, setInstallmentOptions] = useState<any[]>([])

  // Reset when payment method changes
  useEffect(() => {
    if (selectedPaymentOptionId !== paymentProviderId) {
      setError(null)
      setIsReady(false)
      setInstallmentOptions([])
    }
  }, [selectedPaymentOptionId, paymentProviderId])

  // Calculate amount - MedusaJS stores prices in cents, MercadoPago expects pesos
  const amount = useMemo(() => {
    if (!cart?.total) return 0
    // Debug: log the raw total to understand the format

    // If total is already in pesos (e.g., 400), use it directly
    // If total is in cents (e.g., 40000), divide by 100
    // MedusaJS v2 typically stores in cents
    const totalInPesos = cart.total > 10000 ? cart.total / 100 : cart.total

    return totalInPesos
  }, [cart?.total])

  const initialization = useMemo(() => {

    return {
      amount,
      payer: {
        email: cart?.email || "",
      }
    }
  }, [amount, cart?.email])

  const customization = useMemo(() => ({
    visual: {
      style: {
        theme: "default" as const,
      },
      texts: {
        formSubmit: "Continuar",
      },
    },
    paymentMethods: {
      maxInstallments: 12,
      minInstallments: 1,
    },
  }), [])

  const onReady = useCallback(() => {
    setIsReady(true)
  }, [])

  const onSubmit = useCallback(async (formData: any) => {
    if (!cart?.id) {
      const err = new Error("No se encontró el carrito")
      if (onPaymentError) onPaymentError(err)
      return Promise.reject(err)
    }

    setIsProcessing(true)
    setError(null)

    try {


      const installments = formData.installments || 1
      const paymentMethodId = formData.payment_method_id
      const issuerId = formData.issuer_id

      // Default values
      let totalWithFinancing = amount
      let installmentAmount = amount / installments
      let financingCost = 0
      let paymentType = 'credit_card' // default, will be updated
      let availableInstallmentOptions: any[] = []

      // Fetch installment info from our API (this tells us card type too)
      if (paymentMethodId) {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
          const response = await fetch(`${backendUrl}/store/mercadopago-installments`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
            },
            body: JSON.stringify({
              payment_method_id: paymentMethodId,
              amount: amount,
              issuer_id: issuerId,
            }),
          })

          if (response.ok) {
            const data = await response.json()

            availableInstallmentOptions = data.installment_options || []

            // Determine if this is a debit card based on installment options
            // Debit cards typically only have 1 installment option
            if (availableInstallmentOptions.length === 1 && availableInstallmentOptions[0]?.installments === 1) {
              paymentType = 'debit_card'
            }

            // Find the selected installment option for financing info
            if (installments > 1) {
              const selectedOption = data.installment_options?.find(
                (opt: any) => opt.installments === installments
              )
              if (selectedOption) {
                totalWithFinancing = selectedOption.total_amount
                installmentAmount = selectedOption.installment_amount
                financingCost = selectedOption.financing_cost
              }
            }
          } else {
            console.warn("Failed to fetch installment costs, using fallback")
          }
        } catch (apiError) {
          console.warn("Error fetching installment costs:", apiError)
          // Continue with fallback calculation
        }
      }


      const cardData = {
        token: formData.token,
        payment_method_id: paymentMethodId,
        installments: installments,
        issuer_id: issuerId,
        payer: formData.payer,
        cart_id: cart.id,
        // Base transaction amount (original price without financing)
        transaction_amount: amount,
        // Store card info for display (masked)
        card_last_four: formData.token?.substring(formData.token.length - 4) || "****",
        // Use the payment type we determined from installment options
        // Or from formData if MercadoPago sent it directly
        payment_type_id: formData.payment_type_id || formData.payment_type || paymentType,
        total_financed_amount: totalWithFinancing,
        installment_amount: installmentAmount,
        financing_cost: financingCost,
      }

      // Log formData keys to help debug what MercadoPago sends



      if (onCardDataReady) {
        onCardDataReady(cardData)
      }

      return Promise.resolve()
    } catch (error: any) {
      console.error("Error en tokenización:", error)
      setError(error.message || "Error procesando los datos de la tarjeta")
      if (onPaymentError) {
        onPaymentError(error)
      }
      return Promise.reject(error)
    } finally {
      setIsProcessing(false)
    }
  }, [cart, onCardDataReady, onPaymentError, amount])

  const handleError = useCallback((error: any) => {
    // Log error details for debugging


    // Get error message
    const errorMessage = error?.message || error?.cause?.[0]?.description || ""

    // List of internal errors that should be ignored (not shown to user)
    const internalErrors = [
      "empty_installments",
      "The integration with Secure Fields failed",
      "Secure Fields",
      "cardNumber container not found",
      "expirationDate container not found",
      "securityCode container not found",
    ]

    // Check if this is an internal error that should be ignored
    const isInternalError = !errorMessage ||
      Object.keys(error || {}).length === 0 ||
      internalErrors.some(e => errorMessage.includes(e))

    if (isInternalError) {
      return
    }

    console.error("MercadoPago CardPayment error:", errorMessage)
    setError(errorMessage || "Error en el formulario de pago")
    if (onPaymentError) {
      onPaymentError(error)
    }
  }, [onPaymentError])

  // Handler for bin changes - captures installment options when card number is entered
  const handleBinChange = useCallback((binData: any) => {

    // MercadoPago returns installment options with the bin data
    // Each option has: installments, installment_amount, total_amount
    if (binData?.payerCosts || binData?.payer_costs) {
      const payerCosts = binData.payerCosts || binData.payer_costs
      setInstallmentOptions(payerCosts)
    }
  }, [])

  // Don't render the brick if amount is invalid
  const canShowBrick = amount > 0 && selectedPaymentOptionId === paymentProviderId

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >
      {selectedPaymentOptionId === paymentProviderId && (
        <div className="my-4 transition-all duration-150 ease-in-out">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <Text className="text-sm text-red-600">{error}</Text>
            </div>
          )}
          {!canShowBrick ? (
            <div className="text-center py-4">
              <Text className="text-sm text-gray-500">
                Cargando opciones de pago...
              </Text>
              <div className="mt-2 flex justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800" />
              </div>
            </div>
          ) : (
            <>
              {!isReady && <SkeletonCardDetails />}
              <div className={`payment-brick-wrapper w-full overflow-hidden ${!isReady ? "hidden" : ""}`}>
                <CardPayment
                  initialization={initialization}
                  customization={customization}
                  onReady={onReady}
                  onSubmit={onSubmit}
                  onError={handleError}
                  onBinChange={handleBinChange}
                />
                {isProcessing && (
                  <div className="mt-2 text-center text-sm text-gray-500">
                    Procesando pago...
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </PaymentContainer>
  )
}

// Mercado Crédito Container - Uses Credits Brick for "buy now, pay later" with Mercado Pago
export const MercadoCreditoContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  cart,
  onPaymentSuccess,
}: Omit<PaymentContainerProps, "children"> & {
  cart: HttpTypes.StoreCart | null
  onPaymentSuccess?: () => void
}) => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSelected = selectedPaymentOptionId === paymentProviderId

  // Create MercadoPago preference when this payment method is selected
  useEffect(() => {
    const createPreference = async () => {
      if (!isSelected || !cart?.id) {
        return
      }

      // Don't create a new preference if we already have one
      if (preferenceId) {
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
        const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        }

        if (publishableKey) {
          headers["x-publishable-api-key"] = publishableKey
        }

        const response = await fetch(`${backendUrl}/store/mercadopago-preference`, {
          method: "POST",
          headers,
          body: JSON.stringify({ cart_id: cart.id }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || "Error creating MercadoPago preference")
        }

        const data = await response.json()
        setPreferenceId(data.preference_id)
      } catch (err: any) {
        console.error('Error creating MercadoPago Credits preference:', err)
        setError(err.message || "Error al crear preferencia de Mercado Crédito")
      } finally {
        setIsLoading(false)
      }
    }

    createPreference()
  }, [isSelected, cart?.id, preferenceId])

  // Reset preference when payment method changes
  useEffect(() => {
    if (!isSelected) {
      setPreferenceId(null)
      setError(null)
    }
  }, [isSelected])

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >
      {isSelected && (
        <div className="my-4 transition-all duration-150 ease-in-out">
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Text className="text-sm font-semibold text-blue-800 mb-2">
              Compra en hasta 12 pagos sin tarjeta de crédito
            </Text>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
              <li>Conoce el límite disponible de tu Línea de Crédito y selecciona la cantidad de pagos.</li>
              <li>Confirma tu pago, se acredita al instante y está 100% protegido.</li>
              <li>Paga mes a mes desde la app de Mercado Pago con el medio que prefieras.</li>
            </ol>
          </div>

          {error ? (
            <div className="text-center py-4 border border-red-200 rounded-md bg-red-50">
              <Text className="text-sm text-red-600 mb-2">
                Error al configurar Mercado Crédito
              </Text>
              <Text className="text-xs text-red-500">
                {error}
              </Text>
            </div>
          ) : isLoading ? (
            <div className="text-center py-4">
              <Text className="text-sm text-ui-fg-subtle">
                Preparando opciones de pago...
              </Text>
              <div className="mt-2 flex justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ui-fg-base" />
              </div>
            </div>
          ) : preferenceId ? (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <Text className="text-sm text-gray-600 mb-3">
                Te llevaremos a Mercado Pago para completar tu compra
              </Text>
              <Text className="text-xs text-gray-500">
                Si aún no tienes la Línea de Crédito, actívala al momento de pagar.
              </Text>
              <div className="w-full mx-0 px-0 -translate-x-3 mt-3">
                <Wallet
                  initialization={{
                    preferenceId,
                    redirectMode: 'self'
                  }}
                  onReady={() => { }}
                  onError={(walletError) => {
                    console.error('Mercado Crédito Wallet error:', walletError)
                    setError("Error al cargar el botón de Mercado Crédito")
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Text className="text-sm text-ui-fg-subtle">
                Preparando opciones de pago...
              </Text>
              <div className="mt-2 flex justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ui-fg-base" />
              </div>
            </div>
          )}
        </div>
      )}
    </PaymentContainer>
  )
}
