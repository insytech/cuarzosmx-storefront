import { Metadata } from "next"
import BlogPageClient from "./client"

export const metadata: Metadata = {
    title: "Blog | Cuarzos MX",
    description: "Descubre nuestros artículos sobre cristales, minerales y espiritualidad.",
}

export default function BlogPage() {
    return <BlogPageClient />
}