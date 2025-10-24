import { Button, Heading } from "@medusajs/ui"

export default function LifestyleBlock() {
    return (
        <section className="w-full">
            {/* Parte 1 - Banner con Texto Superpuesto */}
            <div className="relative py-20">
                <div className="bg-gray-400 h-96">
                    <div className="absolute inset-0 flex flex-col justify-center items-center">
                        <Heading level="h2" className="text-3xl md:text-5xl font-bold mb-4 text-white">
                            [Título H2 Superpuesto]
                        </Heading>
                        <Button className="btn-primary">
                            [Botón CTA]
                        </Button>
                    </div>
                </div>
            </div>

            {/* Parte 2 - Grilla de Categorías */}
            <div className="py-12">
                <div className="section-container">
                    <div className="text-center mb-8">
                        <Heading level="h2" className="text-3xl md:text-4xl font-bold">
                            [Título de Sección H2]
                        </Heading>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }, (_, i) => (
                            <div key={i} className="aspect-square bg-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative">
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                        <div className="w-12 h-12 bg-gray-400 rounded-full mx-auto mb-2" />
                                        <span className="text-sm">[Imagen]</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}