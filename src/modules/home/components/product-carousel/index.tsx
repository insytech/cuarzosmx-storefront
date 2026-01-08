import { Heading } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface ProductCarouselProps {
    title: string
    subtitle?: string
    products: HttpTypes.StoreProduct[]
    region: HttpTypes.StoreRegion
    viewAllLink?: string
}

export default function ProductCarousel({
    title,
    subtitle,
    products,
    region,
    viewAllLink
}: ProductCarouselProps) {
    if (!products || products.length === 0) {
        return null
    }

    // Determina el número de columnas según la cantidad de productos (mínimo 1, máximo 4)
    const columns = Math.max(1, Math.min(products.length, 4))
    const maxWidth = products.length === 1 ? "max-w-sm" : "max-w-7xl"

    return (
        <section className="w-full py-16 bg-light-gray">
            <div className={`${maxWidth} mx-auto px-6 md:px-12 lg:px-16`}>
                {/* Encabezado */}
                <div className="text-center mb-12">
                    <Heading level="h2" className="font-serenity text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                        {title}
                    </Heading>
                    <div className="flex justify-center">
                        <div className="h-1 w-16 bg-main-color rounded-full" />
                    </div>
                    <p className="text-gray-700 text-base md:text-lg mt-6 max-w-2xl mx-auto">
                        {subtitle || "Descubre nuestros productos más populares y esenciales espirituales"}
                    </p>
                </div>

                {/* Grid de productos - 2 columnas en móvil, hasta 4 en desktop */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {products.slice(0, 4).map((product) => (
                        <ProductPreview
                            key={product.id}
                            product={product}
                            region={region}
                            isFeatured={true}
                            showPrice
                        />
                    ))}
                </div>

                {/* Link Ver todos */}
                {viewAllLink && (
                    <div className="text-center mt-10">
                        <LocalizedClientLink
                            href={viewAllLink}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-main-color text-white font-medium rounded-full hover:bg-main-color-dark transition-colors"
                        >
                            Ver todos
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </LocalizedClientLink>
                    </div>
                )}
            </div>
        </section>
    )
}