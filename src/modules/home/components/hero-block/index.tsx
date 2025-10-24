import { Button, Heading } from "@medusajs/ui"

export default function HeroBlock() {
    return (
        <section className="w-full py-12">
            <div className="section-container">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[500px]">
                    {/* Columna Izquierda - 2/3 */}
                    <div className="lg:col-span-2 relative">
                        <div className="h-full bg-gray-300 rounded-lg overflow-hidden relative">
                            <div className="absolute inset-0 bg-black/20 flex flex-col justify-center p-8">
                                <div className="max-w-lg">
                                    <Heading level="h1" className="text-4xl md:text-5xl font-bold mb-4 text-white">
                                        [Título H1]
                                    </Heading>
                                    <p className="text-lg md:text-xl mb-6 text-white">
                                        [Párrafo Corto]
                                    </p>
                                    <Button className="btn-primary">
                                        [Botón CTA]
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha - 1/3 */}
                    <div className="lg:col-span-1">
                        <div className="flex flex-col space-y-4 h-full">
                            {/* Imagen 1 */}
                            <div className="bg-gray-300 rounded-lg overflow-hidden aspect-square relative">
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                        <div className="w-12 h-12 bg-gray-400 rounded-full mx-auto mb-2" />
                                        <span className="text-sm">[Placeholder Imagen]</span>
                                    </div>
                                </div>
                            </div>

                            {/* Imagen 2 */}
                            <div className="bg-gray-300 rounded-lg overflow-hidden aspect-square relative">
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                        <div className="w-12 h-12 bg-gray-400 rounded-full mx-auto mb-2" />
                                        <span className="text-sm">[Placeholder Imagen]</span>
                                    </div>
                                </div>
                            </div>

                            {/* Imagen 3 */}
                            <div className="bg-gray-300 rounded-lg overflow-hidden aspect-square relative">
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                        <div className="w-12 h-12 bg-gray-400 rounded-full mx-auto mb-2" />
                                        <span className="text-sm">[Placeholder Imagen]</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}