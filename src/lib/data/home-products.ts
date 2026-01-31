"use server"

import { HttpTypes } from "@medusajs/types"
import { listProducts } from "./products"
import { getCacheOptions } from "./cookies"

export type ProductSection = {
    products: HttpTypes.StoreProduct[]
    title: string
    subtitle: string
    viewAllLink?: string
}

const PRODUCT_FIELDS =
    "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags"

const BACKEND_URL =
    process.env.MEDUSA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    "http://localhost:9000"

const PUBLISHABLE_API_KEY =
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

/**
 * Fetch products by tag values using the custom backend endpoint.
 * Falls back to client-side filtering if the endpoint is unavailable.
 */
async function fetchProductsByTags(
    tagValues: string[],
    limit: number
): Promise<any[]> {
    try {
        const tags = tagValues.join(",")
        const next = {
            ...(await getCacheOptions("home-products")),
        }

        const response = await fetch(
            `${BACKEND_URL}/store/products-by-tags?tags=${encodeURIComponent(tags)}&limit=${limit}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-publishable-api-key": PUBLISHABLE_API_KEY,
                },
                next,
                cache: "force-cache",
            } as any
        )

        if (!response.ok) {
            console.warn(`products-by-tags returned ${response.status}, falling back`)
            return []
        }

        const data = await response.json()
        return data.products ?? []
    } catch (error) {
        console.warn("products-by-tags endpoint failed, falling back:", error)
        return []
    }
}

/**
 * Obtiene productos destacados (con tag "destacado" o "featured")
 */
export async function getFeaturedProducts(
    countryCode: string,
    limit = 4
): Promise<ProductSection> {
    let products = await fetchProductsByTags(["destacado", "featured"], limit)

    // Fallback: primeros productos
    if (products.length === 0) {
        const { response } = await listProducts({
            countryCode,
            queryParams: { limit, fields: PRODUCT_FIELDS },
        })
        products = response.products
    }

    return {
        products: products.slice(0, limit),
        title: "Productos Destacados",
        subtitle: "Nuestras piezas más especiales, seleccionadas cuidadosamente para ti",
        viewAllLink: "/store?filter=featured",
    }
}

/**
 * Obtiene los productos más nuevos (ordenados por fecha de creación)
 */
export async function getNewArrivals(
    countryCode: string,
    limit = 4
): Promise<ProductSection> {
    const { response } = await listProducts({
        countryCode,
        queryParams: {
            limit,
            order: "-created_at",
            fields: PRODUCT_FIELDS,
        },
    })

    return {
        products: response.products,
        title: "Nuevos Ingresos",
        subtitle: "Las últimas adiciones a nuestra colección de cristales",
        viewAllLink: "/store?sortBy=created_at",
    }
}

/**
 * Obtiene los productos más vendidos (con tag "bestseller")
 */
export async function getBestSellers(
    countryCode: string,
    limit = 4
): Promise<ProductSection> {
    let products = await fetchProductsByTags(
        ["bestseller", "más vendido", "popular"],
        limit
    )

    // Fallback: productos más recientes
    if (products.length === 0) {
        const { response } = await listProducts({
            countryCode,
            queryParams: {
                limit,
                order: "-created_at",
                fields: PRODUCT_FIELDS,
            },
        })
        products = response.products
    }

    return {
        products: products.slice(0, limit),
        title: "Más Vendidos",
        subtitle: "Los favoritos de nuestra comunidad cristalera",
        viewAllLink: "/store?filter=bestseller",
    }
}

/**
 * Obtiene productos en tendencia (con tag "tendencia" o "trending")
 */
export async function getTrendingProducts(
    countryCode: string,
    limit = 4
): Promise<ProductSection> {
    let products = await fetchProductsByTags(
        ["tendencia", "trending", "popular"],
        limit
    )

    // Fallback: productos más recientes
    if (products.length === 0) {
        const { response } = await listProducts({
            countryCode,
            queryParams: {
                limit,
                order: "-created_at",
                fields: PRODUCT_FIELDS,
            },
        })
        products = response.products
    }

    return {
        products: products.slice(0, limit),
        title: "En Tendencia",
        subtitle: "Los productos que están conquistando a nuestra comunidad",
        viewAllLink: "/store",
    }
}

/**
 * Obtiene productos en oferta (con tag "oferta"/"sale"/"descuento" o con descuento calculado)
 */
export async function getOnSaleProducts(
    countryCode: string,
    limit = 4
): Promise<ProductSection> {
    // Try tag-based filtering first
    let products = await fetchProductsByTags(
        ["oferta", "sale", "descuento"],
        limit
    )

    // If not enough tagged products, supplement with discounted products
    if (products.length < limit) {
        const { response } = await listProducts({
            countryCode,
            queryParams: {
                limit: 20,
                fields: PRODUCT_FIELDS,
            },
        })

        const existingIds = new Set(products.map((p: any) => p.id))

        const discounted = response.products.filter((product) => {
            if (existingIds.has(product.id)) return false
            const variant = product.variants?.[0]
            const calculatedAmount = variant?.calculated_price?.calculated_amount
            const originalAmount = variant?.calculated_price?.original_amount
            return (
                calculatedAmount != null &&
                originalAmount != null &&
                calculatedAmount < originalAmount
            )
        })

        products = [...products, ...discounted].slice(0, limit)
    }

    return {
        products: products.slice(0, limit),
        title: "Ofertas Especiales",
        subtitle: "Aprovecha estos precios únicos por tiempo limitado",
        viewAllLink: "/store?filter=sale",
    }
}

/**
 * Obtiene productos por categoría específica
 */
export async function getProductsByCategory(
    countryCode: string,
    categoryHandle: string,
    limit = 4
): Promise<ProductSection> {
    const { response } = await listProducts({
        countryCode,
        queryParams: {
            limit: 20,
            fields: PRODUCT_FIELDS,
        },
    })

    const filtered = response.products.filter((product: any) =>
        product.categories?.some((cat: any) => cat.handle === categoryHandle)
    )

    const categoryName = categoryHandle
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

    return {
        products: filtered.slice(0, limit),
        title: categoryName,
        subtitle: `Explora nuestra colección de ${categoryName.toLowerCase()}`,
        viewAllLink: `/categories/${categoryHandle}`,
    }
}
