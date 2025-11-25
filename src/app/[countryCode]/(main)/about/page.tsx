import { Metadata } from "next"
import AboutTemplate from "@modules/about/templates/about-template"

export const metadata: Metadata = {
    title: "Nosotros | CuarzosMX",
    description: "Conoce más sobre CuarzosMX, empresa mexicana fundada por mineros en Zacatecas con más de 20 años de experiencia en cuarzos y minerales.",
}

export default function AboutPage() {
    return <AboutTemplate />
}
