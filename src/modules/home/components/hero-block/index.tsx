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
    const rightBanners = banners.filter(b => b.position.startsWith('right_'))

    if (loading) {
        return (
            <section className="w-full min-h-[600px] lg:min-h-[800px] flex flex-col lg:flex-row px-32 gap-2">
                <div className="w-full lg:w-1/2 aspect-square bg-gray-200 animate-pulse rounded-lg" />
                <div className="w-full lg:w-1/4 min-h-[180px] flex flex-col gap-2">
                    <div className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
                    <div className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
                </div>
                <div className="w-full lg:w-1/4 min-h-[180px] flex flex-col gap-2">
                    <div className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
                    <div className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="w-full min-h-[600px] lg:min-h-[800px] flex flex-col lg:flex-row px-32 gap-2">
                <div className="w-full lg:w-1/2 aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Error loading banners</p>
                </div>
                <div className="w-full lg:w-1/4 min-h-[180px] flex flex-col gap-2">
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 text-sm">Banner not available</p>
                    </div>
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 text-sm">Banner not available</p>
                    </div>
                </div>
                <div className="w-full lg:w-1/4 min-h-[180px] flex flex-col gap-2">
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
        <section className="w-full min-h-[600px] lg:min-h-[800px] flex flex-col lg:flex-row px-32 gap-2">
            {/* Columna Izquierda: 50% en desktop, 100% en móvil */}
            <LocalizedClientLink
                href={mainBanner?.link_url || "/store"}
                className="w-full lg:w-1/2 aspect-square flex items-center justify-center relative"
            >
                <img
                    src={mainBanner?.image_url || "/promo/promo-1.webp"}
                    alt={mainBanner?.title || "Promo 1"}
                    className="w-full h-full object-cover rounded-lg transition-all duration-500 hover:shadow-2xl hover:brightness-105"
                />
            </LocalizedClientLink>

            {/* Columna Central: 25% en desktop, 100% en móvil */}
            <div className="w-full lg:w-1/4 min-h-[180px] flex flex-col gap-2">
                {/* Sección superior */}
                <div className="aspect-square flex items-center justify-center relative">
                    {(() => {
                        const banner = rightBanners.find(b => b.position === 'right_1')
                        return banner ? (
                            <LocalizedClientLink href={banner.link_url || '#'} className="w-full h-full">
                                <img
                                    src={banner.image_url}
                                    alt={banner.title}
                                    className="w-full h-full object-cover rounded-lg transition-all duration-300 hover:scale-102 hover:shadow-lg hover:brightness-110"
                                />
                            </LocalizedClientLink>
                        ) : (
                            <img
                                src="/promo/promo-2.webp"
                                alt="Promo 2"
                                className="w-full h-full object-cover rounded-lg transition-all duration-300 hover:scale-102 hover:shadow-lg hover:brightness-110"
                            />
                        )
                    })()}
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4 rounded-lg">
                        <Button className="bg-white text-main-color-dark px-4 py-2 rounded-large shadow-lg hover:bg-gray-100">
                            Comprar Ahora
                        </Button>
                    </div>
                </div>
                {/* Sección inferior */}
                <div className="aspect-square flex items-center justify-center relative">
                    {(() => {
                        const banner = rightBanners.find(b => b.position === 'right_3')
                        return banner ? (
                            <LocalizedClientLink href={banner.link_url || '#'} className="w-full h-full">
                                <img
                                    src={banner.image_url}
                                    alt={banner.title}
                                    className="w-full h-full object-cover rounded-lg transition-all duration-300 hover:scale-102 hover:shadow-lg hover:brightness-110"
                                />
                            </LocalizedClientLink>
                        ) : (
                            <img
                                src="/promo/promo-6.webp"
                                alt="Promo 3"
                                className="w-full h-full object-cover rounded-lg transition-all duration-300 hover:scale-102 hover:shadow-lg hover:brightness-110"
                            />
                        )
                    })()}
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4 rounded-lg">
                        <Button className="bg-white text-main-color-dark px-4 py-2 rounded-large shadow-lg hover:bg-gray-100">
                            Descubre Más
                        </Button>
                    </div>
                </div>
            </div>

            {/* Columna Derecha: 25% en desktop, 100% en móvil */}
            <div className="w-full lg:w-1/4 min-h-[180px] flex flex-col gap-2">
                {/* Sección superior */}
                <div className="aspect-square flex items-center justify-center relative">
                    {(() => {
                        const banner = rightBanners.find(b => b.position === 'right_2')
                        return banner ? (
                            <LocalizedClientLink href={banner.link_url || '#'} className="w-full h-full">
                                <img
                                    src={banner.image_url}
                                    alt={banner.title}
                                    className="w-full h-full object-cover rounded-lg transition-all duration-300 hover:scale-102 hover:shadow-lg hover:brightness-110"
                                />
                            </LocalizedClientLink>
                        ) : (
                            <img
                                src="/promo/promo-4.webp"
                                alt="Promo 4"
                                className="w-full h-full object-cover rounded-lg transition-all duration-300 hover:scale-102 hover:shadow-lg hover:brightness-110"
                            />
                        )
                    })()}
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4 rounded-lg">
                        <Button className="bg-white text-main-color-dark px-4 py-2 rounded-large shadow-lg hover:bg-gray-100">
                            Oferta Especial
                        </Button>
                    </div>
                </div>
                {/* Sección inferior */}
                <div className="aspect-square flex items-center justify-center  relative">
                    {(() => {
                        const banner = rightBanners.find(b => b.position === 'right_4')
                        return banner ? (
                            <LocalizedClientLink href={banner.link_url || '#'} className="w-full h-full">
                                <img
                                    src={banner.image_url}
                                    alt={banner.title}
                                    className="w-full h-full object-cover rounded-lg transition-all duration-300 hover:scale-102 hover:shadow-lg hover:brightness-110"
                                />
                            </LocalizedClientLink>
                        ) : (
                            <img
                                src="/promo/promo-5.webp"
                                alt="Promo 5"
                                className="w-full h-full object-cover rounded-lg transition-all duration-300 hover:scale-102 hover:shadow-lg hover:brightness-110"
                            />
                        )
                    })()}
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