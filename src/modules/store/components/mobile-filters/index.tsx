"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import PriceFilter from "../refinement-list/price-filter"
import CategoryFilter from "../refinement-list/category-filter"
import AvailabilityFilter from "../refinement-list/availability-filter"
import SortProducts, { SortOptions } from "../refinement-list/sort-products"

type MobileFiltersProps = {
    sortBy: SortOptions
    categories: HttpTypes.StoreProductCategory[]
}

export default function MobileFilters({ sortBy, categories }: MobileFiltersProps) {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Cerrar el drawer cuando cambian los searchParams (filtro aplicado)
    useEffect(() => {
        setIsOpen(false)
    }, [searchParams])

    // Bloquear scroll cuando está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen])

    // Contar filtros activos
    const activeFiltersCount = [
        searchParams.get("minPrice"),
        searchParams.get("maxPrice"),
        searchParams.get("categories"),
        searchParams.get("inStock"),
    ].filter(Boolean).length

    // Leer filtros actuales
    const currentFilters = {
        minPrice: searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!) : undefined,
        maxPrice: searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : undefined,
        categories: searchParams.get("categories")?.split(",").filter(Boolean) || [],
        inStock: searchParams.get("inStock") === "true",
    }

    const createQueryString = (params: Record<string, string | undefined>) => {
        const newParams = new URLSearchParams(searchParams.toString())

        Object.entries(params).forEach(([key, value]) => {
            if (value === undefined || value === "" || value === "false") {
                newParams.delete(key)
            } else {
                newParams.set(key, value)
            }
        })

        newParams.delete("page")
        return newParams.toString()
    }

    const setQueryParams = (name: string, value: string) => {
        const query = createQueryString({ [name]: value })
        router.push(`${pathname}?${query}`, { scroll: false })
    }

    const handlePriceChange = (min: number | undefined, max: number | undefined) => {
        const query = createQueryString({
            minPrice: min?.toString(),
            maxPrice: max?.toString(),
        })
        router.push(`${pathname}?${query}`, { scroll: false })
    }

    const handleCategoryChange = (categoryIds: string[]) => {
        const query = createQueryString({
            categories: categoryIds.length > 0 ? categoryIds.join(",") : undefined,
        })
        router.push(`${pathname}?${query}`, { scroll: false })
    }

    const handleStockChange = (inStockOnly: boolean) => {
        const query = createQueryString({
            inStock: inStockOnly ? "true" : undefined,
        })
        router.push(`${pathname}?${query}`, { scroll: false })
    }

    const handleClearAll = () => {
        const newParams = new URLSearchParams()
        if (searchParams.get("sortBy")) {
            newParams.set("sortBy", searchParams.get("sortBy")!)
        }
        if (searchParams.get("q")) {
            newParams.set("q", searchParams.get("q")!)
        }
        router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
    }

    return (
        <>
            {/* Botón para abrir filtros en móvil */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 bg-main-color text-white rounded-full shadow-lg hover:bg-main-color-dark transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filtros
                {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-main-color text-xs font-bold rounded-full flex items-center justify-center">
                        {activeFiltersCount}
                    </span>
                )}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-50 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div
                className={`lg:hidden fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <svg className="w-5 h-5 text-main-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        Filtros
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenido scrolleable */}
                <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
                    <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} />

                    <PriceFilter
                        minPrice={currentFilters.minPrice}
                        maxPrice={currentFilters.maxPrice}
                        onPriceChange={handlePriceChange}
                    />

                    {categories.length > 0 && (
                        <CategoryFilter
                            categories={categories}
                            selectedCategories={currentFilters.categories}
                            onCategoryChange={handleCategoryChange}
                        />
                    )}

                    <AvailabilityFilter
                        inStockOnly={currentFilters.inStock}
                        onStockChange={handleStockChange}
                    />
                </div>

                {/* Footer con botones */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex gap-3">
                    <button
                        onClick={handleClearAll}
                        className="flex-1 py-3 text-gray-700 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                        Limpiar
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="flex-1 py-3 bg-main-color text-white rounded-xl font-medium hover:bg-main-color-dark transition-colors"
                    >
                        Ver resultados
                    </button>
                </div>
            </div>
        </>
    )
}
