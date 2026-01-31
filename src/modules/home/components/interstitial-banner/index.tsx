import { fetchBannerSections } from "@util/banner-api"

// Default zodiac signs
const defaultSignos = [
    { handle: "aries", nombre: "ARIES", img: "/signos/ARIES.webp" },
    { handle: "tauro", nombre: "TAURO", img: "/signos/TAURO.webp" },
    { handle: "geminis", nombre: "GÉMINIS", img: "/signos/GEMINIS.webp" },
    { handle: "cancer", nombre: "CÁNCER", img: "/signos/CANCER.webp" },
    { handle: "leo", nombre: "LEO", img: "/signos/LEO.webp" },
    { handle: "virgo", nombre: "VIRGO", img: "/signos/VIRGO.webp" },
    { handle: "libra", nombre: "LIBRA", img: "/signos/LIBRA.webp" },
    { handle: "escorpio", nombre: "ESCORPIO", img: "/signos/ESCORPIO.webp" },
    { handle: "sagitario", nombre: "SAGITARIO", img: "/signos/SAGITARIO.webp" },
    { handle: "capricornio", nombre: "CAPRICORNIO", img: "/signos/CAPRICORNIO.webp" },
    { handle: "acuario", nombre: "ACUARIO", img: "/signos/ACUARIO.webp" },
    { handle: "piscis", nombre: "PISCIS", img: "/signos/PISCIS.webp" },
]

interface ZodiacBanner {
    handle: string
    name: string
    image_url?: string
}

export default async function InterstitialBanner() {
    const data = await fetchBannerSections()
    const zodiacBanners: ZodiacBanner[] = data.zodiac || []

    // Merge API data with defaults
    const signos = defaultSignos.map(defaultSign => {
        const apiSign = zodiacBanners.find(z => z.handle === defaultSign.handle)
        return {
            ...defaultSign,
            nombre: apiSign?.name || defaultSign.nombre,
            img: apiSign?.image_url || defaultSign.img,
        }
    })

    return (
        <section className="w-full py-10 md:py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="font-serenity text-center text-3xl md:text-5xl font-bold text-gray-800 mb-12">
                    Cuarzos Según tu Signo
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 md:gap-6 justify-items-center">
                    {signos.map((signo) => (
                        <a
                            key={signo.handle}
                            href={`/collections/${signo.handle}`}
                            className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-lg shadow-lg overflow-hidden flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                            tabIndex={0}
                        >
                            <img
                                src={signo.img}
                                alt={signo.nombre}
                                width={128}
                                height={128}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                            />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}