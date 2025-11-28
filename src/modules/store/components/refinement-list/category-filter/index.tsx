"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"

type CategoryFilterProps = {
    categories: HttpTypes.StoreProductCategory[]
    selectedCategories: string[]
    onCategoryChange: (categoryIds: string[]) => void
}

export default function CategoryFilter({
    categories,
    selectedCategories,
    onCategoryChange,
}: CategoryFilterProps) {
    const [isExpanded, setIsExpanded] = useState(true)
    const [showAll, setShowAll] = useState(false)

    // Filtrar solo categorías padre (sin parent_category)
    const parentCategories = categories.filter(cat => !cat.parent_category)

    // Mostrar máximo 6 categorías inicialmente
    const displayCategories = showAll ? parentCategories : parentCategories.slice(0, 6)
    const hasMore = parentCategories.length > 6

    const handleCategoryToggle = (categoryId: string) => {
        if (selectedCategories.includes(categoryId)) {
            onCategoryChange(selectedCategories.filter(id => id !== categoryId))
        } else {
            onCategoryChange([...selectedCategories, categoryId])
        }
    }

    const handleClearAll = () => {
        onCategoryChange([])
    }

    const hasFilter = selectedCategories.length > 0

    return (
        <div className="border-b border-gray-200 pb-4">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full py-2 text-left"
            >
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-main-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Categorías
                    {hasFilter && (
                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-main-color text-white rounded-full">
                            {selectedCategories.length}
                        </span>
                    )}
                </h4>
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isExpanded && (
                <div className="mt-3 space-y-2">
                    {displayCategories.map((category) => {
                        const isSelected = selectedCategories.includes(category.id)
                        const productCount = category.products?.length || 0

                        return (
                            <label
                                key={category.id}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${isSelected
                                        ? "bg-main-color-light/50 border border-main-color/30"
                                        : "hover:bg-gray-50"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleCategoryToggle(category.id)}
                                    className="w-4 h-4 text-main-color border-gray-300 rounded focus:ring-main-color focus:ring-2"
                                />
                                <span className={`flex-1 text-sm ${isSelected ? "text-main-color-dark font-medium" : "text-gray-600"}`}>
                                    {category.name}
                                </span>
                                {productCount > 0 && (
                                    <span className="text-xs text-gray-400">
                                        ({productCount})
                                    </span>
                                )}
                            </label>
                        )
                    })}

                    {/* Ver más / Ver menos */}
                    {hasMore && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="w-full py-2 text-sm text-main-color hover:text-main-color-dark font-medium transition-colors flex items-center justify-center gap-1"
                        >
                            {showAll ? (
                                <>
                                    Ver menos
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                </>
                            ) : (
                                <>
                                    Ver más ({parentCategories.length - 6})
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </>
                            )}
                        </button>
                    )}

                    {/* Limpiar selección */}
                    {hasFilter && (
                        <button
                            onClick={handleClearAll}
                            className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Limpiar selección
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
