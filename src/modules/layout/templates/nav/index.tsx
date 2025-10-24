import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import TopBar from "@modules/layout/components/top-bar"
import CategoriesPopover from "./categories-dropdown.tsx"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <TopBar />
      <header className="h-20 mx-auto bg-white px-8 shadow-sm">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex items-center gap-4 h-full">
            <LocalizedClientLink
              href="/"
              className="hover:opacity-80"
              data-testid="nav-store-link"
            >
              <img src="/cuarzosmx-logo.webp" alt="CuarzosMX" className="h-16" />
            </LocalizedClientLink>
          </div>
          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-center">
            <CategoriesPopover />
            <LocalizedClientLink href="/" className="font-semibold hover:underline">Inicio</LocalizedClientLink>
            <LocalizedClientLink href="/store" className="font-semibold hover:underline">Tienda</LocalizedClientLink>
            <LocalizedClientLink href="/pages" className="font-semibold hover:underline">Paginas</LocalizedClientLink>
            <LocalizedClientLink href="/about" className="font-semibold hover:underline">Acerca de Nosotros</LocalizedClientLink>
            <LocalizedClientLink href="/blog" className="font-semibold hover:underline">Blog</LocalizedClientLink>
            <LocalizedClientLink href="/contact" className="font-semibold hover:underline">Contacto</LocalizedClientLink>
          </div>
          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="flex items-center gap-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
                  </svg>
                  (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
