import { Button, Heading, Input } from "@medusajs/ui"

export default function NewsletterBlock() {
    return (
        <section className="w-full py-16 bg-main-color">
            <div className="section-container">
                <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                    <Heading level="h3" className="text-2xl md:text-3xl font-bold text-white">
                        [Título H3]
                    </Heading>
                    <Input
                        type="email"
                        placeholder="[Campo de Input para Email]"
                        className="bg-white text-black rounded-md px-4 py-2"
                    />
                    <Button className="bg-white text-main-color hover:bg-gray-100 px-6 py-2 whitespace-nowrap">
                        [Botón de Envío]
                    </Button>
                </div>
            </div>
        </section>
    )
}