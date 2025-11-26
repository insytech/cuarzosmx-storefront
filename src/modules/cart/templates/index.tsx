import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="content-container py-6 sm:py-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <LocalizedClientLink href="/" className="hover:text-main-color transition-colors">
              Inicio
            </LocalizedClientLink>
            <span>/</span>
            <span className="text-gray-900">Carrito</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-main-color-light rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-main-color" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serenity font-bold text-gray-900">
                Mi Carrito
              </h1>
              <p className="text-sm text-gray-500">
                {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="content-container py-6 sm:py-10" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Items Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
                <ItemsTemplate cart={cart} />
              </div>

              {/* Continue Shopping */}
              <div className="mt-6 flex items-center gap-2">
                <LocalizedClientLink
                  href="/store"
                  className="inline-flex items-center gap-2 text-main-color hover:text-main-color-dark transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continuar comprando
                </LocalizedClientLink>
              </div>
            </div>

            {/* Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:sticky lg:top-24">
                {cart?.region && (
                  <Summary cart={cart as any} />
                )}
              </div>

              {/* Trust Badges */}
              <div className="mt-4 bg-white rounded-2xl shadow-sm p-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">Pago Seguro</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">Envío Rápido</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">100% Original</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyCartMessage />
        )}
      </div>
    </div>
  )
}

export default CartTemplate
