import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { fetchBannerSections } from "@util/banner-api"

// Default intentions - Paz removed per user request
const defaultIntenciones = [
    {
        handle: "proteccion",
        nombre: "Protección",
        descripcion: "Escudo contra energías negativas",
        imagen: "/categorias/PROTECCION.webp",
        href: "/categories/proteccion"
    },
    {
        handle: "amor",
        nombre: "Amor",
        descripcion: "Atrae amor y armonía a tu vida",
        imagen: "/categorias/AMOR.webp",
        href: "/categories/amor-y-armonia"
    },
    {
        handle: "abundancia",
        nombre: "Abundancia",
        descripcion: "Prosperidad y éxito desde el interior",
        imagen: "/categorias/ABUNDANCIA.webp",
        href: "/categories/abundancia"
    },
    {
        handle: "salud",
        nombre: "Salud",
        descripcion: "Bienestar físico y mental",
        imagen: "/categorias/SALUD.webp",
        href: "/categories/salud-y-tranquilidad"
    },
]

// Default lifestyle content
const defaultLifestyle = {
    title: "Vive en Armonía con la\nEnergía de los Cuarzos",
    subtitle: "Cada piedra guarda un propósito especial para acompañarte en tu camino espiritual",
    backgroundImage: "/inicio-1.webp"
}

interface IntentionBanner {
    handle: string
    name: string
    description?: string
    image_url?: string
    link: string
}

interface LifestyleContent {
    title?: string
    subtitle?: string
    background_image_url?: string
}

export default async function LifestyleBlock() {
    const data = await fetchBannerSections()
    const intentionBanners: IntentionBanner[] = data.intentions || []
    const lifestyleContent: LifestyleContent | null = data.lifestyle || null

    // Merge API data with defaults for intentions
    const intenciones = defaultIntenciones.map(defaultInt => {
        const apiInt = intentionBanners.find(i => i.handle === defaultInt.handle)
        return {
            ...defaultInt,
            nombre: apiInt?.name || defaultInt.nombre,
            descripcion: apiInt?.description || defaultInt.descripcion,
            imagen: apiInt?.image_url || defaultInt.imagen,
        }
    })

    // Get lifestyle content with fallbacks
    const title = lifestyleContent?.title || defaultLifestyle.title
    const subtitle = lifestyleContent?.subtitle || defaultLifestyle.subtitle
    const backgroundImage = lifestyleContent?.background_image_url || defaultLifestyle.backgroundImage

    return (
        <section className="w-full">
            {/* Parte 1 - Banner Inspiracional con Texto Superpuesto */}
            <div className="relative">
                <div className="relative h-[400px] md:h-[500px] overflow-hidden bg-black">
                    <img
                        src={backgroundImage}
                        alt="Estilo de vida con cuarzos"
                        width={800}
                        height={500}
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                        <span className="text-white/80 uppercase tracking-[0.3em] text-sm mb-4 font-light drop-shadow-md">
                            Conecta con tu esencia
                        </span>
                        <Heading
                            level="h2"
                            className="font-serenity text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-2xl max-w-4xl whitespace-pre-line leading-tight md:leading-normal"
                        >
                            {title}
                        </Heading>
                        <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-8 font-light drop-shadow-md">
                            {subtitle}
                        </p>
                        <LocalizedClientLink href="/store">
                            <Button className="bg-white text-gray-800 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105">
                                Explorar Colección
                            </Button>
                        </LocalizedClientLink>
                    </div>
                </div>
            </div>

            {/* Parte 2 - Grilla de Intenciones/Propósitos */}
            <div className="py-16 bg-light-gray">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <Heading
                            level="h2"
                            className="font-serenity text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight md:leading-normal"
                        >
                            Encuentra tu<br className="md:hidden" /> Intención
                        </Heading>
                        <div className="flex justify-center mb-4">
                            <div className="h-1 w-16 bg-main-color rounded-full" />
                        </div>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Elige el propósito que resuena con tu alma y descubre los cuarzos perfectos para ti
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {intenciones.map((intencion) => (
                            <LocalizedClientLink
                                key={intencion.handle}
                                href={intencion.href}
                                className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <img
                                    src={intencion.imagen}
                                    alt={intencion.nombre}
                                    width={400}
                                    height={400}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                                <div className="absolute inset-0 flex flex-col justify-end p-4">
                                    <h3 className="text-white font-bold text-lg md:text-xl mb-1 drop-shadow-lg">
                                        {intencion.nombre}
                                    </h3>
                                    <p className="text-white/80 text-xs md:text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md">
                                        {intencion.descripcion}
                                    </p>
                                </div>
                            </LocalizedClientLink>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}