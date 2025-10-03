"use client"

import { Fragment, useRef, useState } from "react"
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react"
import { BarsThree, ChevronDown } from "@medusajs/icons"

const categories = [
    "Best seller",
    "Trending this week",
    "Back in stock",
    "Woman’s clothing",
    "Man’s clothing",
    "Kid’s clothing",
    "New arrival",
    "Shoes & accessoories",
    "Oversized",
    "Work outfits",
    "The gift shop",
    "Premium Cloth",
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
                className="flex items-center gap-2 bg-white text-gray-800 px-6 py-2 rounded-xl font-semibold shadow hover:bg-gray-100 transition min-w-[180px] focus:outline-none"
            >
                <BarsThree className="text-lg" />
                Categorías
                <ChevronDown className="text-base ml-2" />
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
                    className="absolute left-0 mt-2 z-50 bg-white rounded-b-xl shadow-lg border border-purple"
                    style={{ width: width || btnRef.current?.offsetWidth || "auto" }}
                >
                    <ul className="py-2">
                        {categories.map((cat) => (
                            <li key={cat}>
                                <a
                                    href={`/category/${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, "-"))}`}
                                    className="block px-5 py-2 text-gray-800 hover:bg-purple-50 hover:text-purple-700 transition"
                                >
                                    {cat}
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