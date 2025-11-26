import { Metadata } from "next"
import ReturnsTemplate from "@modules/legal/templates/returns-template"

export const metadata: Metadata = {
    title: "Cambios y Devoluciones | CuarzosMX",
    description:
        "Conoce nuestra política de cambios y devoluciones. Garantizamos tu satisfacción con proceso de devolución fácil y seguro.",
    openGraph: {
        title: "Cambios y Devoluciones | CuarzosMX",
        description:
            "Conoce nuestra política de cambios y devoluciones. Garantizamos tu satisfacción.",
        type: "website",
    },
    alternates: {
        canonical: "/returns",
    },
}

export default function ReturnsPage() {
    return <ReturnsTemplate />
}
