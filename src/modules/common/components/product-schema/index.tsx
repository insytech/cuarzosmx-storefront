import { HttpTypes } from "@medusajs/types"

interface ProductSchemaProps {
    product: HttpTypes.StoreProduct
    url: string
}

const ProductSchema = ({ product, url }: ProductSchemaProps) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cuarzosmx.com"

    // Obtener precio del producto
    const variant = product.variants?.[0]
    const price = variant?.calculated_price?.calculated_amount
    const currencyCode = variant?.calculated_price?.currency_code || "MXN"

    // Determinar disponibilidad
    const inStock = product.variants?.some(
        (v) => !v.manage_inventory || (v.inventory_quantity && v.inventory_quantity > 0)
    )

    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.description || `${product.title} - Cristales y joyería artesanal de alta calidad en CuarzosMX`,
        image: product.images?.map((img) => img.url) || [product.thumbnail],
        url: `${siteUrl}${url}`,
        sku: variant?.sku || product.id,
        brand: {
            "@type": "Brand",
            name: "CuarzosMX",
        },
        offers: {
            "@type": "Offer",
            url: `${siteUrl}${url}`,
            priceCurrency: currencyCode.toUpperCase(),
            price: price ? (price / 100).toFixed(2) : undefined,
            availability: inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            seller: {
                "@type": "Organization",
                name: "CuarzosMX",
            },
            shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingDestination: {
                    "@type": "DefinedRegion",
                    addressCountry: "MX",
                },
            },
        },
        category: product.categories?.[0]?.name || "Cristales y Cuarzos",
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}

export default ProductSchema
