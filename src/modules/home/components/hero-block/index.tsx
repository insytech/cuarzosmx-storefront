"use client"

import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useEffect, useState } from "react"
import { Banner, BannerResponse } from "../../../../types/global"
import { fetchBanners } from "@util/banner-api"

export default function HeroBlock() {
    const [banners, setBanners] = useState<Banner[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadBanners = async () => {
            try {
                const response: BannerResponse = await fetchBanners()
                setBanners(response.banners)
            } catch (err) {
                console.error("Error loading banners:", err)
                setError("Error loading banners")
            } finally {
                setLoading(false)
            }
        }

        loadBanners()
    }, [])

    const mainBanner = banners.find(b => b.position === 'main')
    const topLeftBanner = banners.find(b => b.position === 'top_left')
    const topRightBanner = banners.find(b => b.position === 'top_right')
    const bottomLeftBanner = banners.find(b => b.position === 'bottom_left')
    const bottomRightBanner = banners.find(b => b.position === 'bottom_right')

    if (loading) {
        return (
            <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                    <div className="col-span-2 row-span-2 aspect-square bg-gray-200 animate-pulse rounded-lg" />
                    <div className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
                    <div className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
                    <div className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
                    <div className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                    <div className="col-span-2 row-span-2 aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Error loading banners</p>
                    </div>
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 text-sm">Banner not available</p>
                    </div>
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 text-sm">Banner not available</p>
                    </div>
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 text-sm">Banner not available</p>
                    </div>
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 text-sm">Banner not available</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                {/* Banner Principal - ocupa 2x2 en el grid */}
                <LocalizedClientLink
                    href={mainBanner?.link_url || "/store"}
                    className="col-span-2 row-span-2 aspect-square flex items-center justify-center relative overflow-hidden rounded-lg group"
                >
                    <img
                        src={mainBanner?.image_url || "/promo/promo-1.webp"}
                        alt={mainBanner?.title || "Promo 1"}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-105"
                    />
                </LocalizedClientLink>

                {/* Superior Izquierda (posición 3) */}
                <div className="aspect-square flex items-center justify-center relative overflow-hidden rounded-lg group">
                    {topLeftBanner ? (
                        <LocalizedClientLink href={topLeftBanner.link_url || '#'} className="w-full h-full">
                            <img
                                src={topLeftBanner.image_url}
                                alt={topLeftBanner.title}
                                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                            />
                        </LocalizedClientLink>
                    ) : (
                        <img
                            src="/promo/promo-2.webp"
                            alt="Superior Izquierda"
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                        />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4 rounded-lg">
                        <Button className="bg-white text-main-color-dark px-4 py-2 rounded-large shadow-lg hover:bg-gray-100">
                            Comprar Ahora
                        </Button>
                    </div>
                </div>

                {/* Superior Derecha (posición 4) */}
                <div className="aspect-square flex items-center justify-center relative overflow-hidden rounded-lg group">
                    {topRightBanner ? (
                        <LocalizedClientLink href={topRightBanner.link_url || '#'} className="w-full h-full">
                            <img
                                src={topRightBanner.image_url}
                                alt={topRightBanner.title}
                                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                            />
                        </LocalizedClientLink>
                    ) : (
                        <img
                            src="/promo/promo-4.webp"
                            alt="Superior Derecha"
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                        />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4 rounded-lg">
                        <Button className="bg-white text-main-color-dark px-4 py-2 rounded-large shadow-lg hover:bg-gray-100">
                            Oferta Especial
                        </Button>
                    </div>
                </div>

                {/* Inferior Izquierda (posición 7) */}
                <div className="aspect-square flex items-center justify-center relative overflow-hidden rounded-lg group">
                    {bottomLeftBanner ? (
                        <LocalizedClientLink href={bottomLeftBanner.link_url || '#'} className="w-full h-full">
                            <img
                                src={bottomLeftBanner.image_url}
                                alt={bottomLeftBanner.title}
                                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                            />
                        </LocalizedClientLink>
                    ) : (
                        <img
                            src="/promo/promo-6.webp"
                            alt="Inferior Izquierda"
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                        />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4 rounded-lg">
                        <Button className="bg-white text-main-color-dark px-4 py-2 rounded-large shadow-lg hover:bg-gray-100">
                            Descubre Más
                        </Button>
                    </div>
                </div>

                {/* Inferior Derecha (posición 8) */}
                <div className="aspect-square flex items-center justify-center relative overflow-hidden rounded-lg group">
                    {bottomRightBanner ? (
                        <LocalizedClientLink href={bottomRightBanner.link_url || '#'} className="w-full h-full">
                            <img
                                src={bottomRightBanner.image_url}
                                alt={bottomRightBanner.title}
                                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                            />
                        </LocalizedClientLink>
                    ) : (
                        <img
                            src="/promo/promo-5.webp"
                            alt="Inferior Derecha"
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                        />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4 rounded-lg">
                        <Button className="bg-white text-main-color-dark px-4 py-2 rounded-large shadow-lg hover:bg-gray-100">
                            Ver Detalles
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}