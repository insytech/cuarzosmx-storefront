"use client"

import { HttpTypes } from "@medusajs/types"
import ImageGallery from "@modules/products/components/image-gallery"
import { useState, useCallback, useEffect } from "react"

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
}

/**
 * Client-side wrapper for ImageGallery that listens for variant changes
 * and fetches variant-specific images when available.
 */
const ProductGalleryWithVariants = ({
    images: productImages,
    thumbnail
}: ProductGalleryWithVariantsProps) => {
    const [currentVariantId, setCurrentVariantId] = useState<string | undefined>()
    const [variantImages, setVariantImages] = useState<VariantImage[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Listen for variant change events
    useEffect(() => {
        const handleVariantChange = (event: CustomEvent<{ variantId: string | undefined }>) => {
            setCurrentVariantId(event.detail.variantId)
        }

        window.addEventListener("variant-change", handleVariantChange as EventListener)
        return () => {
            window.removeEventListener("variant-change", handleVariantChange as EventListener)
        }
    }, [])

    // Fetch variant images when variant changes
    useEffect(() => {
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
                    setVariantImages(data.images || [])
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
        ? variantImages.map(img => ({ id: img.id, url: img.image_url })) as HttpTypes.StoreProductImage[]
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
