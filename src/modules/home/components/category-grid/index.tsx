import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const categorias = [
    {
        nombre: "Artesanías",
        descripcion: "Piezas hechas a mano con amor",
        imagen: "/categorias/ARTESANIAS.webp",
        href: "/categories/artesanias"
    },
    {
        nombre: "Decorativos",
        descripcion: "Armoniza tus espacios con estilo",
        imagen: "/categorias/DECORATIVOS.webp",
        href: "/categories/decorativos"
    },
    {
        nombre: "Figuras",
        descripcion: "Formas únicas de la naturaleza",
        imagen: "/categorias/FIGURAS.webp",
        href: "/categories/figuras"
    },
    {
        nombre: "Péndulos",
        descripcion: "Herramientas de conexión espiritual",
        imagen: "/categorias/PENDULOS.webp",
        href: "/categories/pendulos"
    },
]

export default function CategoryGrid() {
    return (
        <section className="w-full py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-12">
                    <Heading
                        level="h2"
                        className="font-serenity text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4"
                    >
                        Explora Nuestras Categorías
                    </Heading>
                    <div className="flex justify-center mb-4">
                        <div className="h-1 w-16 bg-main-color rounded-full" />
                    </div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Descubre la variedad de cuarzos y productos espirituales que tenemos para ti
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {categorias.map((categoria) => (
                        <LocalizedClientLink
                            key={categoria.nombre}
                            href={categoria.href}
                            className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                        >
                            <img
                                src={categoria.imagen}
                                alt={categoria.nombre}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-300" />
                            <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                                <div className="transform transition-transform duration-300 group-hover:translate-y-[-8px]">
                                    <h3 className="text-white font-bold text-xl md:text-2xl mb-2 drop-shadow-lg">
                                        {categoria.nombre}
                                    </h3>
                                    <p className="text-white/80 text-sm md:text-base font-light opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        {categoria.descripcion}
                                    </p>
                                    <div className="mt-3 flex items-center text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                                        <span>Ver productos</span>
                                        <svg className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </LocalizedClientLink>
                    ))}
                </div>
            </div>
        </section>
    )
}