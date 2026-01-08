"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState, useEffect } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import SearchButton from "@modules/search/components/search-button"

type CategoryItem = {
    name: string
    handle: string
    subcategories?: { name: string; handle: string }[]
}

const menuItems = [
    { name: "Inicio", href: "/" },
    { name: "Tienda", href: "/store" },
    { name: "Blog", href: "/blog" },
    { name: "Nosotros", href: "/about" },
    { name: "Contacto", href: "/contact" },
    { name: "FAQ", href: "/faq" },
]

type MobileMenuProps = {
    regions?: HttpTypes.StoreRegion[] | null
}

async function fetchCategories(): Promise<CategoryItem[]> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
        const response = await fetch(`${baseUrl}/store/categories`, {
            headers: {
                "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
            },
        })

        if (response.ok) {
            const data = await response.json()
            return data.categories || []
        }
    } catch (error) {
        console.error("Error fetching categories:", error)
    }
    return []
}

export default function MobileMenu({ regions }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
    const [showCategories, setShowCategories] = useState(false)
    const [categories, setCategories] = useState<CategoryItem[]>([])
    const [loadingCategories, setLoadingCategories] = useState(false)

    const openMenu = () => setIsOpen(true)
    const closeMenu = () => {
        setIsOpen(false)
        setShowCategories(false)
        setExpandedCategory(null)
    }

    const toggleCategory = (handle: string) => {
        setExpandedCategory(expandedCategory === handle ? null : handle)
    }

    // Load categories when categories view is opened
    useEffect(() => {
        if (showCategories && categories.length === 0 && !loadingCategories) {
            setLoadingCategories(true)
            fetchCategories()
                .then(setCategories)
                .finally(() => setLoadingCategories(false))
        }
    }, [showCategories, categories.length, loadingCategories])

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={openMenu}
                className="lg:hidden p-2 text-gray-700 hover:text-main-color hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Abrir menú"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Mobile Menu Dialog */}
            <Transition show={isOpen} as={Fragment}>
                <Dialog onClose={closeMenu} className="relative z-[100]">
                    {/* Backdrop */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                    </Transition.Child>

                    {/* Menu Panel */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="ease-in duration-200"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <Dialog.Panel className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-2xl flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <LocalizedClientLink href="/" onClick={closeMenu}>
                                    <img src="/cuarzosmx-logo.webp" alt="CuarzosMX" className="h-10" />
                                </LocalizedClientLink>
                                <button
                                    onClick={closeMenu}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    aria-label="Cerrar menú"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto">
                                {!showCategories ? (
                                    /* Main Menu */
                                    <div className="p-4">
                                        {/* Search Button */}
                                        <div className="mb-4">
                                            <SearchButton
                                                className="w-full flex items-center justify-center gap-2 p-4 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors"
                                                showText={true}
                                            />
                                        </div>

                                        {/* Categories Button */}
                                        <button
                                            onClick={() => setShowCategories(true)}
                                            className="w-full flex items-center justify-between p-4 mb-2 bg-main-color-light rounded-xl text-main-color-dark font-semibold hover:bg-main-color/20 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                                </svg>
                                                <span>Categorías</span>
                                            </div>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>

                                        {/* Menu Items */}
                                        <nav className="mt-4 space-y-1">
                                            {menuItems.map((item) => (
                                                <LocalizedClientLink
                                                    key={item.name}
                                                    href={item.href}
                                                    onClick={closeMenu}
                                                    className="flex items-center gap-3 p-4 text-gray-700 hover:text-main-color hover:bg-gray-50 rounded-xl transition-colors font-medium"
                                                >
                                                    {item.name}
                                                </LocalizedClientLink>
                                            ))}
                                        </nav>

                                        {/* Account Section */}
                                        <div className="mt-6 pt-6 border-t border-gray-100">
                                            <LocalizedClientLink
                                                href="/account"
                                                onClick={closeMenu}
                                                className="flex items-center gap-3 p-4 text-gray-700 hover:text-main-color hover:bg-gray-50 rounded-xl transition-colors font-medium"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Mi Cuenta
                                            </LocalizedClientLink>
                                            <LocalizedClientLink
                                                href="/cart"
                                                onClick={closeMenu}
                                                className="flex items-center gap-3 p-4 text-gray-700 hover:text-main-color hover:bg-gray-50 rounded-xl transition-colors font-medium"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                Mi Carrito
                                            </LocalizedClientLink>
                                        </div>
                                    </div>
                                ) : (
                                    /* Categories View */
                                    <div className="p-4">
                                        {/* Back Button */}
                                        <button
                                            onClick={() => setShowCategories(false)}
                                            className="flex items-center gap-2 p-2 mb-4 text-gray-600 hover:text-main-color transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                            </svg>
                                            <span className="font-medium">Volver al menú</span>
                                        </button>

                                        <h2 className="text-lg font-serenity font-bold text-gray-800 mb-4 px-2">
                                            Categorías
                                        </h2>

                                        {/* Loading State */}
                                        {loadingCategories && (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main-color"></div>
                                            </div>
                                        )}

                                        {/* Categories List */}
                                        {!loadingCategories && (
                                            <div className="space-y-2">
                                                {categories.map((category) => (
                                                    <div key={category.handle}>
                                                        {category.subcategories && category.subcategories.length > 0 ? (
                                                            <>
                                                                <button
                                                                    onClick={() => toggleCategory(category.handle)}
                                                                    className="w-full flex items-center justify-between p-3 text-gray-700 hover:text-main-color hover:bg-gray-50 rounded-xl transition-colors"
                                                                >
                                                                    <span className="font-medium">{category.name}</span>
                                                                    <svg
                                                                        className={`w-5 h-5 transition-transform duration-200 ${expandedCategory === category.handle ? "rotate-180" : ""
                                                                            }`}
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                                    </svg>
                                                                </button>

                                                                {/* Subcategories */}
                                                                <Transition
                                                                    show={expandedCategory === category.handle}
                                                                    enter="transition-all duration-200 ease-out"
                                                                    enterFrom="opacity-0 max-h-0"
                                                                    enterTo="opacity-100 max-h-96"
                                                                    leave="transition-all duration-150 ease-in"
                                                                    leaveFrom="opacity-100 max-h-96"
                                                                    leaveTo="opacity-0 max-h-0"
                                                                >
                                                                    <div className="overflow-hidden ml-4 border-l-2 border-main-color-light pl-4 space-y-1">
                                                                        <LocalizedClientLink
                                                                            href={`/categories/${category.handle}`}
                                                                            onClick={closeMenu}
                                                                            className="block py-2 px-3 text-sm text-main-color font-medium hover:bg-main-color-light rounded-lg transition-colors"
                                                                        >
                                                                            Ver todo en {category.name}
                                                                        </LocalizedClientLink>
                                                                        {category.subcategories.map((sub) => (
                                                                            <LocalizedClientLink
                                                                                key={sub.handle}
                                                                                href={`/categories/${category.handle}/${sub.handle}`}
                                                                                onClick={closeMenu}
                                                                                className="block py-2 px-3 text-sm text-gray-600 hover:text-main-color hover:bg-gray-50 rounded-lg transition-colors"
                                                                            >
                                                                                {sub.name}
                                                                            </LocalizedClientLink>
                                                                        ))}
                                                                    </div>
                                                                </Transition>
                                                            </>
                                                        ) : (
                                                            <LocalizedClientLink
                                                                href={`/categories/${category.handle}`}
                                                                onClick={closeMenu}
                                                                className="block p-3 text-gray-700 font-medium hover:text-main-color hover:bg-gray-50 rounded-xl transition-colors"
                                                            >
                                                                {category.name}
                                                            </LocalizedClientLink>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Empty State */}
                                        {!loadingCategories && categories.length === 0 && (
                                            <p className="text-center text-gray-500 py-8">
                                                No se encontraron categorías
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-gray-100 bg-gray-50">
                                <div className="flex items-center justify-center gap-4">
                                    <a
                                        href="https://wa.me/524928690537"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        WhatsApp
                                    </a>
                                </div>
                                <p className="text-center text-xs text-gray-500 mt-3">
                                    © {new Date().getFullYear()} CuarzosMX. Todos los derechos reservados.
                                </p>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </Dialog>
            </Transition>
        </>
    )
}
