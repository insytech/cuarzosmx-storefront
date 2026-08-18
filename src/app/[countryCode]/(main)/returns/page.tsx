import { Metadata } from "next"
import { buildOpenGraph } from "@lib/util/seo"
import ReturnsTemplate from "@modules/legal/templates/returns-template"

export const metadata: Metadata = {
    title: "Cambios y Devoluciones | CuarzosMX",
    description:
        "Conoce nuestra política de cambios y devoluciones. Garantizamos tu satisfacción con proceso de devolución fácil y seguro.",
    openGraph: buildOpenGraph({
        title: "Cambios y Devoluciones | CuarzosMX",
        description:
            "Conoce nuestra política de cambios y devoluciones. Garantizamos tu satisfacción.",
        path: "/returns",
    }),
    alternates: {
        canonical: "/returns",
    },
}

export default function ReturnsPage() {
    return <ReturnsTemplate />
}
