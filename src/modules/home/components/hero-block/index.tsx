"use client"

import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useEffect, useState } from "react"
import { Banner, BannerResponse } from "../../../../types/global"
import { fetchBanners } from "@util/banner-api"

// Dominios internos de la aplicación
const INTERNAL_DOMAINS = [
    'localhost',
    'cuarzosmx.com',
    'www.cuarzosmx.com',
    'cuarzos.mx',
    'www.cuarzos.mx'
]

// Función para procesar la URL del banner
const processUrl = (url: string): { href: string; isExternal: boolean } => {
    if (!url || url === '#') {
        return { href: '/store', isExternal: false }
    }

    // Si es ruta relativa (empieza con /), es interna
    if (url.startsWith('/')) {
        return { href: url, isExternal: false }
    }

    try {
        const urlObj = new URL(url)
        const hostname = urlObj.hostname.toLowerCase()

        // Verificar si es un dominio interno
        const isInternalDomain = INTERNAL_DOMAINS.some(domain => 
            hostname === domain || hostname.endsWith(`.${domain}`)
        )

        if (isInternalDomain) {
            // Extraer solo el pathname (sin el prefijo de país como /mx)
            let path = urlObj.pathname

            // Remover prefijo de país si existe (/mx, /us, etc.)
            const countryPrefixMatch = path.match(/^\/[a-z]{2}(\/.*)?$/)
            if (countryPrefixMatch) {
                path = countryPrefixMatch[1] || '/'
            }

            return { href: path || '/', isExternal: false }
        }

        // Es URL externa
        return { href: url, isExternal: true }
    } catch {
        // Si no se puede parsear como URL, tratarla como ruta relativa
        return { href: url.startsWith('/') ? url : `/${url}`, isExternal: false }
    }
}

// Componente helper para manejar links internos y externos
const BannerLink = ({ 
    href, 
    children, 
    className 
}: { 
    href: string
    children: React.ReactNode
    className?: string 
}) => {
    const { href: processedHref, isExternal } = processUrl(href)

    // Si es URL externa, usa <a> con target="_blank"
    if (isExternal) {
        return (
            <a 
                href={processedHref} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={className}
            >
                {children}
            </a>
        )
    }
    
    // Si es ruta interna, usa LocalizedClientLink
    return (
        <LocalizedClientLink href={processedHref} className={className}>
            {children}
        </LocalizedClientLink>
    )
}

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
                <BannerLink
                    href={mainBanner?.link_url || "/store"}
                    className="col-span-2 row-span-2 aspect-square flex items-center justify-center relative overflow-hidden rounded-lg group"
                >
                    <img
                        src={mainBanner?.image_url || "/promo/promo-1.webp"}
                        alt={mainBanner?.title || "Promo 1"}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-105"
                    />
                </BannerLink>

                {/* Superior Izquierda (posición 3) */}
                <div className="aspect-square flex items-center justify-center relative overflow-hidden rounded-lg group">
                    {topLeftBanner ? (
                        <BannerLink href={topLeftBanner.link_url || '/store'} className="w-full h-full block">
                            <img
                                src={topLeftBanner.image_url}
                                alt={topLeftBanner.title}
                                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4 rounded-lg">
                                <span className="bg-white text-main-color-dark px-4 py-2 rounded-large shadow-lg hover:bg-gray-100 font-medium text-sm">
                                    Comprar Ahora
                                </span>
                            </div>
                        </BannerLink>
                    ) : (
                        <img
                            src="/promo/promo-2.webp"
                            alt="Superior Izquierda"
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                        />
                    )}
                </div>

                {/* Superior Derecha (posición 4) */}
                <div className="aspect-square flex items-center justify-center relative overflow-hidden rounded-lg group">
                    {topRightBanner ? (
                        <BannerLink href={topRightBanner.link_url || '/store'} className="w-full h-full block">
                            <img
                                src={topRightBanner.image_url}
                                alt={topRightBanner.title}
                                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4 rounded-lg">
                                <span className="bg-white text-main-color-dark px-4 py-2 rounded-large shadow-lg hover:bg-gray-100 font-medium text-sm">
                                    Oferta Especial
                                </span>
                            </div>
                        </BannerLink>
                    ) : (
                        <img
                            src="/promo/promo-4.webp"
                            alt="Superior Derecha"
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                        />
                    )}
                </div>

                {/* Inferior Izquierda (posición 7) */}
                <div className="aspect-square flex items-center justify-center relative overflow-hidden rounded-lg group">
                    {bottomLeftBanner ? (
                        <BannerLink href={bottomLeftBanner.link_url || '/store'} className="w-full h-full block">
                            <img
                                src={bottomLeftBanner.image_url}
                                alt={bottomLeftBanner.title}
                                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4 rounded-lg">
                                <span className="bg-white text-main-color-dark px-4 py-2 rounded-large shadow-lg hover:bg-gray-100 font-medium text-sm">
                                    Descubre Más
                                </span>
                            </div>
                        </BannerLink>
                    ) : (
                        <img
                            src="/promo/promo-6.webp"
                            alt="Inferior Izquierda"
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                        />
                    )}
                </div>

                {/* Inferior Derecha (posición 8) */}
                <div className="aspect-square flex items-center justify-center relative overflow-hidden rounded-lg group">
                    {bottomRightBanner ? (
                        <BannerLink href={bottomRightBanner.link_url || '/store'} className="w-full h-full block">
                            <img
                                src={bottomRightBanner.image_url}
                                alt={bottomRightBanner.title}
                                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4 rounded-lg">
                                <span className="bg-white text-main-color-dark px-4 py-2 rounded-large shadow-lg hover:bg-gray-100 font-medium text-sm">
                                    Ver Detalles
                                </span>
                            </div>
                        </BannerLink>
                    ) : (
                        <img
                            src="/promo/promo-5.webp"
                            alt="Inferior Derecha"
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                        />
                    )}
                </div>
            </div>
        </section>
    )
}