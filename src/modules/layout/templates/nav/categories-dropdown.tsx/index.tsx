"use client"

import { Fragment, useState } from "react"
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react"
import { BarsThree, ChevronDown, ChevronRight } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type SubCategory = {
    nombre: string
    handle: string
}

type Category = {
    nombre: string
    handle: string
    subcategorias?: SubCategory[]
}

const categories: Category[] = [
    {
        nombre: "Cuarzos Decorativos",
        handle: "cuarzos-decorativos",
        subcategorias: [
            { nombre: "Decoración", handle: "decoracion" },
            { nombre: "Especímenes de Colección", handle: "especimenes-de-coleccion" },
            { nombre: "Variedades", handle: "variedades" },
        ],
    },
    {
        nombre: "Cuarzos por Kilo",
        handle: "cuarzos-por-kilo",
    },
    {
        nombre: "Puntas y Chakras",
        handle: "puntas-y-chakras",
        subcategorias: [
            { nombre: "Alineación de Chakras", handle: "alineacion-de-chakras" },
            { nombre: "Puntas", handle: "puntas" },
            { nombre: "Esferas", handle: "esferas" },
            { nombre: "Símbolos Sagrados", handle: "simbolos-sagrados" },
            { nombre: "Masajeadores", handle: "masajeadores" },
            { nombre: "Péndulos", handle: "pendulos" },
            { nombre: "Pirámides", handle: "piramides" },
        ],
    },
    {
        nombre: "Protección",
        handle: "proteccion",
        subcategorias: [
            { nombre: "Para el Trabajo", handle: "para-el-trabajo" },
            { nombre: "Para el Hogar", handle: "para-el-hogar" },
        ],
    },
    {
        nombre: "Amor y Armonía",
        handle: "amor-y-armonia",
        subcategorias: [
            { nombre: "Para el Amor", handle: "para-el-amor" },
            { nombre: "Armonía en el Hogar", handle: "armonia-en-el-hogar" },
        ],
    },
    {
        nombre: "Salud y Tranquilidad",
        handle: "salud-y-tranquilidad",
        subcategorias: [
            { nombre: "Para la Salud", handle: "para-la-salud" },
            { nombre: "Para la Ansiedad", handle: "para-la-ansiedad" },
            { nombre: "Para el Estrés", handle: "para-el-estres" },
        ],
    },
    {
        nombre: "Abundancia",
        handle: "abundancia",
        subcategorias: [
            { nombre: "Abundancia Económica", handle: "abundancia-economica" },
            { nombre: "Prosperidad en el Trabajo", handle: "prosperidad-en-el-trabajo" },
        ],
    },
    {
        nombre: "Joyería",
        handle: "joyeria",
        subcategorias: [
            { nombre: "Anillos", handle: "anillos" },
            { nombre: "Collares", handle: "collares" },
            { nombre: "Pulseras", handle: "pulseras" },
            { nombre: "Aretes", handle: "aretes" },
        ],
    },
]

const CategoriesPopover = () => {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

    return (
        <Popover className="relative">
            {({ open, close }) => (
                <>
                    <PopoverButton className="flex items-center gap-2 bg-main-color text-white px-6 py-2.5 rounded-full font-semibold shadow-md hover:bg-main-color/90 transition-all duration-300 min-w-[180px] focus:outline-none">
                        <BarsThree className="text-lg" />
                        Categorías
                        <ChevronDown className={`text-base ml-auto transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                    </PopoverButton>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 -translate-y-2"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 -translate-y-2"
                    >
                        <PopoverPanel className="absolute left-0 mt-2 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-[320px] max-h-[600px] overflow-y-auto">
                            <div className="py-2">
                                {categories.map((cat) => (
                                    <div key={cat.handle} className="border-b border-gray-100 last:border-b-0">
                                        {/* Categoría Principal */}
                                        <div className="flex items-center justify-between">
                                            <LocalizedClientLink
                                                href={`/categories/${cat.handle}`}
                                                className="flex-1 block px-5 py-3 text-gray-800 hover:bg-main-color/10 hover:text-main-color font-semibold transition-all duration-200"
                                                onClick={() => close()}
                                            >
                                                {cat.nombre}
                                            </LocalizedClientLink>
                                            {cat.subcategorias && cat.subcategorias.length > 0 && (
                                                <button
                                                    onClick={() =>
                                                        setExpandedCategory(
                                                            expandedCategory === cat.handle ? null : cat.handle
                                                        )
                                                    }
                                                    className="px-3 py-3 text-gray-500 hover:text-main-color transition-colors"
                                                >
                                                    <ChevronRight
                                                        className={`w-4 h-4 transition-transform duration-200 ${expandedCategory === cat.handle ? "rotate-90" : ""
                                                            }`}
                                                    />
                                                </button>
                                            )}
                                        </div>

                                        {/* Subcategorías */}
                                        {cat.subcategorias && expandedCategory === cat.handle && (
                                            <div className="bg-gray-50 border-t border-gray-100">
                                                {cat.subcategorias.map((subcat) => (
                                                    <LocalizedClientLink
                                                        key={subcat.handle}
                                                        href={`/categories/${cat.handle}/${subcat.handle}`}
                                                        className="block px-8 py-2.5 text-sm text-gray-600 hover:bg-main-color/10 hover:text-main-color transition-all duration-200"
                                                        onClick={() => close()}
                                                    >
                                                        • {subcat.nombre}
                                                    </LocalizedClientLink>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </PopoverPanel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}

export default CategoriesPopover