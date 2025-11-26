import { Metadata } from "next"
import PrivacyTemplate from "@modules/legal/templates/privacy-template"

export const metadata: Metadata = {
    title: "Aviso de Privacidad | CuarzosMX",
    description:
        "Aviso de Privacidad de CuarzosMX conforme a la LFPDPPP. Conoce cómo protegemos y utilizamos tus datos personales.",
    openGraph: {
        title: "Aviso de Privacidad | CuarzosMX",
        description:
            "Aviso de Privacidad de CuarzosMX conforme a la Ley Federal de Protección de Datos Personales.",
        type: "website",
    },
    alternates: {
        canonical: "/privacy",
    },
}

export default function PrivacyPage() {
    return <PrivacyTemplate />
}
