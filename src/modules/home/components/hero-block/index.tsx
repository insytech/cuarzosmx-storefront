import { Button, Heading } from "@medusajs/ui"

export default function HeroBlock() {
    return (
        <section className="w-full min-h-[600px] lg:min-h-[800px] flex flex-col lg:flex-row px-32 gap-2">
            {/* Columna Izquierda: 50% en desktop, 100% en móvil */}
            <div className="w-full lg:w-1/2 aspect-square flex items-center justify-center bg-main-color-light relative p-2">
                <div className="max-w-lg px-6 py-12 w-full">
                    <Heading level="h1" className="text-3xl md:text-5xl font-bold mb-4 text-main-color-dark">
                        [Título H1]
                    </Heading>
                    <p className="text-base md:text-xl mb-6 text-main-color-dark">
                        [Párrafo Corto]
                    </p>
                    <Button className="bg-main-color text-white px-8 py-3 rounded-large shadow-lg">
                        [Botón CTA]
                    </Button>
                </div>
            </div>

            {/* Columna Central: 25% en desktop, 100% en móvil */}
            <div className="w-full lg:w-1/4 min-h-[180px] flex flex-col gap-2">
                {/* Sección superior */}
                <div className="aspect-square flex items-center justify-center bg-quartz-pink border-b border-beige p-2">
                    <div className="w-24 h-24 rounded-lg bg-quartz-red/60 flex items-center justify-center">
                        <span className="text-main-color-dark text-sm">[Placeholder]</span>
                    </div>
                </div>
                {/* Sección inferior */}
                <div className="aspect-square flex items-center justify-center bg-quartz-green p-2">
                    <div className="w-24 h-24 rounded-lg bg-main-color-light/60 flex items-center justify-center">
                        <span className="text-main-color-dark text-sm">[Placeholder]</span>
                    </div>
                </div>
            </div>

            {/* Columna Derecha: 25% en desktop, 100% en móvil */}
            <div className="w-full lg:w-1/4 min-h-[180px] flex flex-col gap-2">
                {/* Sección superior */}
                <div className="aspect-square flex items-center justify-center bg-gold border-b border-beige p-2">
                    <div className="w-24 h-24 rounded-lg bg-beige/60 flex items-center justify-center">
                        <span className="text-main-color-dark text-sm">[Placeholder]</span>
                    </div>
                </div>
                {/* Sección inferior */}
                <div className="aspect-square flex items-center justify-center bg-light-gray p-2">
                    <div className="w-24 h-24 rounded-lg bg-main-color/20 flex items-center justify-center">
                        <span className="text-main-color-dark text-sm">[Placeholder]</span>
                    </div>
                </div>
            </div>
        </section>
    )
}