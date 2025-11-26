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

export default function ReturnsTemplate() {
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
                            CAMBIOS Y DEVOLUCIONES
                        </Heading>
                        <p className="text-white/80 text-lg max-w-2xl mx-auto">
                            Tu satisfacción es nuestra prioridad
                        </p>
                        <div className="w-24 h-1 bg-white/50 mx-auto rounded-full mt-6" />
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="w-full py-16 md:py-20 bg-white">
                <div className="content-container max-w-4xl mx-auto px-4 lg:px-8">

                    {/* Importante */}
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-12">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-amber-800 text-lg mb-2">Importante sobre nuestros productos</h3>
                                <p className="text-amber-900">
                                    Por la naturaleza de los cuarzos y cristales, estos pueden tener <strong>variaciones leves</strong> en tonos, vetas y medidas.
                                    No podemos garantizar que el producto sea idéntico a las imágenes, ya que cada pieza es única.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Section title="¿Cuándo puedo solicitar un cambio o devolución?">
                        <p>
                            Podrás solicitar un cambio o devolución en los siguientes casos:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                            <li>
                                <strong>Productos dañados o defectuosos:</strong> Si tu pedido llegó roto o con defectos de fábrica.
                            </li>
                            <li>
                                <strong>Pedido incorrecto:</strong> Si los productos que recibiste no son los que solicitaste originalmente.
                            </li>
                        </ul>

                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mt-4">
                            <p className="text-red-800">
                                <strong>Plazo máximo:</strong> Debes comunicarte con nosotros dentro de las primeras <strong>24 horas</strong> después de recibir tu paquete para poder procesar tu solicitud.
                            </p>
                        </div>
                    </Section>

                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        {/* Cambios */}
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-green-800 text-xl">Cambios</h3>
                            </div>
                            <p className="text-green-900 mb-4">
                                Cuando solicites un cambio por productos dañados, defectuosos o un pedido incorrecto:
                            </p>
                            <ul className="space-y-2 text-green-900">
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Envío de productos de reemplazo <strong>gratuito</strong></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Requiere devolución previa del producto original</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Envío de fotografías del daño si aplica</span>
                                </li>
                            </ul>
                        </div>

                        {/* Devoluciones */}
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-blue-800 text-xl">Devoluciones</h3>
                            </div>
                            <p className="text-blue-900 mb-4">
                                Si prefieres la devolución de tu dinero en lugar de un cambio:
                            </p>
                            <ul className="space-y-2 text-blue-900">
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Reembolso del <strong>precio total de compra</strong></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Incluye <strong>costos de envío</strong></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Reembolso al mismo método de pago</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Tiempo estimado: <strong>30 días</strong></span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <Section title="Proceso de Cambio o Devolución">
                        <p className="mb-4">
                            Para solicitar un cambio o devolución, sigue estos pasos:
                        </p>

                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-main-color rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                    1
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Contáctanos</h4>
                                    <p className="text-gray-600">
                                        Envía un correo a <a href="mailto:mineralzac@hotmail.com" className="text-main-color hover:underline font-medium">mineralzac@hotmail.com</a> explicando las razones del cambio o devolución.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-main-color rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                    2
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Envía evidencia</h4>
                                    <p className="text-gray-600">
                                        Adjunta fotografías del producto dañado o incorrecto, junto con una copia de tu confirmación de pedido (número de orden).
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-main-color rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                    3
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Recibe instrucciones</h4>
                                    <p className="text-gray-600">
                                        Nuestro equipo revisará tu caso y te indicará la paquetería para la devolución, junto con una guía prepagada.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-main-color rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                    4
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Envía el producto</h4>
                                    <p className="text-gray-600">
                                        Empaca el producto de forma segura y envíalo usando la guía proporcionada.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                    ✓
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Recibe tu cambio o reembolso</h4>
                                    <p className="text-gray-600">
                                        Una vez recibido y verificado el producto, procesaremos tu cambio o reembolso.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Section>

                    <Section title="Tiempos Estimados">
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                    <span className="text-gray-700">Recepción de devolución</span>
                                    <span className="font-semibold text-gray-900">Hasta 5 días</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                    <span className="text-gray-700">Revisión del producto</span>
                                    <span className="font-semibold text-gray-900">5 días laborables</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                    <span className="text-gray-700">Envío de reemplazo</span>
                                    <span className="font-semibold text-gray-900">Hasta 5 días laborales</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Reembolso</span>
                                    <span className="font-semibold text-gray-900">Hasta 30 días</span>
                                </div>
                            </div>
                        </div>
                    </Section>

                    <Section title="Dirección para Devoluciones">
                        <div className="bg-main-color-light/30 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-main-color rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 mb-1">Mario Alberto Trujillo Dueñas</p>
                                    <p className="text-gray-700">
                                        Calle Genaro Codina 764<br />
                                        Col. Centro<br />
                                        C.P. 98000<br />
                                        Zacatecas, Zacatecas
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-gray-600">
                            <strong>Nota:</strong> No envíes productos sin antes recibir instrucciones de nuestro equipo de atención al cliente.
                        </p>
                    </Section>

                    <Section title="¿Necesitas ayuda?">
                        <p>
                            Nuestro equipo está listo para asistirte con cualquier duda sobre cambios y devoluciones:
                        </p>
                        <div className="flex flex-wrap gap-4 mt-4">
                            <a
                                href="https://wa.me/524928690537"
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
                                href="/shipping"
                                className="text-main-color hover:text-main-color-dark hover:underline"
                            >
                                Políticas de Envío →
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
