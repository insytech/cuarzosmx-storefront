import { Metadata } from "next"
import ContactTemplate from "@modules/contact/templates/contact-template"

export const metadata: Metadata = {
    title: "Contáctanos | CuarzosMX",
    description: "Ponte en contacto con CuarzosMX. Estamos disponibles por WhatsApp, correo electrónico y en nuestra tienda en Zacatecas.",
}

export default function ContactPage() {
    return <ContactTemplate />
}
