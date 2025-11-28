"use client"

import { useState, useEffect, useCallback } from "react"

type PriceFilterProps = {
    minPrice?: number
    maxPrice?: number
    onPriceChange: (min: number | undefined, max: number | undefined) => void
    currencyCode?: string
}

export default function PriceFilter({
    minPrice,
    maxPrice,
    onPriceChange,
    currencyCode = "MXN"
}: PriceFilterProps) {
    const [localMin, setLocalMin] = useState<string>(minPrice?.toString() || "")
    const [localMax, setLocalMax] = useState<string>(maxPrice?.toString() || "")
    const [isExpanded, setIsExpanded] = useState(true)

    // Sincronizar con props
    useEffect(() => {
        setLocalMin(minPrice?.toString() || "")
        setLocalMax(maxPrice?.toString() || "")
    }, [minPrice, maxPrice])

    const handleApply = useCallback(() => {
        const min = localMin ? parseInt(localMin) : undefined
        const max = localMax ? parseInt(localMax) : undefined
        onPriceChange(min, max)
    }, [localMin, localMax, onPriceChange])

    const handleClear = useCallback(() => {
        setLocalMin("")
        setLocalMax("")
        onPriceChange(undefined, undefined)
    }, [onPriceChange])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleApply()
        }
    }

    const hasFilter = localMin || localMax

    // Rangos predefinidos
    const priceRanges = [
        { label: "Menos de $200", min: 0, max: 200 },
        { label: "$200 - $500", min: 200, max: 500 },
        { label: "$500 - $1,000", min: 500, max: 1000 },
        { label: "$1,000 - $2,000", min: 1000, max: 2000 },
        { label: "Más de $2,000", min: 2000, max: undefined },
    ]

    const handleRangeClick = (min: number, max: number | undefined) => {
        setLocalMin(min.toString())
        setLocalMax(max?.toString() || "")
        onPriceChange(min, max)
    }

    const isRangeActive = (min: number, max: number | undefined) => {
        const currentMin = localMin ? parseInt(localMin) : undefined
        const currentMax = localMax ? parseInt(localMax) : undefined
        return currentMin === min && currentMax === max
    }

    return (
        <div className="border-b border-gray-200 pb-4">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full py-2 text-left"
            >
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-main-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Precio
                    {hasFilter && (
                        <span className="ml-1 w-2 h-2 bg-main-color rounded-full" />
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
                <div className="mt-3 space-y-4">
                    {/* Rangos predefinidos */}
                    <div className="space-y-1.5">
                        {priceRanges.map((range, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleRangeClick(range.min, range.max)}
                                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${isRangeActive(range.min, range.max)
                                        ? "bg-main-color text-white font-medium"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>

                    {/* Separador */}
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400">o personalizado</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Inputs personalizados */}
                    <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                            <input
                                type="number"
                                placeholder="Mín"
                                value={localMin}
                                onChange={(e) => setLocalMin(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full pl-7 pr-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-color/20 focus:border-main-color"
                                min="0"
                            />
                        </div>
                        <span className="text-gray-400">-</span>
                        <div className="flex-1 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                            <input
                                type="number"
                                placeholder="Máx"
                                value={localMax}
                                onChange={(e) => setLocalMax(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full pl-7 pr-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-color/20 focus:border-main-color"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleApply}
                            className="flex-1 py-2 text-sm font-medium text-white bg-main-color rounded-lg hover:bg-main-color-dark transition-colors"
                        >
                            Aplicar
                        </button>
                        {hasFilter && (
                            <button
                                onClick={handleClear}
                                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
