"use client"

import { useState } from "react"

type AvailabilityFilterProps = {
    inStockOnly: boolean
    onStockChange: (inStockOnly: boolean) => void
}

export default function AvailabilityFilter({
    inStockOnly,
    onStockChange,
}: AvailabilityFilterProps) {
    const [isExpanded, setIsExpanded] = useState(true)

    return (
        <div className="border-b border-gray-200 pb-4">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full py-2 text-left"
            >
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-main-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Disponibilidad
                    {inStockOnly && (
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
                <div className="mt-3">
                    <label
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all ${inStockOnly
                            ? "bg-green-50 border border-green-200"
                            : "hover:bg-gray-50"
                            }`}
                    >
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={inStockOnly}
                                onChange={(e) => onStockChange(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className={`w-10 h-6 rounded-full transition-colors ${inStockOnly ? "bg-green-500" : "bg-gray-300"}`}>
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${inStockOnly ? "translate-x-4" : ""}`} />
                            </div>
                        </div>
                        <div className="flex-1">
                            <span className={`text-sm ${inStockOnly ? "text-green-700 font-medium" : "text-gray-600"}`}>
                                Solo productos en stock
                            </span>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Mostrar solo productos disponibles
                            </p>
                        </div>
                        {inStockOnly && (
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </label>
                </div>
            )}
        </div>
    )
}
