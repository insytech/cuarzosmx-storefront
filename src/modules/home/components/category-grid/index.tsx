import { Heading } from "@medusajs/ui"

export default function CategoryGrid() {
    return (
        <section className="w-full py-12">
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
        </section>
    )
}