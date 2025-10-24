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

    return (
        <section className="w-full py-12">
            <div className="section-container">
                <div className="text-center mb-8">
                    <Heading level="h2" className="text-3xl md:text-4xl font-bold">
                        {title}
                    </Heading>
                </div>

                <div className="relative">
                    <button className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-12">
                        {products.slice(0, 4).map((product) => (
                            <ProductPreview
                                key={product.id}
                                product={product}
                                region={region}
                                isFeatured={true}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}