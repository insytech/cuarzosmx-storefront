import { Metadata } from "next"
import CookiesPolicyTemplate from "@modules/legal/templates/cookies-template"

export const metadata: Metadata = {
    title: "Política de Cookies",
    description:
        "Conoce cómo CuarzosMX utiliza cookies y tecnologías similares para mejorar tu experiencia de navegación.",
    robots: {
        index: true,
        follow: true,
    },
}

export default function CookiesPage() {
    return <CookiesPolicyTemplate />
}
