import { Button, Heading } from "@medusajs/ui"

const signos = [
    { nombre: "ARIES", img: "/signos/ARIES.webp" },
    { nombre: "TAURO", img: "/signos/TAURO.webp" },
    { nombre: "GEMINIS", img: "/signos/GEMINIS.webp" },
    { nombre: "CANCER", img: "/signos/CANCER.webp" },
    { nombre: "LEO", img: "/signos/LEO.webp" },
    { nombre: "VIRGO", img: "/signos/VIRGO.webp" },
    { nombre: "LIBRA", img: "/signos/LIBRA.webp" },
    { nombre: "ESCORPIO", img: "/signos/ESCORPIO.webp" },
    { nombre: "SAGITARIO", img: "/signos/SAGITARIO.webp" },
    { nombre: "CAPRICORNIO", img: "/signos/CAPRICORNIO.webp" },
    { nombre: "ACUARIO", img: "/signos/ACUARIO.webp" },
    { nombre: "PISCIS", img: "/signos/PISCIS.webp" },
]

export default function InterstitialBanner() {
    return (
        <section className="w-full py-10 md:py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="font-serenity text-center text-3xl md:text-5xl font-bold text-gray-800 mb-12">
                    Cuarzos Según tu Signo
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 justify-items-center">
                    {signos.map((signo) => (
                        <a
                            key={signo.nombre}
                            href={`/collections/${signo.nombre.toLowerCase()}`}
                            className="relative w-36 h-36 rounded-lg shadow-lg overflow-hidden flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                            tabIndex={0}
                        >
                            <img
                                src={signo.img}
                                alt={signo.nombre}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
                            <span className="relative z-10 text-white text-lg font-bold tracking-wide text-center drop-shadow-md select-none">
                                {signo.nombre}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}