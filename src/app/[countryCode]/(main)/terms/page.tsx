import { Metadata } from "next"
import TermsTemplate from "@modules/terms/templates/terms-template"

export const metadata: Metadata = {
    title: "Términos y Condiciones | CuarzosMX",
    description:
        "Términos y condiciones de uso de CuarzosMX. Conoce las políticas de compra, envío, devoluciones y más.",
}

export default function TermsPage() {
    return <TermsTemplate />
}
