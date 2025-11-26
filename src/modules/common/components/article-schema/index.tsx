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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cuarzosmx.com"

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
