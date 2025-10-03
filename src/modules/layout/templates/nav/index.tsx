import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <div className="bg-purple text-white text-center text-xs py-2 font-semibold flex justify-center items-center gap-2">
        <span>20 % De descuento en la compra de 12 o mas productos</span>
        <span className="ml-auto mr-4 font-bold">MXN</span>
      </div>
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
          {/* Buscador */}
          <div className=" gap-x-6 flex-1 flex justify-center">
            <div className="flex bg-gray-50 rounded-md overflow-hidden border border-gray-200">
              <span className="flex items-center px-3 text-gray-400">
                <svg width="18" height="18" fill="none" stroke="currentColor"><circle cx="8" cy="8" r="7" strokeWidth="2" /><path d="M17 17L13.5 13.5" strokeWidth="2" strokeLinecap="round" /></svg>
              </span>
              <input
                type="text"
                placeholder="Buscar tu producto favorito..."
                className="bg-transparent px-2 py-2 outline-none w-56 md:w-80"
              />
              <select className="bg-transparent px-2 py-2 outline-none border-l border-gray-200 text-gray-500">
                <option>Seleccionar Categoría</option>
                //TODO: Llenar con categorias de productos desde DB
              </select>
            </div>
          </div>
          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                Cuenta
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Carrito (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
      {/* Barra secundaria */}
      <nav className="bg-purple text-white flex items-center justify-between px-8 py-2">
        <div className="flex items-center gap-6">
          <SideMenu regions={regions} /> {/* TODO: Cambiar por un desplegable hacia abajo con las categorías */}
          <LocalizedClientLink href="/" className="font-semibold hover:underline">Inicio</LocalizedClientLink>
          <LocalizedClientLink href="/store" className="font-semibold hover:underline">Tienda</LocalizedClientLink>
          <LocalizedClientLink href="/pages" className="font-semibold hover:underline">Paginas</LocalizedClientLink>
          <LocalizedClientLink href="/about" className="font-semibold hover:underline">Acerca de Nosotros</LocalizedClientLink>
          <LocalizedClientLink href="/blog" className="font-semibold hover:underline">Blog</LocalizedClientLink>
          <LocalizedClientLink href="/contact" className="font-semibold hover:underline">Contacto</LocalizedClientLink>
        </div>
        <LocalizedClientLink href="/store" className="bg-white text-purple px-6 py-2 rounded-full font-semibold shadow hover:bg-gray-100 transition">
          Comprar Ahora
        </LocalizedClientLink>
      </nav>
    </div>
  )
}
