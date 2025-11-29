import { NextRequest, NextResponse } from "next/server"
import { searchProducts } from "@lib/data/products"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")
    const countryCode = searchParams.get("countryCode") || "mx"

    if (!query || query.length < 2) {
        return NextResponse.json({ products: [] })
    }

    try {
        const products = await searchProducts({
            query,
            countryCode,
            limit: 50,
        })

        return NextResponse.json({ products })
    } catch (error) {
        console.error("Search error:", error)
        return NextResponse.json(
            { error: "Error searching products" },
            { status: 500 }
        )
    }
}
