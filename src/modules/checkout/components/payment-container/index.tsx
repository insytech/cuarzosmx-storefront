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
  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <RadioGroupOption
      key={paymentProviderId}
      value={paymentProviderId}
      disabled={disabled}
      className={clx(
        "flex flex-col gap-y-2 text-small-regular cursor-pointer py-4 border rounded-lg px-6 mb-2 transition-all",
        {
          "border-main-color bg-main-color-light/20 shadow-sm":
            selectedPaymentOptionId === paymentProviderId,
          "border-gray-200 hover:border-main-color/50 hover:bg-gray-50":
            selectedPaymentOptionId !== paymentProviderId,
        }
      )}
    >
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-x-4">
          <Radio checked={selectedPaymentOptionId === paymentProviderId} />
          <Text className="text-base-regular text-gray-700">
            {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
          </Text>
          {isManual(paymentProviderId) && isDevelopment && (
            <PaymentTest className="hidden small:block" />
          )}
        </div>
        <span className="justify-self-end text-ui-fg-base">
          {paymentInfoMap[paymentProviderId]?.icon}
        </span>
      </div>
      {isManual(paymentProviderId) && isDevelopment && (
        <PaymentTest className="small:hidden text-[10px]" />
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
        console.log('MercadoPago preference created:', data)
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
            <div style={{ width: '300px', margin: '20px auto' }}>
              <Wallet
                initialization={{ preferenceId }}
                onReady={() => console.log('Mercado Pago Wallet is ready')}
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

      console.log("Pago exitoso:", result)
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

// Payment Brick Container - Includes all payment methods (cards, wallet, etc.)
export const MercadoPagoPaymentBrickContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled,
  cart,
  onPaymentSuccess,
  onPaymentError,
}: Omit<PaymentContainerProps, "children"> & {
  cart: HttpTypes.StoreCart | null
  onPaymentSuccess?: (paymentData: any) => void
  onPaymentError?: (error: any) => void
}) => {
  const [isReady, setIsReady] = useState(false)
  const [preferenceId, setPreferenceId] = useState<string | null>(null)
  const [isLoadingPreference, setIsLoadingPreference] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create preference for wallet payments
  useEffect(() => {
    const createPreference = async () => {
      if (selectedPaymentOptionId !== paymentProviderId || !cart?.id || preferenceId) {
        return
      }

      setIsLoadingPreference(true)
      setError(null)

      try {
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
        const response = await fetch(`${backendUrl}/store/mercadopago-preference`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
          body: JSON.stringify({ cart_id: cart.id }),
        })

        if (!response.ok) {
          throw new Error("Error al crear preferencia")
        }

        const data = await response.json()
        setPreferenceId(data.preference_id)
      } catch (err: any) {
        console.error("Error creating preference:", err)
        setError(err.message)
      } finally {
        setIsLoadingPreference(false)
      }
    }

    createPreference()
  }, [selectedPaymentOptionId, paymentProviderId, cart?.id, preferenceId])

  // Reset when payment method changes
  useEffect(() => {
    if (selectedPaymentOptionId !== paymentProviderId) {
      setPreferenceId(null)
      setError(null)
      setIsReady(false)
    }
  }, [selectedPaymentOptionId, paymentProviderId])

  const initialization = useMemo(() => {
    if (!cart || !preferenceId) return { amount: 0 }
    return {
      amount: cart.total ? cart.total / 100 : 0,
      preferenceId: preferenceId,
    }
  }, [cart, preferenceId])

  const customization = useMemo(() => ({
    paymentMethods: {
      creditCard: "all",
      debitCard: "all",
      mercadoPago: "all",
      maxInstallments: 12,
    },
    visual: {
      style: {
        theme: "default" as const,
      },
    },
  }), [])

  const onReady = useCallback(() => {
    setIsReady(true)
  }, [])

  const onSubmit = useCallback(async ({ selectedPaymentMethod, formData }: { selectedPaymentMethod: string, formData: any }) => {
    if (!cart?.id) {
      return Promise.reject(new Error("No cart"))
    }

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
          payment_method: selectedPaymentMethod,
          ...formData
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || result.error || "Error procesando el pago")
      }

      console.log("Pago exitoso:", result)
      
      if (onPaymentSuccess) {
        onPaymentSuccess(result)
      }

      return Promise.resolve()
    } catch (error: any) {
      console.error("Error en pago:", error)
      if (onPaymentError) {
        onPaymentError(error)
      }
      return Promise.reject(error)
    }
  }, [cart, onPaymentSuccess, onPaymentError])

  const handleError = useCallback((error: any) => {
    console.error("MercadoPago Payment Brick error:", error)
    setError(error?.message || "Error en el formulario de pago")
    if (onPaymentError) {
      onPaymentError(error)
    }
  }, [onPaymentError])

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
          {(isLoadingPreference || !preferenceId) && !error ? (
            <div className="text-center py-4">
              <Text className="text-sm text-gray-500">
                Preparando opciones de pago...
              </Text>
              <div className="mt-2 flex justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800" />
              </div>
            </div>
          ) : preferenceId && (
            <>
              {!isReady && <SkeletonCardDetails />}
              <div className={!isReady ? "hidden" : ""}>
                <MercadoPagoPayment
                  initialization={initialization}
                  customization={customization}
                  onReady={onReady}
                  onSubmit={onSubmit}
                  onError={handleError}
                />
              </div>
            </>
          )}
        </div>
      )}
    </PaymentContainer>
  )
}
