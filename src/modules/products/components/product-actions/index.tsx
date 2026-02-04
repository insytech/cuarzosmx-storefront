"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

type VariantImage = {
  id: string
  variant_id: string
  image_url: string
  position: number
}

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
  cart?: HttpTypes.StoreCart | null
  onVariantChange?: (variantId: string | undefined) => void
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
  cart,
  onVariantChange,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const countryCode = useParams().countryCode as string

  // Stock error message when live check fails at add-to-cart
  const [stockError, setStockError] = useState<string | null>(null)

  // Variant images for thumbnails: variantId -> first image URL
  const [variantThumbnails, setVariantThumbnails] = useState<Record<string, string>>({})

  // Fetch variant images for thumbnails in option selector
  const fetchVariantThumbnails = useCallback(async () => {
    if (!product.variants?.length || product.variants.length <= 1) return

    const thumbnailMap: Record<string, string> = {}

    await Promise.all(
      product.variants.map(async (variant) => {
        if (!variant.id) return
        try {
          const res = await fetch(
            `${BACKEND_URL}/store/variant-images/${variant.id}`,
            {
              headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
              cache: "force-cache",
            }
          )
          if (!res.ok) return
          const data = await res.json()
          const images = data.images as VariantImage[] | undefined
          if (images?.length) {
            // Sort by position and get first image
            const sorted = [...images].sort((a, b) => a.position - b.position)
            thumbnailMap[variant.id] = sorted[0].image_url
          }
        } catch {
          // Silently fail for individual variants
        }
      })
    )

    setVariantThumbnails(thumbnailMap)
  }, [product.variants])

  useEffect(() => { fetchVariantThumbnails() }, [fetchVariantThumbnails])

  // Auto-select first available variant (preferring in-stock variants)
  // This improves UX by showing a valid state immediately instead of "Agotado"
  useEffect(() => {
    if (!product.variants?.length) return

    // If only 1 variant, select it directly
    if (product.variants.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
      return
    }

    // For multiple variants: prefer first in-stock variant, fallback to first variant
    const firstInStock = product.variants.find((v) => {
      // Check if variant has stock (or allows backorder/no inventory management)
      if (!v.manage_inventory || v.allow_backorder) return true
      return (v.inventory_quantity ?? 0) > 0
    })

    const variantToSelect = firstInStock || product.variants[0]
    const variantOptions = optionsAsKeymap(variantToSelect.options)
    setOptions(variantOptions ?? {})
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // Notify parent and gallery when variant changes
  useEffect(() => {
    onVariantChange?.(selectedVariant?.id)
    // Also dispatch a custom event for the gallery component
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("variant-change", {
          detail: { variantId: selectedVariant?.id }
        })
      )
    }
  }, [selectedVariant?.id, onVariantChange])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // Create a map of option value -> thumbnail URL for each option
  // This allows OptionSelect to show variant images as thumbnails
  const getOptionThumbnails = useCallback((optionId: string): Record<string, string | null> => {
    const thumbnails: Record<string, string | null> = {}

    if (!product.variants?.length) return thumbnails

    for (const variant of product.variants) {
      const variantOpts = variant.options || []
      // Find the option value for this optionId in this variant
      const optionValue = variantOpts.find((opt: any) => opt.option_id === optionId)?.value
      if (optionValue && variant.id) {
        // Only set if we haven't already or if we have a thumbnail
        if (!thumbnails[optionValue] && variantThumbnails[variant.id]) {
          thumbnails[optionValue] = variantThumbnails[variant.id]
        }
      }
    }

    return thumbnails
  }, [product.variants, variantThumbnails])

  // Create a map of option value -> discount percentage for sale variants
  // Uses existing calculated_price data — no extra fetch needed
  const getOptionSaleDiscounts = useCallback((optionId: string): Record<string, string> => {
    const discounts: Record<string, string> = {}

    if (!product.variants?.length) return discounts

    for (const variant of product.variants) {
      const cp = (variant as any).calculated_price
      if (!cp) continue

      const original = cp.original_amount
      const calculated = cp.calculated_amount
      if (!original || !calculated || calculated >= original) continue

      const pct = Math.round(((original - calculated) / original) * 100)
      if (pct <= 0) continue

      const optionValue = (variant.options || []).find(
        (opt: any) => opt.option_id === optionId
      )?.value
      if (optionValue && !discounts[optionValue]) {
        discounts[optionValue] = String(pct)
      }
    }

    return discounts
  }, [product.variants])

  // Calculate how many of this variant are already in the cart
  const quantityInCart = useMemo(() => {
    if (!cart || !cart.items || !selectedVariant) return 0
    const existingItem = cart.items.find(
      (item) => item.variant_id === selectedVariant.id
    )
    return existingItem?.quantity || 0
  }, [cart, selectedVariant])

  // Determine if we can add unlimited quantity (backorders allowed or no inventory management)
  const canAddUnlimited = useMemo(() => {
    if (!selectedVariant) return false
    // No inventory management = unlimited
    if (!selectedVariant.manage_inventory) return true
    // Backorders allowed = unlimited
    if (selectedVariant.allow_backorder) return true
    return false
  }, [selectedVariant])

  // Calculate max quantity user can select (accounting for items already in cart)
  // Uses ISR data (kept fresh by on-demand revalidation when inventory changes)
  const maxQuantity = useMemo(() => {
    if (canAddUnlimited) return Infinity
    const inventoryAvailable = selectedVariant?.inventory_quantity || 0
    const trueAvailable = Math.max(0, inventoryAvailable - quantityInCart)
    return trueAvailable
  }, [selectedVariant, canAddUnlimited, quantityInCart])


  // Check if at least 1 item can be added (accounts for cart items)
  const inStock = useMemo(() => {
    if (!selectedVariant) return false
    // If unlimited (no inventory management or backorders allowed), always in stock
    if (canAddUnlimited) return true
    // Otherwise, check if there's at least 1 available (after accounting for cart)
    return maxQuantity > 0
  }, [selectedVariant, canAddUnlimited, maxQuantity])


  // Reset quantity when variant changes or when quantity exceeds max
  useEffect(() => {
    if (maxQuantity !== Infinity && quantity > maxQuantity) {
      setQuantity(Math.max(1, maxQuantity))
    }
  }, [maxQuantity, quantity])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  // Track if related products section is visible
  const [relatedInView, setRelatedInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setRelatedInView(entry.isIntersecting)
      },
      { threshold: 0.1, rootMargin: '0px 0px 50px 0px' }
    )

    const relatedSection = document.querySelector('[data-testid="related-products-container"]')
    const footer = document.querySelector('footer')

    if (relatedSection) observer.observe(relatedSection)
    if (footer) observer.observe(footer)

    return () => observer.disconnect()
  }, [])

  // Increment quantity (respecting max)
  const incrementQuantity = () => {
    if (canAddUnlimited || quantity < maxQuantity) {
      setQuantity(quantity + 1)
    }
  }

  // Decrement quantity
  const decrementQuantity = () => {
    setQuantity(Math.max(1, quantity - 1))
  }

  // Clear stock error when variant changes
  useEffect(() => { setStockError(null) }, [selectedVariant?.id])

  // add the selected variant to the cart (with live inventory check)
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)
    setStockError(null)

    try {
      // Live inventory check: verify stock before adding to cart
      // This is the only moment we hit the backend — not on every page view
      if (selectedVariant.manage_inventory && !selectedVariant.allow_backorder) {
        const url = new URL(`${BACKEND_URL}/store/products/${product.id}`)
        url.searchParams.set("fields", "+variants.inventory_quantity")
        const res = await fetch(url.toString(), {
          headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
          cache: "no-store",
        })
        if (res.ok) {
          const data = await res.json()
          const liveVariant = (data.product?.variants || []).find(
            (v: any) => v.id === selectedVariant.id
          )
          const liveQty = liveVariant?.inventory_quantity ?? 0
          const availableAfterCart = liveQty - quantityInCart

          if (availableAfterCart < quantity) {
            setStockError(
              availableAfterCart <= 0
                ? "Este producto se acaba de agotar"
                : `Solo quedan ${availableAfterCart} disponible${availableAfterCart > 1 ? "s" : ""}`
            )
            setIsAdding(false)
            return
          }
        }
        // If fetch fails, proceed anyway — Medusa validates at checkout
      }

      const variantImage = variantThumbnails[selectedVariant.id]

      await addToCart({
        variantId: selectedVariant.id,
        quantity: quantity,
        countryCode,
        ...(variantImage ? { metadata: { variant_image: variantImage } } : {}),
      })
    } catch {
      // Medusa will reject if truly out of stock
    } finally {
      setIsAdding(false)
    }
  }

  // Determine what to show for stock status
  const getStockStatusText = () => {
    if (!selectedVariant) return null
    if (!inStock) {
      if (quantityInCart > 0) {
        return `Ya tienes ${quantityInCart} en el carrito (máximo alcanzado)`
      }
      return "Agotado"
    }
    if (canAddUnlimited) return "Disponible - Bajo pedido"
    // Use maxQuantity which already accounts for cart items
    if (maxQuantity <= 5) {
      const suffix = quantityInCart > 0 ? ` (${quantityInCart} en carrito)` : ""
      return `${maxQuantity} disponible${maxQuantity > 1 ? "s" : ""}${suffix}`
    }
    return "En stock - Disponible"
  }

  return (
    <>
      <div className="flex flex-col gap-6" ref={actionsRef}>
        {/* Price */}
        <ProductPrice product={product} variant={selectedVariant} />

        {/* Divider */}
        <div className="w-full h-px bg-gray-200" />

        {/* Options */}
        {(product.variants?.length ?? 0) > 1 && (
          <div className="flex flex-col gap-4">
            {(product.options || []).map((option) => (
              <div key={option.id}>
                <OptionSelect
                  option={option}
                  current={options[option.id]}
                  updateOption={setOptionValue}
                  title={option.title ?? ""}
                  data-testid="product-options"
                  disabled={!!disabled || isAdding}
                  variantThumbnails={getOptionThumbnails(option.id)}
                  variantSaleDiscounts={getOptionSaleDiscounts(option.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Cantidad</label>
            {/* Show max available when limited */}
            {selectedVariant && !canAddUnlimited && maxQuantity > 0 && (
              <span className="text-xs text-gray-500">
                Máx: {maxQuantity}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={decrementQuantity}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={quantity <= 1 || isAdding}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
            </button>
            <span className="w-12 text-center text-lg font-semibold text-gray-800">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isAdding || (!canAddUnlimited && quantity >= maxQuantity)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stock Status */}
        {selectedVariant && (
          <div className={`flex items-center gap-2 text-sm ${inStock ? 'text-green-600' : 'text-red-600'}`}>
            <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
            {getStockStatusText()}
          </div>
        )}

        {/* Stock error from live check at add-to-cart */}
        {stockError && (
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {stockError}
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          className="w-full h-14 bg-main-color hover:bg-main-color-dark text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
          data-testid="add-product-button"
        >
          {isAdding ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Agregando...
            </>
          ) : !selectedVariant ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Selecciona una opción
            </>
          ) : !inStock || !isValidVariant ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Agotado
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Agregar al carrito
            </>
          )}
        </button>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/524921277919?text=Hola! Me interesa el producto: ${product.title}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Consultar por WhatsApp
        </a>

        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView && !relatedInView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
