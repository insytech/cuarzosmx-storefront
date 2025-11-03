import { Heading } from "@medusajs/ui"

export default function EditorialBlock() {
    return (
        <section className="w-full py-16 bg-white relative overflow-hidden">
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                .float-animation {
                    animation: float 3s ease-in-out infinite;
                }
                .float-animation-delay-1 {
                    animation-delay: 0s;
                }
                .float-animation-delay-2 {
                    animation-delay: 0.5s;
                }
            `}</style>
            {/* Fondo decorativo de montaña, detrás de todo */}
            <img
                src="/block/background.webp"
                alt=""
                className="absolute left-0 bottom-0 w-full h-full object-cover pointer-events-none select-none z-0"
                style={{ maxHeight: "100%", minHeight: "400px" }}
            />
            <div className="section-container max-w-[1600px] mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
                    {/* Columna Izquierda - Texto */}
                    <div className="space-y-6 z-20">
                        <Heading
                            level="h2"
                            className="text-3xl md:text-5xl font-extrabold text-left text-gray-800 leading-tight"
                        >
                            ENERGÍA DE LOS<br />CUARZOS
                        </Heading>
                        <p className="text-lg text-gray-700 leading-relaxed font-normal">
                            Debido a las propiedades físicas y químicas, creemos que los <b className="font-bold text-gray-800">minerales son capaces de absorber diferentes energías y vibraciones</b>, además, tienen propiedades como sanación, protección.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed font-normal">
                            Cuentan con la <b className="font-bold text-gray-800">habilidad de controlar energías</b>. Antiguas civilizaciones lo usaban en joyería y amuletos para la sanación física y mental, así como para alejar las energías negativas.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed font-normal">
                            El significado y las propiedades energéticas de nuestros <b className="font-bold text-gray-800">cuarzos varían</b> según sus <b className="font-bold text-gray-800">colores, por lo que te explicaremos algunos</b>.
                        </p>
                        <ul className="text-lg text-gray-700 leading-relaxed list-disc pl-6 font-normal">
                            <li><span className="text-sky-700 font-semibold">Blanco</span> / <span className="text-sky-700">Paz</span>, purificación y serenidad.</li>
                            <li><span className="text-pink-600 font-semibold">Rosa</span> / Amor, buenos sentimientos y equilibrio emocional.</li>
                            <li><span className="text-blue-600 font-semibold">Azul</span> / Calma, sabiduría y comunicación.</li>
                            <li><span className="text-green-600 font-semibold">Verde</span> / Salud, equilibrio y tranquilidad.</li>
                            <li><span className="text-purple-600 font-semibold">Morado o lila</span> / Transmutación. Intuición y espiritualidad.</li>
                            <li><span className="text-orange-500 font-semibold">Naranja</span> / Alegría y creatividad.</li>
                            <li><span className="text-yellow-500 font-semibold">Amarillo</span> / Prosperidad, abundancia y realización.</li>
                            <li><span className="text-gray-900 font-semibold">Negro</span> / Protección, bloquea malas energías.</li>
                        </ul>
                    </div>

                    {/* Columna Derecha - Fondo decorativo y Imágenes */}
                    <div className="relative flex items-center justify-center min-h-[480px] md:min-h-[520px] px-8">
                        {/* Fondo blanco con sombra suave */}
                        {/* <div className="absolute inset-0 rounded-3xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-5" /> */}

                        {/* Círculo principal grande */}
                        <div className="relative z-20 rounded-full border-[16px] border-white shadow-2xl w-[420px] h-[420px] flex items-center justify-center flex-shrink-0 float-animation float-animation-delay-1">
                            <img
                                src="/block/cuarzo-amatista-piedras-preciosas-3.webp"
                                alt="Cuarzo principal"
                                className="object-cover w-[450px] h-[450px] rounded-full"
                            />
                        </div>

                        {/* Imagen superior izquierda */}
                        <div className="absolute top-20 -left-4 md:left-20 z-30 flex items-center justify-center float-animation float-animation-delay-2">
                            <div className="rounded-full border-[3px] border-white shadow-xl w-[150px] h-[150px] flex items-center justify-center">
                                <img
                                    src="/block/cuarzo-amatista-piedras-preciosas-1.webp"
                                    alt="Cuarzo verde"
                                    className="object-cover w-[150px] h-[150px] rounded-full"
                                />
                            </div>
                        </div>

                        {/* Imagen inferior derecha */}
                        <div className="absolute bottom-20 -right-4 md:right-20 z-30 flex items-center justify-center float-animation float-animation-delay-2">
                            <div className="rounded-full border-[3px] border-white shadow-xl w-[150px] h-[150px]  flex items-center justify-center">
                                <img
                                    src="/block/cuarzo-amatista-piedras-preciosas-2.webp"
                                    alt="Cuarzo negro"
                                    className="object-cover w-[150px] h-[150px] rounded-full"
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}