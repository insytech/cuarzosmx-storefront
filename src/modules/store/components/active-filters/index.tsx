"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { HttpTypes } from "@medusajs/types"

type ActiveFiltersProps = {
    categories?: HttpTypes.StoreProductCategory[]
}

export default function ActiveFilters({ categories = [] }: ActiveFiltersProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const categoryIds = searchParams.get("categories")?.split(",").filter(Boolean) || []
    const inStock = searchParams.get("inStock") === "true"
    const searchQuery = searchParams.get("q")

    const hasFilters = minPrice || maxPrice || categoryIds.length > 0 || inStock

    const removeFilter = useCallback((key: string, value?: string) => {
        const params = new URLSearchParams(searchParams.toString())
        
        if (key === "categories" && value) {
            const currentCategories = params.get("categories")?.split(",").filter(Boolean) || []
            const newCategories = currentCategories.filter(id => id !== value)
            if (newCategories.length > 0) {
                params.set("categories", newCategories.join(","))
            } else {
                params.delete("categories")
            }
        } else {
            params.delete(key)
        }
        
        params.delete("page") // Reset page
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }, [searchParams, pathname, router])

    const clearAll = useCallback(() => {
        const params = new URLSearchParams()
        if (searchParams.get("sortBy")) {
            params.set("sortBy", searchParams.get("sortBy")!)
        }
        if (searchParams.get("q")) {
            params.set("q", searchParams.get("q")!)
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }, [searchParams, pathname, router])

    if (!hasFilters) return null

    // Encontrar nombres de categorías seleccionadas
    const selectedCategoryNames = categoryIds.map(id => {
        const category = categories.find(c => c.id === id)
        return { id, name: category?.name || id }
    })

    return (
        <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 mr-1">Filtros:</span>
            
            {/* Precio */}
            {(minPrice || maxPrice) && (
                <button
                    onClick={() => {
                        removeFilter("minPrice")
                        removeFilter("maxPrice")
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-main-color-light/50 text-main-color-dark text-sm rounded-full hover:bg-main-color-light transition-colors group"
                >
                    <span>
                        Precio: {minPrice ? `$${minPrice}` : "$0"} - {maxPrice ? `$${maxPrice}` : "∞"}
                    </span>
                    <svg className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            {/* Categorías */}
            {selectedCategoryNames.map(({ id, name }) => (
                <button
                    key={id}
                    onClick={() => removeFilter("categories", id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-main-color-light/50 text-main-color-dark text-sm rounded-full hover:bg-main-color-light transition-colors group"
                >
                    <span>{name}</span>
                    <svg className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            ))}

            {/* En stock */}
            {inStock && (
                <button
                    onClick={() => removeFilter("inStock")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-full hover:bg-green-200 transition-colors group"
                >
                    <span>En stock</span>
                    <svg className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            {/* Limpiar todo */}
            <button
                onClick={clearAll}
                className="text-sm text-gray-500 hover:text-gray-700 underline ml-2"
            >
                Limpiar todo
            </button>
        </div>
    )
}
