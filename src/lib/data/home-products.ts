"use server"

import { HttpTypes } from "@medusajs/types"
import { listProducts } from "./products"

export type ProductSection = {
    products: HttpTypes.StoreProduct[]
    title: string
    subtitle: string
    viewAllLink?: string
}

/**
 * Obtiene productos destacados (con tag "destacado" o metadata.featured)
 */
export async function getFeaturedProducts(
    countryCode: string,
    limit = 4
): Promise<ProductSection> {
    const { response } = await listProducts({
        countryCode,
        queryParams: {
            limit: 50,
            fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
        },
    })

    // Filtrar por tag "destacado" o "featured", o metadata.featured
    const featured = response.products.filter((product) => {
        const hasTag = product.tags?.some(
            (tag) =>
                tag.value?.toLowerCase() === "destacado" ||
                tag.value?.toLowerCase() === "featured"
        )
        const hasMetadata =
            product.metadata?.featured === true ||
            product.metadata?.featured === "true"
        return hasTag || hasMetadata
    })

    // Si no hay productos con tag, tomar los primeros productos como destacados
    const products = featured.length > 0
        ? featured.slice(0, limit)
        : response.products.slice(0, limit)

    return {
        products,
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
            limit: 20,
            order: "-created_at", // Más recientes primero
            fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
        },
    })

    // Ordenar por fecha de creación (más recientes primero)
    const sorted = [...response.products].sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime()
        const dateB = new Date(b.created_at || 0).getTime()
        return dateB - dateA
    })

    return {
        products: sorted.slice(0, limit),
        title: "Nuevos Ingresos",
        subtitle: "Las últimas adiciones a nuestra colección de cristales",
        viewAllLink: "/store?sortBy=created_at",
    }
}

/**
 * Obtiene los productos más vendidos (con tag "bestseller" o metadata.bestseller)
 */
export async function getBestSellers(
    countryCode: string,
    limit = 4
): Promise<ProductSection> {
    const { response } = await listProducts({
        countryCode,
        queryParams: {
            limit: 50,
            fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
        },
    })

    // Filtrar por tag "bestseller", "más vendido" o metadata
    const bestsellers = response.products.filter((product) => {
        const hasTag = product.tags?.some(
            (tag) =>
                tag.value?.toLowerCase() === "bestseller" ||
                tag.value?.toLowerCase() === "más vendido" ||
                tag.value?.toLowerCase() === "popular"
        )
        const hasMetadata =
            product.metadata?.bestseller === true ||
            product.metadata?.bestseller === "true" ||
            product.metadata?.popular === true
        return hasTag || hasMetadata
    })

    // Si no hay productos con tag, usar productos con menor inventario (asumiendo que se vendieron más)
    let products: HttpTypes.StoreProduct[]

    if (bestsellers.length >= limit) {
        products = bestsellers.slice(0, limit)
    } else {
        // Fallback: ordenar por inventario (menor inventario = más vendido)
        const byInventory = [...response.products].sort((a, b) => {
            const invA = a.variants?.[0]?.inventory_quantity ?? Infinity
            const invB = b.variants?.[0]?.inventory_quantity ?? Infinity
            return invA - invB
        })
        products = byInventory.slice(0, limit)
    }

    return {
        products,
        title: "Más Vendidos",
        subtitle: "Los favoritos de nuestra comunidad cristalera",
        viewAllLink: "/store?filter=bestseller",
    }
}

/**
 * Obtiene productos recomendados (variedad de categorías, buen precio, o aleatorios)
 */
export async function getRecommendedProducts(
    countryCode: string,
    limit = 4
): Promise<ProductSection> {
    const { response } = await listProducts({
        countryCode,
        queryParams: {
            limit: 50,
            fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
        },
    })

    // Filtrar productos con tag "recomendado" primero
    const recommended = response.products.filter((product) => {
        const hasTag = product.tags?.some(
            (tag) =>
                tag.value?.toLowerCase() === "recomendado" ||
                tag.value?.toLowerCase() === "recommended"
        )
        const hasMetadata =
            product.metadata?.recommended === true ||
            product.metadata?.recommended === "true"
        return hasTag || hasMetadata
    })

    let products: HttpTypes.StoreProduct[]

    if (recommended.length >= limit) {
        products = recommended.slice(0, limit)
    } else {
        // Fallback: selección diversa - mezclar productos de diferentes rangos de precio
        const withPrices = response.products
            .filter((p) => p.variants?.[0]?.calculated_price?.calculated_amount)
            .map((product) => ({
                product,
                price: product.variants?.[0].calculated_price?.calculated_amount!,
            }))
            .sort((a, b) => a.price - b.price)

        // Tomar productos de diferentes rangos de precio para variedad
        const total = withPrices.length
        if (total >= limit) {
            const indices = [
                0, // Más económico
                Math.floor(total * 0.33),
                Math.floor(total * 0.66),
                total - 1, // Más premium
            ].slice(0, limit)

            products = indices.map((i) => withPrices[i].product)
        } else {
            // Si hay pocos productos, barajar y tomar aleatorios
            const shuffled = [...response.products].sort(() => Math.random() - 0.5)
            products = shuffled.slice(0, limit)
        }
    }

    return {
        products,
        title: "Recomendados para Ti",
        subtitle: "Piezas únicas que podrían complementar tu energía",
        viewAllLink: "/store",
    }
}

/**
 * Obtiene productos en oferta (con descuento o tag "oferta")
 */
export async function getOnSaleProducts(
    countryCode: string,
    limit = 4
): Promise<ProductSection> {
    const { response } = await listProducts({
        countryCode,
        queryParams: {
            limit: 50,
            fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
        },
    })

    // Filtrar productos con descuento o tag "oferta"
    const onSale = response.products.filter((product) => {
        // Verificar tag
        const hasTag = product.tags?.some(
            (tag) =>
                tag.value?.toLowerCase() === "oferta" ||
                tag.value?.toLowerCase() === "sale" ||
                tag.value?.toLowerCase() === "descuento"
        )

        // Verificar si tiene precio original vs calculado (descuento)
        const variant = product.variants?.[0]
        const calculatedAmount = variant?.calculated_price?.calculated_amount
        const originalAmount = variant?.calculated_price?.original_amount
        const hasDiscount =
            calculatedAmount != null &&
            originalAmount != null &&
            calculatedAmount < originalAmount

        return hasTag || hasDiscount
    })

    return {
        products: onSale.slice(0, limit),
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
            limit,
            fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+categories",
        },
    })

    // Filtrar por categoría (si tuviéramos el ID de la categoría sería más eficiente)
    // Por ahora filtramos en cliente
    const filtered = response.products.filter((product) =>
        product.categories?.some((cat) => cat.handle === categoryHandle)
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
