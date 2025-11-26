"use client"

import { useState, useEffect } from "react"
import SearchModal from "@modules/search/components/search-modal"

interface SearchButtonProps {
    className?: string
    showText?: boolean
}

const SearchButton = ({ className = "", showText = false }: SearchButtonProps) => {
    const [isOpen, setIsOpen] = useState(false)

    // Atajo de teclado Ctrl+K o Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault()
                setIsOpen(true)
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [])

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors ${className}`}
                title="Buscar (Ctrl+K)"
                aria-label="Abrir buscador"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {showText && <span className="ml-2">Buscar productos...</span>}
            </button>

            <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}

export default SearchButton
