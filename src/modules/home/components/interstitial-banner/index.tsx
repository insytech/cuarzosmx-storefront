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

async function fetchZodiacBanners(): Promise<ZodiacBanner[]> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
        const response = await fetch(`${baseUrl}/store/banners/sections`, {
            next: { revalidate: 60 },
            headers: {
                "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
            },
        })

        if (response.ok) {
            const data = await response.json()
            return data.zodiac || []
        }
    } catch (error) {
        console.error("Error fetching zodiac banners:", error)
    }
    return []
}

export default async function InterstitialBanner() {
    const zodiacBanners = await fetchZodiacBanners()

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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 justify-items-center">
                    {signos.map((signo) => (
                        <a
                            key={signo.handle}
                            href={`/collections/${signo.handle}`}
                            className="relative w-36 h-36 rounded-lg shadow-lg overflow-hidden flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                            tabIndex={0}
                        >
                            <img
                                src={signo.img}
                                alt={signo.nombre}
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