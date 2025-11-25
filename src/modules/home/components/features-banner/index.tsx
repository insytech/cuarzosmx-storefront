import { TruckIcon, HeartIcon, GlobeAltIcon, SparklesIcon } from "@heroicons/react/24/outline"

const features = [
    {
        icon: <HeartIcon className="text-main-color w-14 h-14" />,
        title: "Productos de calidad",
        description: "Cuarzos y joyería seleccionados cuidadosamente",
    },
    {
        icon: <TruckIcon className="text-main-color w-14 h-14" />,
        title: "Envío en toda la República",
        description: "Recibe tu pedido en cualquier estado de México",
    },
    {
        icon: <GlobeAltIcon className="text-main-color w-14 h-14" />,
        title: "Sustentabilidad",
        description: "Compromiso con el planeta",
    },
    {
        icon: <SparklesIcon className="text-main-color w-14 h-14" />,
        title: "Energía espiritual",
        description: "Conecta con la esencia de cada cuarzo",
    },
]

export default function FeaturesBanner() {
    return (
        <section className="w-full bg-white py-8">
            <div className="max-w-8xl mx-auto flex flex-col small:flex-row justify-between items-center gap-8 small:gap-0 px-4">
                {features.map((feature, idx) => (
                    <div
                        key={feature.title}
                        className={`flex flex-row items-center text-left flex-1 px-2 small:px-6 ${idx !== 0 && "small:border-l small:border-main-color/50"
                            }`}
                    >
                        <div className="mr-4 flex-shrink-0 flex items-center justify-center">
                            {feature.icon}
                        </div>
                        <div>
                            <span className="block font-semibold text-main-color-dark">{feature.title}</span>
                            <span className="block text-black text-sm">{feature.description}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
