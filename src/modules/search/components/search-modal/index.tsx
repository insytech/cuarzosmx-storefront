"use client"

import { Fragment, useState, useEffect, useRef } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { useRouter, useParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { useSearch } from "@lib/hooks/use-search"
import { formatAmount } from "@lib/util/money"

interface SearchModalProps {
    isOpen: boolean
    onClose: () => void
    onNavigate?: () => void
}

const SearchModal = ({ isOpen, onClose, onNavigate }: SearchModalProps) => {
    const router = useRouter()
    const params = useParams()
    const countryCode = (params?.countryCode as string) || "mx"

    const [query, setQuery] = useState("")
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const inputRef = useRef<HTMLInputElement>(null)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    const { results, isLoading, search, clearResults } = useSearch(countryCode)

    // Cargar búsquedas recientes del localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("recentSearches")
            if (stored) {
                setRecentSearches(JSON.parse(stored))
            }
        }
    }, [])

    // Focus en el input cuando se abre
    useEffect(() => {
        if (isOpen && inputRef.current) {
            // Use requestAnimationFrame for more reliable focus after DOM update
            requestAnimationFrame(() => {
                inputRef.current?.focus()
            })
        }
    }, [isOpen])


    // Debounce de la búsqueda
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        debounceRef.current = setTimeout(() => {
            if (query.length >= 2) {
                search(query)
            } else {
                clearResults()
            }
        }, 300)

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current)
            }
        }
    }, [query, search, clearResults])

    // Guardar búsqueda reciente
    const saveRecentSearch = (searchTerm: string) => {
        const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5)
        setRecentSearches(updated)
        localStorage.setItem("recentSearches", JSON.stringify(updated))
    }

    // Manejar submit del formulario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            saveRecentSearch(query.trim())
            router.push(`/${countryCode}/store?q=${encodeURIComponent(query.trim())}`)
            onClose()
            onNavigate?.()
        }
    }

    // Manejar click en producto
    const handleProductClick = () => {
        if (query.trim()) {
            saveRecentSearch(query.trim())
        }
        onClose()
        onNavigate?.()
    }

    // Limpiar búsquedas recientes
    const clearRecentSearches = () => {
        setRecentSearches([])
        localStorage.removeItem("recentSearches")
    }

    // Cerrar con Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEscape)
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
        }
    }, [isOpen, onClose])

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={onClose}>
                {/* Overlay */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-start justify-center p-4 pt-[10vh]">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95 -translate-y-4"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100 translate-y-0"
                            leaveTo="opacity-0 scale-95 -translate-y-4"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                                {/* Header con buscador */}
                                <form onSubmit={handleSubmit} className="relative">
                                    <div className="flex items-center border-b border-gray-200">
                                        {/* Icono de búsqueda */}
                                        <div className="pl-5 text-gray-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>

                                        {/* Input */}
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="Buscar cristales, cuarzos, joyería..."
                                            className="flex-1 px-4 py-5 text-lg outline-none placeholder:text-gray-400"
                                            autoFocus
                                        />

                                        {/* Botón limpiar / Loading */}
                                        {isLoading ? (
                                            <div className="pr-5">
                                                <div className="w-5 h-5 border-2 border-main-color border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        ) : query && (
                                            <button
                                                type="button"
                                                onClick={() => setQuery("")}
                                                className="pr-5 text-gray-400 hover:text-gray-600"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </form>

                                {/* Contenido */}
                                <div className="max-h-[60vh] overflow-y-auto">
                                    {/* Sin query - Mostrar búsquedas recientes o sugerencias */}
                                    {!query && (
                                        <div className="p-5">
                                            {recentSearches.length > 0 ? (
                                                <div>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="text-sm font-medium text-gray-500">Búsquedas recientes</h3>
                                                        <button
                                                            onClick={clearRecentSearches}
                                                            className="text-xs text-main-color hover:text-main-color-dark"
                                                        >
                                                            Limpiar
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {recentSearches.map((term, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => setQuery(term)}
                                                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-main-color-light text-sm text-gray-700 rounded-full transition-colors"
                                                            >
                                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                {term}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-main-color-light flex items-center justify-center">
                                                        <svg className="w-8 h-8 text-main-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-gray-500">Busca entre nuestra colección de cristales y joyería</p>
                                                </div>
                                            )}

                                            {/* Sugerencias populares */}
                                            <div className="mt-6">
                                                <h3 className="text-sm font-medium text-gray-500 mb-3">Búsquedas populares</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {["Amatista", "Cuarzo Rosa", "Obsidiana", "Turmalina", "Jade", "Ágata"].map((term) => (
                                                        <button
                                                            key={term}
                                                            onClick={() => setQuery(term)}
                                                            className="px-3 py-2 bg-main-color-light/50 hover:bg-main-color-light text-sm text-main-color-dark rounded-full transition-colors"
                                                        >
                                                            {term}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Con query pero sin resultados */}
                                    {query && !isLoading && results.length === 0 && query.length >= 2 && (
                                        <div className="p-8 text-center">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-medium text-gray-900 mb-1">No encontramos resultados</h3>
                                            <p className="text-sm text-gray-500">
                                                No hay productos que coincidan con "{query}"
                                            </p>
                                            <p className="text-sm text-gray-400 mt-2">
                                                Intenta con otros términos o navega por nuestras categorías
                                            </p>
                                        </div>
                                    )}

                                    {/* Resultados */}
                                    {results.length > 0 && (
                                        <div className="p-2">
                                            <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">
                                                {results.length} {results.length === 1 ? "resultado" : "resultados"}
                                            </div>
                                            <div className="divide-y divide-gray-100">
                                                {results.slice(0, 6).map((product) => (
                                                    <LocalizedClientLink
                                                        key={product.id}
                                                        href={`/products/${product.handle}`}
                                                        onClick={() => handleProductClick()}
                                                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                                                    >
                                                        <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                                            <Thumbnail
                                                                thumbnail={product.thumbnail}
                                                                images={product.images}
                                                                size="square"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium text-gray-900 truncate">
                                                                {product.title}
                                                            </h4>
                                                            {product.collection && (
                                                                <p className="text-sm text-gray-500">
                                                                    {product.collection.title}
                                                                </p>
                                                            )}
                                                            {product.variants?.[0]?.calculated_price && (
                                                                <p className="text-sm font-medium text-main-color mt-1">
                                                                    {formatAmount(
                                                                        product.variants[0].calculated_price.calculated_amount!,
                                                                        product.variants[0].calculated_price.currency_code!
                                                                    )}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </LocalizedClientLink>
                                                ))}
                                            </div>

                                            {/* Ver todos los resultados */}
                                            {results.length > 6 && (
                                                <div className="p-3 border-t border-gray-100">
                                                    <button
                                                        onClick={handleSubmit}
                                                        className="w-full py-3 text-center text-main-color hover:text-main-color-dark font-medium transition-colors"
                                                    >
                                                        Ver todos los {results.length} resultados
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Footer con atajo de teclado */}
                                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-gray-600">↵</kbd>
                                            para buscar
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-gray-600">Esc</kbd>
                                            para cerrar
                                        </span>
                                    </div>
                                    <span className="hidden sm:block">
                                        Presiona <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-gray-600">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-gray-600">K</kbd> para buscar
                                    </span>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default SearchModal
