import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-gray-50 relative small:min-h-screen">
      <div className="h-16 bg-white border-b border-gray-100 shadow-sm">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-small-semi text-gray-600 flex items-center gap-x-2 flex-1 basis-0 hover:text-main-color transition-colors"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block txt-compact-plus">
              Volver al carrito
            </span>
            <span className="mt-px block small:hidden txt-compact-plus">
              Volver
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="flex items-center"
            data-testid="store-link"
          >
            <img src="/cuarzosmx-logo.webp" alt="CuarzosMX" className="h-10" />
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
      <div className="py-6 w-full flex flex-col items-center justify-center bg-white border-t border-gray-100">
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} CuarzosMX. Todos los derechos reservados.</p>
      </div>
    </div>
  )
}
