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
      <header className="h-20 mx-auto bg-white px-8 ">
        <nav className="flex items-center justify-between w-full h-full max-w-8xl mx-24">
          {/* Logo */}
          <div className="flex-shrink-0 pr-4">
            <LocalizedClientLink
              href="/"
              className="hover:opacity-80 transition-opacity"
              data-testid="nav-store-link"
            >
              <img src="/cuarzosmx-logo.webp" alt="CuarzosMX" className="h-14" />
            </LocalizedClientLink>
          </div>
          <div className="flex-shrink-0 pr-8">
            <LocalizedClientLink
              href="/"
              className="hover:opacity-80 transition-opacity"
              data-testid="nav-store-link"
            >
              <img src="/TIPO BLACK.webp" alt="CuarzosMX Logotype" className="h-9" />

            </LocalizedClientLink>
          </div>

          {/* Navegación Central */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            <CategoriesPopover />
            <LocalizedClientLink href="/" className=" font-semibold text-gray-700 hover:text-gray-900 transition-colors">
              Inicio
            </LocalizedClientLink>
            <LocalizedClientLink href="/store" className=" font-semibold text-gray-700 hover:text-gray-900 transition-colors">
              Tienda
            </LocalizedClientLink>
            <LocalizedClientLink href="/pages" className=" font-semibold text-gray-700 hover:text-gray-900 transition-colors">
              Páginas
            </LocalizedClientLink>
            <LocalizedClientLink href="/about" className=" font-semibold text-gray-700 hover:text-gray-900 transition-colors">
              Acerca de Nosotros
            </LocalizedClientLink>
            <LocalizedClientLink href="/blog" className=" font-semibold text-gray-700 hover:text-gray-900 transition-colors">
              Blog
            </LocalizedClientLink>
            <LocalizedClientLink href="/contact" className=" font-semibold text-gray-700 hover:text-gray-900 transition-colors">
              Contacto
            </LocalizedClientLink>
          </div>

          {/* Acciones Derecha */}
          <div className="flex items-center gap-6 pl-8">
            {/* Buscador */}
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors" title="Buscar">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {/* Carrito */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1"
                  href="/cart"
                  data-testid="nav-cart-link"
                  title="Mi Carrito"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
                  </svg>
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
