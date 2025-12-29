"use client"

import { useState, useEffect, useCallback } from "react"

type VariantImage = {
    id: string
    variant_id: string
    image_url: string
    image_key: string | null
    position: number
}

type UseVariantImagesReturn = {
    images: VariantImage[]
    isLoading: boolean
    error: string | null
    fetchImages: (variantId: string) => Promise<void>
}

export function useVariantImages(backendUrl?: string): UseVariantImagesReturn {
    const [images, setImages] = useState<VariantImage[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchImages = useCallback(async (variantId: string) => {
        if (!variantId) {
            setImages([])
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const baseUrl = backendUrl || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || ""
            const response = await fetch(`${baseUrl}/store/variant-images/${variantId}`)

            if (!response.ok) {
                throw new Error("Failed to fetch variant images")
            }

            const data = await response.json()
            setImages(data.images || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error")
            setImages([])
        } finally {
            setIsLoading(false)
        }
    }, [backendUrl])

    return { images, isLoading, error, fetchImages }
}

export default useVariantImages
