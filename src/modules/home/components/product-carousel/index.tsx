import { Heading } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"

interface ProductCarouselProps {
    title: string
    products: HttpTypes.StoreProduct[]
    region: HttpTypes.StoreRegion
}

export default function ProductCarousel({ title, products, region }: ProductCarouselProps) {
    if (!products || products.length === 0) {
        return null
    }

    // Determina el número de columnas según la cantidad de productos (mínimo 1, máximo 4)
    const columns = Math.max(1, Math.min(products.length, 4))
    const maxWidth = products.length === 1 ? "max-w-sm" : "max-w-7xl"

    return (
        <section className="w-full py-16 bg-light-gray">
            <div className={`${maxWidth} mx-auto px-4`}>
                {/* Encabezado */}
                <div className="text-center mb-12">
                    <Heading level="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-main-color-dark mb-4">
                        {title}
                    </Heading>
                    <div className="flex justify-center">
                        <div className="h-1 w-16 bg-main-color rounded-full" />
                    </div>
                    <p className="text-main-color-dark text-base md:text-lg mt-6 max-w-2xl mx-auto">
                        Descubre nuestros productos más populares y esenciales espirituales
                    </p>
                </div>

                {/* Grid de productos */}
                <div
                    className="grid gap-8"
                    style={{
                        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                        justifyItems: products.length === 1 ? "center" : undefined,
                    }}
                >
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
            </div>
        </section>
    )
}