import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function HeroBlock() {
    return (
        <section className="w-full min-h-[600px] lg:min-h-[800px] flex flex-col lg:flex-row px-32 gap-2">
            {/* Columna Izquierda: 50% en desktop, 100% en móvil */}
            <LocalizedClientLink
                href="/collections/promo-1"
                className="w-full lg:w-1/2 aspect-square flex items-center justify-center bg-main-color-light relative p-2"
            >
                <img
                    src="/promo/promo-1.webp"
                    alt="Promo 1"
                    className="w-full h-full object-cover rounded-lg"
                />
            </LocalizedClientLink>

            {/* Columna Central: 25% en desktop, 100% en móvil */}
            <div className="w-full lg:w-1/4 min-h-[180px] flex flex-col gap-2">
                {/* Sección superior */}
                <div className="aspect-square flex items-center justify-center bg-quartz-pink border-b border-beige p-2 relative">
                    <img
                        src="/promo/promo-2.webp"
                        alt="Promo 2"
                        className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4 rounded-lg">
                        <Button className="bg-white text-main-color-dark px-4 py-2 rounded-large shadow-lg hover:bg-gray-100">
                            Comprar Ahora
                        </Button>
                    </div>
                </div>
                {/* Sección inferior */}
                <div className="aspect-square flex items-center justify-center bg-quartz-green p-2 relative">
                    <img
                        src="/promo/promo-3.webp"
                        alt="Promo 3"
                        className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4 rounded-lg">
                        <Button className="bg-white text-main-color-dark px-4 py-2 rounded-large shadow-lg hover:bg-gray-100">
                            Descubre Más
                        </Button>
                    </div>
                </div>
            </div>

            {/* Columna Derecha: 25% en desktop, 100% en móvil */}
            <div className="w-full lg:w-1/4 min-h-[180px] flex flex-col gap-2">
                {/* Sección superior */}
                <div className="aspect-square flex items-center justify-center bg-gold border-b border-beige p-2 relative">
                    <img
                        src="/promo/promo-4.webp"
                        alt="Promo 4"
                        className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4 rounded-lg">
                        <Button className="bg-white text-main-color-dark px-4 py-2 rounded-large shadow-lg hover:bg-gray-100">
                            Oferta Especial
                        </Button>
                    </div>
                </div>
                {/* Sección inferior */}
                <div className="aspect-square flex items-center justify-center bg-light-gray p-2 relative">
                    <img
                        src="/promo/promo-5.webp"
                        alt="Promo 5"
                        className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4 rounded-lg">
                        <Button className="bg-white text-main-color-dark px-4 py-2 rounded-large shadow-lg hover:bg-gray-100">
                            Ver Detalles
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}