import { cache } from "react"
import { BannerResponse } from "../../types/global"
import { getBaseURL } from "./env"

const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

function processBannerImageUrl(imageUrl: string | null): string | null {
    if (!imageUrl) return null
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl
    }
    const baseUrl = getBaseURL().replace(/\/$/, '')
    const cleanImageUrl = imageUrl.replace(/^\//, '')
    return `${baseUrl}/${cleanImageUrl}`
}

export async function fetchBanners(): Promise<BannerResponse> {
    const baseURL = getBaseURL()

    try {
        const response = await fetch(`${baseURL}/store/banner`, {
            headers: {
                "x-publishable-api-key": PUBLISHABLE_API_KEY!,
                "Content-Type": "application/json",
            },
            next: {
                revalidate: 86400, // Cache for 24 hours
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch banners: ${response.status}`)
        }

        const data = await response.json()

        // Procesa las URLs de las imágenes de los banners
        if (data?.banners) {
            data.banners = data.banners.map((banner: any) => ({
                ...banner,
                image_url: processBannerImageUrl(banner.image_url)
            }))
        }

        return data
    } catch (error) {
        console.error("Error fetching banners:", error)
        throw error
    }
}

export const fetchBannerSections = cache(async () => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
        const response = await fetch(`${baseUrl}/store/banners/sections`, {
            headers: {
                "x-publishable-api-key": PUBLISHABLE_API_KEY || "",
            },
            next: { revalidate: 86400 },
        })

        if (response.ok) {
            return await response.json()
        }
    } catch (error) {
        console.error("Error fetching banner sections:", error)
    }
    return {}
})