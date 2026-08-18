import { SITE_URL } from "@lib/util/seo"
interface ArticleSchemaProps {
    title: string
    description: string
    url: string
    image?: string
    datePublished: string
    dateModified?: string
    authorName?: string
}

const ArticleSchema = ({
    title,
    description,
    url,
    image,
    datePublished,
    dateModified,
    authorName = "CuarzosMX",
}: ArticleSchemaProps) => {
    const siteUrl = SITE_URL

    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: description,
        image: image || `${siteUrl}/og-image.jpg`,
        url: `${siteUrl}${url}`,
        datePublished: datePublished,
        dateModified: dateModified || datePublished,
        author: {
            "@type": "Organization",
            name: authorName,
            url: siteUrl,
        },
        publisher: {
            "@type": "Organization",
            name: "CuarzosMX",
            logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/logo.png`,
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${siteUrl}${url}`,
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}

export default ArticleSchema
