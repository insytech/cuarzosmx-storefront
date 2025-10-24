import { Button, Heading } from "@medusajs/ui"

export default function EditorialBlock() {
    return (
        <section className="w-full py-16">
            <div className="section-container">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Columna Izquierda - Texto */}
                    <div className="space-y-6">
                        <Heading level="h2" className="text-3xl md:text-4xl font-bold text-left">
                            [Título H2]
                        </Heading>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            [Párrafo de Texto]
                        </p>
                        <Button className="btn-secondary">
                            [Botón CTA]
                        </Button>
                    </div>

                    {/* Columna Derecha - Imagen */}
                    <div className="relative">
                        <div className="aspect-square bg-gray-300 rounded-lg overflow-hidden">
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <div className="w-20 h-20 bg-gray-400 rounded-full mx-auto mb-4" />
                                    <span className="text-lg">[Imagen]</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}