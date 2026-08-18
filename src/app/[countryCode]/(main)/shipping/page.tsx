import { Metadata } from "next"
import { buildOpenGraph } from "@lib/util/seo"
import ShippingTemplate from "@modules/legal/templates/shipping-template"

export const metadata: Metadata = {
    title: "Políticas de Envío | CuarzosMX",
    description:
        "Conoce nuestras políticas de envío. Enviamos a toda la República Mexicana. Tiempos de entrega, costos y seguimiento de pedidos.",
    openGraph: buildOpenGraph({
        title: "Políticas de Envío | CuarzosMX",
        description:
            "Conoce nuestras políticas de envío. Enviamos a toda la República Mexicana.",
        path: "/shipping",
    }),
    alternates: {
        canonical: "/shipping",
    },
}

export default function ShippingPage() {
    return <ShippingTemplate />
}
