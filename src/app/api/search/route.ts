import { NextRequest, NextResponse } from "next/server"
import { listProducts } from "@lib/data/products"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")
    const countryCode = searchParams.get("countryCode") || "mx"

    if (!query || query.length < 2) {
        return NextResponse.json({ products: [] })
    }

    try {
        // Get all products and filter by query
        const { response } = await listProducts({
            countryCode,
            queryParams: {
                limit: 20,
            },
        })

        const products = response.products || []

        // Filter products that match the query
        const queryLower = query.toLowerCase()
        const filteredProducts = products.filter((product) => {
            const titleMatch = product.title?.toLowerCase().includes(queryLower)
            const descriptionMatch = product.description?.toLowerCase().includes(queryLower)
            const handleMatch = product.handle?.toLowerCase().includes(queryLower)
            return titleMatch || descriptionMatch || handleMatch
        })

        return NextResponse.json({ products: filteredProducts })
    } catch (error) {
        console.error("Search error:", error)
        return NextResponse.json(
            { error: "Error searching products" },
            { status: 500 }
        )
    }
}
