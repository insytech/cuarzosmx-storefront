import { Banner, BannerResponse } from "../../../../types/global"
import { fetchBanners } from "@util/banner-api"
import BannerLink from "./banner-link"

export default async function HeroBlock() {
    let banners: Banner[] = []

    try {
        const response: BannerResponse = await fetchBanners()
        banners = response.banners
    } catch (err) {
        console.error("Error loading banners:", err)
    }

    const mainBanner = banners.find(b => b.position === 'main')
    const topLeftBanner = banners.find(b => b.position === 'top_left')
    const topRightBanner = banners.find(b => b.position === 'top_right')
    const bottomLeftBanner = banners.find(b => b.position === 'bottom_left')
    const bottomRightBanner = banners.find(b => b.position === 'bottom_right')

    if (banners.length === 0) {
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
                        width={800}
                        height={800}
                        fetchPriority="high"
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
                                width={400}
                                height={400}
                                loading="lazy"
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
                            src="/promo/promo-2.webp"
                            alt="Superior Izquierda"
                            width={400}
                            height={400}
                            loading="lazy"
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
                                width={400}
                                height={400}
                                loading="lazy"
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
                            src="/promo/promo-4.webp"
                            alt="Superior Derecha"
                            width={400}
                            height={400}
                            loading="lazy"
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
                                width={400}
                                height={400}
                                loading="lazy"
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
                            width={400}
                            height={400}
                            loading="lazy"
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
                                width={400}
                                height={400}
                                loading="lazy"
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
                            src="/promo/promo-5.webp"
                            alt="Inferior Derecha"
                            width={400}
                            height={400}
                            loading="lazy"
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                        />
                    )}
                </div>
            </div>
        </section>
    )
}
