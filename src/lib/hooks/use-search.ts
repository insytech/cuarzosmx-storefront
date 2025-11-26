"use client"

import { useState, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"

interface UseSearchResult {
    results: HttpTypes.StoreProduct[]
    isLoading: boolean
    error: string | null
    search: (query: string) => Promise<void>
    clearResults: () => void
}

export const useSearch = (countryCode: string): UseSearchResult => {
    const [results, setResults] = useState<HttpTypes.StoreProduct[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const search = useCallback(async (query: string) => {
        if (!query || query.length < 2) {
            setResults([])
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(
                `/api/search?q=${encodeURIComponent(query)}&countryCode=${countryCode}`
            )

            if (!response.ok) {
                throw new Error("Error en la búsqueda")
            }

            const data = await response.json()
            setResults(data.products || [])
        } catch (err) {
            console.error("Error searching:", err)
            setError("Error al buscar productos")
            setResults([])
        } finally {
            setIsLoading(false)
        }
    }, [countryCode])

    const clearResults = useCallback(() => {
        setResults([])
        setError(null)
    }, [])

    return {
        results,
        isLoading,
        error,
        search,
        clearResults,
    }
}
