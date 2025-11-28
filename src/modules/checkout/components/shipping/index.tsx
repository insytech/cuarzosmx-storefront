"use client"

import { RadioGroup, Radio } from "@headlessui/react"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { CheckCircleSolid, Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import Divider from "@modules/common/components/divider"
import MedusaRadio from "@modules/common/components/radio"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const PICKUP_OPTION_ON = "__PICKUP_ON"
const PICKUP_OPTION_OFF = "__PICKUP_OFF"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

function formatAddress(address: any) {
  if (!address) {
    return ""
  }

  let ret = ""

  if (address.address_1) {
    ret += ` ${address.address_1}`
  }

  if (address.address_2) {
    ret += `, ${address.address_2}`
  }

  if (address.postal_code) {
    ret += `, ${address.postal_code} ${address.city}`
  }

  if (address.country_code) {
    ret += `, ${address.country_code.toUpperCase()}`
  }

  return ret
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [mounted, setMounted] = useState(false)

  const [showPickupOptions, setShowPickupOptions] =
    useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const _shippingMethods = availableShippingMethods?.filter(
    (sm) => sm.service_zone?.fulfillment_set?.type !== "pickup"
  )

  const _pickupMethods = availableShippingMethods?.filter(
    (sm) => sm.service_zone?.fulfillment_set?.type === "pickup"
  )

  const hasPickupOptions = !!_pickupMethods?.length

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setIsLoadingPrices(true)

    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] === p.value?.amount!))

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      }
    }

    if (_pickupMethods?.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    }
  }, [availableShippingMethods])

  const handleEdit = () => {
    router.push(`${pathname}?step=delivery`, { scroll: false })
  }

  const handleSubmit = () => {
    router.push(`${pathname}?step=payment`, { scroll: false })
  }

  const handleSetShippingMethod = async (
    id: string,
    variant: "shipping" | "pickup"
  ) => {
    setError(null)

    if (variant === "pickup") {
      setShowPickupOptions(PICKUP_OPTION_ON)
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF)
    }

    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setShippingMethodId(currentId)

        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
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
                !isOpen && cart.shipping_methods?.length === 0,
            }
          )}
        >
          Envío
          {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
            <CheckCircleSolid className="text-main-color w-5 h-5" />
          )}
        </Heading>
        {!isOpen &&
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email && (
            <Text>
              <button
                onClick={handleEdit}
                className="text-main-color hover:text-main-color-dark font-medium text-sm"
                data-testid="edit-delivery-button"
              >
                Editar
              </button>
            </Text>
          )}
      </div>
      {isOpen ? (
        <>
          <div className="grid">
            <div className="flex flex-col">
              <span className="font-medium txt-medium text-gray-800">
                Método de envío
              </span>
              <span className="mb-4 text-gray-500 txt-medium">
                ¿Cómo deseas recibir tu pedido?
              </span>
            </div>
            {mounted && (
              <div data-testid="delivery-options-container">
                <div className="pb-8 md:pt-0 pt-2">
                  {hasPickupOptions && (
                    <RadioGroup
                      value={showPickupOptions}
                      onChange={(value) => {
                        const id = _pickupMethods.find(
                          (option) => !option.insufficient_inventory
                        )?.id

                        if (id) {
                          handleSetShippingMethod(id, "pickup")
                        }
                      }}
                    >
                      <Radio
                        value={PICKUP_OPTION_ON}
                        data-testid="delivery-option-radio"
                        className={clx(
                          "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-lg px-6 mb-2 transition-all",
                          {
                            "border-main-color bg-main-color-light/20 shadow-sm":
                              showPickupOptions === PICKUP_OPTION_ON,
                            "border-gray-200 hover:border-main-color/50 hover:bg-gray-50":
                              showPickupOptions !== PICKUP_OPTION_ON,
                          }
                        )}
                      >
                        <div className="flex items-center gap-x-4">
                          <MedusaRadio
                            checked={showPickupOptions === PICKUP_OPTION_ON}
                          />
                          <span className="text-base-regular text-gray-700">
                            Recoger mi pedido
                          </span>
                        </div>
                        <span className="justify-self-end text-gray-500">
                          -
                        </span>
                      </Radio>
                    </RadioGroup>
                  )}
                  <RadioGroup
                    value={shippingMethodId}
                    onChange={(v) => handleSetShippingMethod(v, "shipping")}
                  >
                    {_shippingMethods?.map((option) => {
                      const isDisabled =
                        option.price_type === "calculated" &&
                        !isLoadingPrices &&
                        typeof calculatedPricesMap[option.id] !== "number"

                      return (
                        <Radio
                          key={option.id}
                          value={option.id}
                          data-testid="delivery-option-radio"
                          disabled={isDisabled}
                          className={clx(
                            "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-lg px-6 mb-2 transition-all",
                            {
                              "border-main-color bg-main-color-light/20 shadow-sm":
                                option.id === shippingMethodId,
                              "border-gray-200 hover:border-main-color/50 hover:bg-gray-50":
                                option.id !== shippingMethodId && !isDisabled,
                              "opacity-50 cursor-not-allowed":
                                isDisabled,
                            }
                          )}
                        >
                          <div className="flex items-center gap-x-4">
                            <MedusaRadio
                              checked={option.id === shippingMethodId}
                            />
                            <span className="text-base-regular text-gray-700">
                              {option.name}
                            </span>
                          </div>
                          <span className="justify-self-end text-gray-600 font-medium">
                            {option.price_type === "flat" ? (
                              convertToLocale({
                                amount: option.amount!,
                                currency_code: cart?.currency_code,
                              })
                            ) : calculatedPricesMap[option.id] ? (
                              convertToLocale({
                                amount: calculatedPricesMap[option.id],
                                currency_code: cart?.currency_code,
                              })
                            ) : isLoadingPrices ? (
                              <Loader />
                            ) : (
                              "-"
                            )}
                          </span>
                        </Radio>
                      )
                    })}
                  </RadioGroup>
                </div>
              </div>
            )}
          </div>

          {showPickupOptions === PICKUP_OPTION_ON && mounted && (
            <div className="grid">
              <div className="flex flex-col">
                <span className="font-medium txt-medium text-gray-800">
                  Tienda
                </span>
                <span className="mb-4 text-gray-500 txt-medium">
                  Elige una tienda cerca de ti
                </span>
              </div>
              <div data-testid="delivery-options-container">
                <div className="pb-8 md:pt-0 pt-2">
                  <RadioGroup
                    value={shippingMethodId}
                    onChange={(v) => handleSetShippingMethod(v, "pickup")}
                  >
                    {_pickupMethods?.map((option) => {
                      return (
                        <Radio
                          key={option.id}
                          value={option.id}
                          disabled={option.insufficient_inventory}
                          data-testid="delivery-option-radio"
                          className={clx(
                            "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-lg px-6 mb-2 transition-all",
                            {
                              "border-main-color bg-main-color-light/20 shadow-sm":
                                option.id === shippingMethodId,
                              "border-gray-200 hover:border-main-color/50 hover:bg-gray-50":
                                option.id !== shippingMethodId && !option.insufficient_inventory,
                              "opacity-50 cursor-not-allowed":
                                option.insufficient_inventory,
                            }
                          )}
                        >
                          <div className="flex items-start gap-x-4">
                            <MedusaRadio
                              checked={option.id === shippingMethodId}
                            />
                            <div className="flex flex-col">
                              <span className="text-base-regular text-gray-700">
                                {option.name}
                              </span>
                              <span className="text-base-regular text-gray-500">
                                {formatAddress(
                                  option.service_zone?.fulfillment_set?.location
                                    ?.address
                                )}
                              </span>
                            </div>
                          </div>
                          <span className="justify-self-end text-gray-600 font-medium">
                            {convertToLocale({
                              amount: option.amount!,
                              currency_code: cart?.currency_code,
                            })}
                          </span>
                        </Radio>
                      )
                    })}
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          <div>
            <ErrorMessage
              error={error}
              data-testid="delivery-option-error-message"
            />
            <Button
              size="large"
              className="mt !bg-main-color hover:!bg-main-color-dark"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={!cart.shipping_methods?.[0]}
              data-testid="submit-delivery-option-button"
            >
              Continuar al pago
            </Button>
          </div>
        </>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-gray-800 mb-1 font-semibold">
                  Método
                </Text>
                <Text className="txt-medium text-ui-fg-subtle">
                  {cart.shipping_methods?.at(-1)?.name}{" "}
                  {convertToLocale({
                    amount: cart.shipping_methods.at(-1)?.amount!,
                    currency_code: cart?.currency_code,
                  })}
                </Text>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Shipping
