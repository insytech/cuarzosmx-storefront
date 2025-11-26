import { Metadata } from "next"
import BlogPageClient from "./client"

export const metadata: Metadata = {
    title: "Blog | Cristales, Espiritualidad y Bienestar",
    description:
        "Aprende sobre cristales, cuarzos, espiritualidad y bienestar. Guías, propiedades de las piedras, consejos de limpieza energética y más en el blog de CuarzosMX.",
    openGraph: {
        title: "Blog | CuarzosMX",
        description:
            "Aprende sobre cristales, cuarzos, espiritualidad y bienestar. Guías y consejos en el blog de CuarzosMX.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog | CuarzosMX",
        description: "Aprende sobre cristales, cuarzos, espiritualidad y bienestar.",
    },
    alternates: {
        canonical: "/blog",
    },
}

export default function BlogPage() {
    return <BlogPageClient />
}