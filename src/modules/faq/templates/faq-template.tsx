'use client'

import { useState } from "react"
import { Heading } from "@medusajs/ui"

type FAQItem = {
    question: string
    answer: string | React.ReactNode
}

const faqItems: FAQItem[] = [
    {
        question: "¿Cómo puedo hacer un pedido?",
        answer: "Los pedidos pueden ser realizados directo por la página web o por WhatsApp."
    },
    {
        question: "¿Cómo hacer pedidos por WhatsApp?",
        answer: (
            <>
                Para hacer tu pedido por WhatsApp escríbenos en alguno de estos números:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><a href="https://wa.me/524921277919" className="text-main-color hover:underline">+52 492 127 7919</a></li>
                    <li><a href="https://wa.me/524921054682" className="text-main-color hover:underline">+52 492 105 4682</a></li>
                    <li><a href="https://wa.me/524922466698" className="text-main-color hover:underline">+52 492 246 6698</a></li>
                    <li><a href="https://wa.me/524921294044" className="text-main-color hover:underline">+52 492 129 4044</a></li>
                </ul>
                <p className="mt-2">Uno de nuestros agentes te contactará así que posible. Nuestra atención es de <strong>lunes a sábado de 10am a 6pm</strong> y <strong>domingo de 10am a 3pm</strong>.</p>
            </>
        )
    },
    {
        question: "¿Tienen descuentos por mayoreo?",
        answer: (
            <>
                Por mayoreo manejamos un descuento de <strong>20% a partir de 12 piezas</strong>. Pueden ser de productos diferentes.
                <p className="mt-2">El descuento <strong>no aplica</strong> a productos por kilo ni a productos que ya cuenten con un descuento o promoción activa.</p>
                <p className="mt-2">El descuento para los pedidos realizados por la página web entrará automáticamente cuando seleccione 12 piezas o más. En el carrito podrá ver a qué productos se les aplicó el descuento.</p>
            </>
        )
    },
    {
        question: "¿Cuentan con servicio de envíos?",
        answer: "Contamos con el servicio de envío por paquetería a todo el país por un costo adicional a su compra. El costo varía dependiendo del destino."
    },
    {
        question: "¿Cuánto tardará en llegar mi pedido?",
        answer: (
            <>
                Los envíos son realizados al día siguiente de tu compra, siempre y cuando sea día hábil. De realizar el pedido en fin de semana o en día festivo, el envío se realizará al próximo día laboral más cercano.
                <p className="mt-2">Los pedidos se tardan de <strong>1 a 5 días hábiles</strong> para llegar.</p>
            </>
        )
    },
    {
        question: "¿De dónde son enviados los pedidos?",
        answer: "Los pedidos realizados por la página web o por WhatsApp serán enviados desde nuestra tienda Matriz de Zacatecas."
    },
    {
        question: "¿Cómo sé si mi pedido aplica para un cambio o devolución?",
        answer: (
            <>
                Podrá cambiar sus productos, u obtener un reembolso íntegro si dichos productos del pedido se encuentran <strong>dañados o presentan defectos</strong> una vez recibidos, o si los productos que recibe <strong>no son los que solicitó originalmente</strong>.
                <p className="mt-2">Para cambio o devoluciones del producto el cliente deberá comunicarse en un periodo no mayor a <strong>24hrs después de haber recibido su paquete</strong>.</p>
            </>
        )
    },
    {
        question: "¿Cuál es el proceso para hacer una devolución?",
        answer: (
            <>
                Para devolver y cambiar un pedido el cliente necesitará realizar el siguiente procedimiento:
                <ol className="list-decimal pl-6 mt-2 space-y-2">
                    <li>Enviar un correo a <a href="mailto:mineralzac@hotmail.com" className="text-main-color hover:underline">mineralzac@hotmail.com</a> explicando las razones de la devolución o cambio.</li>
                    <li>En caso de productos dañados, enviar fotos de los mismos.</li>
                    <li>Una copia de su e-mail de confirmación de pedido indicando su número de pedido.</li>
                </ol>
            </>
        )
    },
    {
        question: "¿Cuentan con catálogos de productos?",
        answer: (
            <>
                El catálogo de productos está disponible aquí en nuestra <a href="/store" className="text-main-color hover:underline font-semibold">página web</a>.
                <p className="mt-2">Para productos como cuarzos decorativos, especímenes de colección o cuarzos a granel solicítanos por WhatsApp más información de precios y disponibilidad.</p>
            </>
        )
    }
]

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="border border-main-color-light rounded-xl overflow-hidden transition-all duration-300 hover:border-main-color/50">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-main-color-light/20 transition-colors duration-200"
                aria-expanded={isOpen}
            >
                <span className="font-semibold text-gray-800 pr-4">{item.question}</span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-main-color flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-6 pt-0 text-gray-700 leading-relaxed">
                    {item.answer}
                </div>
            </div>
        </div>
    )
}

export default function FAQTemplate() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="w-full bg-main-color py-16 md:py-24">
                <div className="content-container max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="text-center">
                        <Heading
                            level="h1"
                            className="font-serenity text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                        >
                            PREGUNTAS FRECUENTES
                        </Heading>
                        <p className="text-white/80 text-lg max-w-2xl mx-auto">
                            Encuentra respuestas a las dudas más comunes sobre nuestros productos y servicios
                        </p>
                        <div className="w-24 h-1 bg-white/50 mx-auto rounded-full mt-6" />
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="w-full py-16 md:py-20 bg-white">
                <div className="content-container max-w-3xl mx-auto px-4 lg:px-8">
                    <div className="space-y-4">
                        {faqItems.map((item, index) => (
                            <FAQAccordion
                                key={index}
                                item={item}
                                isOpen={openIndex === index}
                                onToggle={() => handleToggle(index)}
                            />
                        ))}
                    </div>

                    {/* Additional Help Section */}
                    <div className="mt-16 text-center bg-gradient-to-r from-main-color-light/30 to-main-color-light/50 rounded-2xl p-8 md:p-12">
                        <h3 className="font-serenity text-2xl font-bold text-gray-800 mb-4">
                            ¿No encontraste lo que buscabas?
                        </h3>
                        <p className="text-gray-700 mb-6">
                            Contáctanos directamente y con gusto te ayudaremos
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="https://wa.me/524921277919"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                WhatsApp
                            </a>
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 bg-main-color hover:bg-main-color-dark text-white px-6 py-3 rounded-full font-medium transition-colors duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Contáctanos
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
