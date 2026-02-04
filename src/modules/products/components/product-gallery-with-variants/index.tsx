"use client"

import { HttpTypes } from "@medusajs/types"
import ImageGallery from "@modules/products/components/image-gallery"
import { useState, useEffect, useRef } from "react"

type VariantImage = {
    id: string
    variant_id: string
    image_url: string
    image_key: string | null
    position: number
}

type ProductGalleryWithVariantsProps = {
    images: HttpTypes.StoreProductImage[]
    thumbnail?: string | null
    initialVariantId?: string
    initialVariantImages?: Array<{ id: string; url: string }>
}

/**
 * Client-side wrapper for ImageGallery that listens for variant changes
 * and fetches variant-specific images when available.
 *
 * Receives `initialVariantId` + `initialVariantImages` pre-fetched on the
 * server so the gallery renders with the correct variant images from the
 * very first paint — zero flicker, no lightbox-breaking wrapper divs.
 */
const ProductGalleryWithVariants = ({
    images: productImages,
    thumbnail,
    initialVariantId,
    initialVariantImages = [],
}: ProductGalleryWithVariantsProps) => {
    const [currentVariantId, setCurrentVariantId] = useState<string | undefined>(initialVariantId)
    const [variantImages, setVariantImages] = useState(initialVariantImages)
    const [isLoading, setIsLoading] = useState(false)

    // Skip the first client-side fetch — the server already resolved these images.
    // Only fetch on subsequent variant changes (user interaction).
    const skipInitialFetch = useRef(initialVariantImages.length > 0)

    // Listen for variant change events (from ProductActions user interaction)
    useEffect(() => {
        const handleVariantChange = (event: CustomEvent<{ variantId: string | undefined }>) => {
            const newVariantId = event.detail.variantId

            // ProductActions dispatches `undefined` before its auto-select effect
            // runs (options start as {} → selectedVariant is undefined on first render).
            // Ignore that spurious dispatch when we already have server-resolved images.
            if (newVariantId === undefined && initialVariantId) return

            setCurrentVariantId(newVariantId)
        }

        window.addEventListener("variant-change", handleVariantChange as EventListener)
        return () => {
            window.removeEventListener("variant-change", handleVariantChange as EventListener)
        }
    }, [initialVariantId])

    // Fetch variant images only on variant change (user interaction).
    // On mount, server-fetched images are already in state — no re-fetch needed.
    useEffect(() => {
        if (skipInitialFetch.current) {
            skipInitialFetch.current = false
            return
        }

        const fetchVariantImages = async () => {
            if (!currentVariantId) {
                setVariantImages([])
                return
            }

            setIsLoading(true)
            try {
                const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || ""
                const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

                const response = await fetch(`${backendUrl}/store/variant-images/${currentVariantId}`, {
                    headers: {
                        "x-publishable-api-key": publishableKey,
                    },
                })

                if (response.ok) {
                    const data = await response.json()
                    const images = data.images || []
                    setVariantImages(images.map((img: VariantImage) => ({ id: img.id, url: img.image_url })))
                } else {
                    setVariantImages([])
                }
            } catch (error) {
                console.error("Failed to fetch variant images:", error)
                setVariantImages([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchVariantImages()
    }, [currentVariantId])

    // Use variant images if available, otherwise use product images
    const displayImages = variantImages.length > 0
        ? variantImages as unknown as HttpTypes.StoreProductImage[]
        : productImages

    return (
        <ImageGallery
            key={currentVariantId || "default"}
            images={displayImages}
            thumbnail={variantImages.length > 0 ? undefined : thumbnail}
        />
    )
}

export default ProductGalleryWithVariants
