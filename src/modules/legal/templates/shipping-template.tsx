"use client"

import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type SectionProps = {
    title: string
    children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
    return (
        <div className="mb-10">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <span className="w-2 h-8 bg-main-color rounded-full" />
                {title}
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4 pl-5">
                {children}
            </div>
        </div>
    )
}

export default function ShippingTemplate() {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="w-full bg-main-color py-16 md:py-24 relative overflow-hidden">
                {/* Icono decorativo de envío */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-10">
                    <svg className="w-64 h-64 md:w-96 md:h-96 text-white" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                        <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                </div>
                <div className="absolute left-0 bottom-0 -translate-x-1/3 translate-y-1/4 opacity-5">
                    <svg className="w-48 h-48 md:w-72 md:h-72 text-white" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <div className="content-container max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
                    <div className="text-center">
                        <Heading
                            level="h1"
                            className="font-serenity text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                        >
                            POLÍTICAS DE ENVÍO
                        </Heading>
                        <p className="text-white/80 text-lg max-w-2xl mx-auto">
                            Todo lo que necesitas saber sobre nuestros envíos a todo México
                        </p>
                        <div className="w-24 h-1 bg-white/50 mx-auto rounded-full mt-6" />
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="w-full py-16 md:py-20 bg-white">
                <div className="content-container max-w-4xl mx-auto px-4 lg:px-8">

                    {/* Resumen visual */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-main-color-light/30 rounded-2xl p-6 text-center">
                            <div className="w-16 h-16 bg-main-color rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg mb-2">Envío al día siguiente</h3>
                            <p className="text-gray-600 text-sm">En días hábiles</p>
                        </div>
                        <div className="bg-green-50 rounded-2xl p-6 text-center">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg mb-2">Empaque seguro</h3>
                            <p className="text-gray-600 text-sm">Protección garantizada</p>
                        </div>
                        <div className="bg-blue-50 rounded-2xl p-6 text-center">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg mb-2">Todo México</h3>
                            <p className="text-gray-600 text-sm">Cobertura nacional</p>
                        </div>
                    </div>

                    <Section title="Tiempos de Envío">
                        <p>
                            Los pedidos realizados en Cuarzos MX son enviados al <strong>día siguiente hábil</strong> de realizar tu compra.
                        </p>
                        <p>
                            Si realizas tu pedido en fin de semana o en día festivo, el envío se realizará al próximo día laboral más cercano.
                        </p>

                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mt-4">
                            <p className="text-amber-800">
                                <strong>Nota:</strong> Los tiempos de entrega pueden variar dependiendo de la paquetería y la ubicación de destino. Generalmente, los envíos llegan entre 3-7 días hábiles después del despacho.
                            </p>
                        </div>
                    </Section>

                    <Section title="Cobertura de Envío">
                        <p>
                            Realizamos envíos a <strong>toda la República Mexicana</strong>. No importa en qué estado te encuentres, tu pedido llegará hasta tu puerta.
                        </p>
                        <p>
                            Actualmente no realizamos envíos internacionales. Si te encuentras fuera de México y deseas adquirir nuestros productos, contáctanos por WhatsApp para buscar una solución.
                        </p>
                    </Section>

                    <Section title="Costo de Envío">
                        <p>
                            El costo de envío se calcula automáticamente al momento de realizar tu compra, basándose en:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                            <li>El peso total de tu pedido</li>
                            <li>Las dimensiones del paquete</li>
                            <li>Tu código postal de destino</li>
                        </ul>
                        <p className="mt-4">
                            El costo exacto se mostrará antes de confirmar tu pago, sin cargos ocultos.
                        </p>
                    </Section>

                    <Section title="Seguimiento de Pedido">
                        <p>
                            Una vez que tu pedido sea enviado, recibirás un correo electrónico con:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                            <li>Confirmación de envío</li>
                            <li>Número de guía de rastreo</li>
                            <li>Enlace para seguir tu paquete en tiempo real</li>
                        </ul>
                    </Section>

                    <Section title="Recepción del Paquete">
                        <p>
                            Al recibir tu paquete, te recomendamos:
                        </p>
                        <ol className="list-decimal pl-6 space-y-2 mt-3">
                            <li>Revisar que el empaque no tenga daños visibles antes de firmar de recibido</li>
                            <li>Abrir el paquete en presencia del repartidor si es posible</li>
                            <li>Verificar que todos los productos estén completos</li>
                            <li>Si hay algún problema, tomar fotografías inmediatamente</li>
                        </ol>

                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mt-4">
                            <p className="text-red-800">
                                <strong>Importante:</strong> Si recibes un paquete dañado o productos rotos, comunícate con nosotros dentro de las primeras <strong>24 horas</strong> con fotografías del daño para proceder con el cambio o devolución.
                            </p>
                        </div>
                    </Section>

                    <Section title="Paqueterías">
                        <p>
                            Trabajamos con las principales paqueterías de México para garantizar la seguridad de tu envío:
                        </p>
                        <div className="flex flex-wrap gap-4 mt-4">
                            <span className="bg-gray-100 px-4 py-2 rounded-lg font-medium">FedEx</span>
                            <span className="bg-gray-100 px-4 py-2 rounded-lg font-medium">DHL</span>
                            <span className="bg-gray-100 px-4 py-2 rounded-lg font-medium">Estafeta</span>
                            <span className="bg-gray-100 px-4 py-2 rounded-lg font-medium">Paquetexpress</span>
                        </div>
                        <p className="mt-4 text-sm text-gray-600">
                            La paquetería será seleccionada según disponibilidad y mejor opción para tu ubicación.
                        </p>
                    </Section>

                    <Section title="¿Tienes dudas?">
                        <p>
                            Si tienes alguna pregunta sobre tu envío o necesitas información adicional, estamos para ayudarte:
                        </p>
                        <div className="flex flex-wrap gap-4 mt-4">
                            <a
                                href="https://wa.me/524921277919"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                WhatsApp
                            </a>
                            <a
                                href="mailto:mineralzac@hotmail.com"
                                className="inline-flex items-center gap-2 bg-main-color text-white px-6 py-3 rounded-full hover:bg-main-color-dark transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email
                            </a>
                        </div>
                    </Section>

                    {/* Links relacionados */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <p className="text-gray-600 mb-4">También te puede interesar:</p>
                        <div className="flex flex-wrap gap-4">
                            <LocalizedClientLink
                                href="/returns"
                                className="text-main-color hover:text-main-color-dark hover:underline"
                            >
                                Cambios y Devoluciones →
                            </LocalizedClientLink>
                            <LocalizedClientLink
                                href="/terms"
                                className="text-main-color hover:text-main-color-dark hover:underline"
                            >
                                Términos y Condiciones →
                            </LocalizedClientLink>
                            <LocalizedClientLink
                                href="/faq"
                                className="text-main-color hover:text-main-color-dark hover:underline"
                            >
                                Preguntas Frecuentes →
                            </LocalizedClientLink>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
