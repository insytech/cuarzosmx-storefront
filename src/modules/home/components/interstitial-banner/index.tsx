import { Button, Heading } from "@medusajs/ui"

export default function InterstitialBanner() {
    return (
        <section className="w-full py-16 bg-beige">
            <div className="section-container">
                <div className="flex flex-col items-center">
                    <Heading level="h2" className="text-3xl md:text-4xl font-bold mb-6">
                        [Título H2]
                    </Heading>
                    <Button className="btn-primary">
                        [Botón CTA]
                    </Button>
                </div>
            </div>
        </section>
    )
}