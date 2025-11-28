"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"
import { HttpTypes } from "@medusajs/types"

import SortProducts, { SortOptions } from "./sort-products"
import PriceFilter from "./price-filter"
import CategoryFilter from "./category-filter"
import AvailabilityFilter from "./availability-filter"

type RefinementListProps = {
  sortBy: SortOptions
  categories?: HttpTypes.StoreProductCategory[]
  search?: boolean
  'data-testid'?: string
}

const RefinementList = ({ sortBy, categories = [], 'data-testid': dataTestId }: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Leer filtros actuales de la URL
  const currentFilters = useMemo(() => ({
    minPrice: searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!) : undefined,
    maxPrice: searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : undefined,
    categories: searchParams.get("categories")?.split(",").filter(Boolean) || [],
    inStock: searchParams.get("inStock") === "true",
  }), [searchParams])

  const createQueryString = useCallback(
    (params: Record<string, string | undefined>) => {
      const newParams = new URLSearchParams(searchParams.toString())

      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === "false") {
          newParams.delete(key)
        } else {
          newParams.set(key, value)
        }
      })

      // Reset page when filters change
      if (Object.keys(params).some(key => key !== "sortBy" && key !== "page")) {
        newParams.delete("page")
      }

      return newParams.toString()
    },
    [searchParams]
  )

  const setQueryParams = useCallback((name: string, value: string) => {
    const query = createQueryString({ [name]: value })
    router.push(`${pathname}?${query}`, { scroll: false })
  }, [createQueryString, pathname, router])

  // Handler para precio
  const handlePriceChange = useCallback((min: number | undefined, max: number | undefined) => {
    const query = createQueryString({
      minPrice: min?.toString(),
      maxPrice: max?.toString(),
    })
    router.push(`${pathname}?${query}`, { scroll: false })
  }, [createQueryString, pathname, router])

  // Handler para categorías
  const handleCategoryChange = useCallback((categoryIds: string[]) => {
    const query = createQueryString({
      categories: categoryIds.length > 0 ? categoryIds.join(",") : undefined,
    })
    router.push(`${pathname}?${query}`, { scroll: false })
  }, [createQueryString, pathname, router])

  // Handler para disponibilidad
  const handleStockChange = useCallback((inStockOnly: boolean) => {
    const query = createQueryString({
      inStock: inStockOnly ? "true" : undefined,
    })
    router.push(`${pathname}?${query}`, { scroll: false })
  }, [createQueryString, pathname, router])

  // Limpiar todos los filtros
  const handleClearAll = useCallback(() => {
    const newParams = new URLSearchParams()
    if (searchParams.get("sortBy")) {
      newParams.set("sortBy", searchParams.get("sortBy")!)
    }
    if (searchParams.get("q")) {
      newParams.set("q", searchParams.get("q")!)
    }
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
  }, [pathname, router, searchParams])

  // Verificar si hay filtros activos
  const hasActiveFilters = currentFilters.minPrice !== undefined ||
    currentFilters.maxPrice !== undefined ||
    currentFilters.categories.length > 0 ||
    currentFilters.inStock

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-main-color" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filtros
        </h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-xs text-main-color hover:text-main-color-dark font-medium transition-colors"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="space-y-4">
        {/* Ordenar */}
        <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />

        {/* Precio */}
        <PriceFilter
          minPrice={currentFilters.minPrice}
          maxPrice={currentFilters.maxPrice}
          onPriceChange={handlePriceChange}
        />

        {/* Categorías */}
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategories={currentFilters.categories}
            onCategoryChange={handleCategoryChange}
          />
        )}

        {/* Disponibilidad */}
        <AvailabilityFilter
          inStockOnly={currentFilters.inStock}
          onStockChange={handleStockChange}
        />
      </div>

      {/* Filtros activos badge */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Hay filtros activos aplicados
          </p>
        </div>
      )}
    </div>
  )
}

export default RefinementList

