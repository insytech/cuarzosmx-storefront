import { Metadata } from "next"
import ShippingTemplate from "@modules/legal/templates/shipping-template"

export const metadata: Metadata = {
    title: "Políticas de Envío | CuarzosMX",
    description:
        "Conoce nuestras políticas de envío. Enviamos a toda la República Mexicana. Tiempos de entrega, costos y seguimiento de pedidos.",
    openGraph: {
        title: "Políticas de Envío | CuarzosMX",
        description:
            "Conoce nuestras políticas de envío. Enviamos a toda la República Mexicana.",
        type: "website",
    },
    alternates: {
        canonical: "/shipping",
    },
}

export default function ShippingPage() {
    return <ShippingTemplate />
}
