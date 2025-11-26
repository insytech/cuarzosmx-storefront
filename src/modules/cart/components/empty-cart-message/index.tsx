import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4" data-testid="empty-cart-message">
      {/* Empty Cart Illustration */}
      <div className="w-32 h-32 sm:w-40 sm:h-40 bg-main-color-light rounded-full flex items-center justify-center mb-6">
        <svg className="w-16 h-16 sm:w-20 sm:h-20 text-main-color" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      </div>

      <h2 className="text-2xl sm:text-3xl font-serenity font-bold text-gray-900 mb-3 text-center">
        Tu carrito está vacío
      </h2>

      <p className="text-gray-500 text-center max-w-md mb-8">
        Parece que aún no has agregado ningún producto a tu carrito.
        ¡Explora nuestra colección de cuarzos y encuentra el perfecto para ti!
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <LocalizedClientLink
          href="/store"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-main-color hover:bg-main-color-dark text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Explorar productos
        </LocalizedClientLink>

        <LocalizedClientLink
          href="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 hover:border-main-color text-gray-700 hover:text-main-color font-semibold rounded-xl transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Volver al inicio
        </LocalizedClientLink>
      </div>

      {/* Suggestions */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-400 mb-4">¿Necesitas ayuda?</p>
        <a
          href="https://wa.me/524928690537?text=Hola! Necesito ayuda para encontrar un cuarzo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Escríbenos por WhatsApp
        </a>
      </div>
    </div>
  )
}

export default EmptyCartMessage
