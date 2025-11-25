import { Metadata } from "next"
import FAQTemplate from "@modules/faq/templates/faq-template"

export const metadata: Metadata = {
    title: "Preguntas Frecuentes | CuarzosMX",
    description: "Encuentra respuestas a las preguntas más comunes sobre pedidos, envíos, mayoreo y devoluciones en CuarzosMX.",
}

export default function FAQPage() {
    return <FAQTemplate />
}
