"use client"

import { Fragment, useRef, useState } from "react"
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react"
import { BarsThree, ChevronDown } from "@medusajs/icons"

const categories = [
    { nombre: "Protección", href: "/categories/proteccion" },
    { nombre: "Amor", href: "/categories/amor" },
    { nombre: "Abundancia", href: "/categories/abundancia" },
    { nombre: "Paz", href: "/categories/paz" },
    { nombre: "Salud", href: "/categories/salud" },
    { nombre: "Joyería", href: "/categories/joyeria" },
]

const CategoriesPopover = () => {
    const btnRef = useRef<HTMLButtonElement>(null)
    const [width, setWidth] = useState<number | undefined>(undefined)

    const handleOpen = () => {
        if (btnRef.current) {
            setWidth(btnRef.current.offsetWidth)
        }
    }

    return (
        <Popover className="relative">
            <PopoverButton
                ref={btnRef}
                onClick={handleOpen}
                className="flex items-center gap-2 bg-main-color text-white px-6 py-2.5 rounded-full font-semibold shadow-md hover:bg-main-color/90 transition-all duration-300 min-w-[180px] focus:outline-none"
            >
                <BarsThree className="text-lg" />
                Categorías
                <ChevronDown className="text-base ml-auto" />
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
                <PopoverPanel
                    static
                    className="absolute left-0 mt-2 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                    style={{ width: width || btnRef.current?.offsetWidth || "auto" }}
                >
                    <ul className="py-2">
                        {categories.map((cat) => (
                            <li key={cat.nombre}>
                                <a
                                    href={cat.href}
                                    className="block px-5 py-3 text-gray-700 hover:bg-main-color/10 hover:text-main-color font-medium transition-all duration-200"
                                >
                                    {cat.nombre}
                                </a>
                            </li>
                        ))}
                    </ul>
                </PopoverPanel>
            </Transition>
        </Popover>
    )
}

export default CategoriesPopover