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
                revalidate: 300, // Cache for 5 minutes
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