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

export default function PrivacyTemplate() {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="w-full bg-main-color py-16 md:py-24 relative overflow-hidden">
                {/* Icono decorativo de escudo */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-10">
                    <svg className="w-64 h-64 md:w-96 md:h-96 text-white" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <div className="absolute left-0 bottom-0 -translate-x-1/3 translate-y-1/4 opacity-5">
                    <svg className="w-48 h-48 md:w-72 md:h-72 text-white" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <div className="content-container max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
                    <div className="text-center">
                        <Heading
                            level="h1"
                            className="font-serenity text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                        >
                            AVISO DE PRIVACIDAD
                        </Heading>
                        <p className="text-white/80 text-lg max-w-2xl mx-auto">
                            Protección y tratamiento de tus datos personales
                        </p>
                        <div className="w-24 h-1 bg-white/50 mx-auto rounded-full mt-6" />
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="w-full py-16 md:py-20 bg-white">
                <div className="content-container max-w-4xl mx-auto px-4 lg:px-8">

                    {/* Fecha de actualización */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-8 text-center">
                        <p className="text-sm text-gray-600">
                            Última actualización: <strong>Noviembre 2025</strong>
                        </p>
                    </div>

                    <Section title="Responsable del Tratamiento de Datos">
                        <p>
                            <strong>CUARZOS MX</strong>, con domicilio en Calle Genaro Codina 764, Col. Centro, C.P. 98000,
                            Zacatecas, Zacatecas, México, es responsable del tratamiento de sus datos personales.
                        </p>
                        <p>
                            Para cualquier duda o aclaración respecto al tratamiento de sus datos personales,
                            puede contactarnos a través de:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                            <li>Correo electrónico: <a href="mailto:mineralzac@hotmail.com" className="text-main-color hover:underline">mineralzac@hotmail.com</a></li>
                            <li>WhatsApp: <a href="https://wa.me/524921277919" className="text-main-color hover:underline">+52 492 127 7919</a></li>
                        </ul>
                    </Section>

                    <Section title="Datos Personales que Recabamos">
                        <p>
                            Para llevar a cabo las finalidades descritas en el presente Aviso de Privacidad,
                            recabamos las siguientes categorías de datos personales:
                        </p>

                        <div className="mt-4 space-y-4">
                            <div className="bg-blue-50 rounded-xl p-4">
                                <h4 className="font-semibold text-blue-800 mb-2">Datos de identificación</h4>
                                <p className="text-blue-900 text-sm">
                                    Nombre completo, dirección de correo electrónico, número telefónico.
                                </p>
                            </div>

                            <div className="bg-green-50 rounded-xl p-4">
                                <h4 className="font-semibold text-green-800 mb-2">Datos de contacto y entrega</h4>
                                <p className="text-green-900 text-sm">
                                    Dirección de envío (calle, número, colonia, código postal, ciudad, estado),
                                    referencias de ubicación.
                                </p>
                            </div>

                            <div className="bg-amber-50 rounded-xl p-4">
                                <h4 className="font-semibold text-amber-800 mb-2">Datos de facturación (opcionales)</h4>
                                <p className="text-amber-900 text-sm">
                                    RFC, razón social, dirección fiscal, régimen fiscal, uso de CFDI.
                                </p>
                            </div>
                        </div>

                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mt-6">
                            <p className="text-red-800">
                                <strong>Importante:</strong> No recabamos datos financieros sensibles como números de tarjeta de crédito.
                                Estos son procesados directamente por nuestro proveedor de pagos (Stripe/OpenPay) bajo sus propias políticas de seguridad.
                            </p>
                        </div>
                    </Section>

                    <Section title="Finalidades del Tratamiento">
                        <p>
                            Sus datos personales serán utilizados para las siguientes finalidades:
                        </p>

                        <h4 className="font-semibold text-gray-800 mt-4 mb-2">Finalidades Primarias (necesarias)</h4>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Procesar y gestionar sus pedidos de compra</li>
                            <li>Realizar el envío de los productos adquiridos</li>
                            <li>Contactarle para informar sobre el estado de su pedido</li>
                            <li>Atender sus solicitudes, quejas o reclamaciones</li>
                            <li>Emitir facturas o comprobantes fiscales cuando lo solicite</li>
                            <li>Procesar cambios y devoluciones</li>
                        </ul>

                        <h4 className="font-semibold text-gray-800 mt-6 mb-2">Finalidades Secundarias (opcionales)</h4>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Enviarle información sobre promociones, ofertas y nuevos productos</li>
                            <li>Realizar encuestas de satisfacción</li>
                            <li>Enviar contenido educativo sobre cuarzos y cristales</li>
                        </ul>

                        <p className="mt-4 text-sm text-gray-600">
                            Si no desea que sus datos sean tratados para finalidades secundarias, puede indicarlo
                            enviando un correo a <a href="mailto:mineralzac@hotmail.com" className="text-main-color hover:underline">mineralzac@hotmail.com</a>
                            con el asunto &quot;Cancelar comunicaciones&quot;.
                        </p>
                    </Section>

                    <Section title="Transferencia de Datos">
                        <p>
                            Sus datos personales podrán ser transferidos y tratados dentro y fuera del país
                            por las siguientes entidades:
                        </p>

                        <div className="overflow-x-auto mt-4">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Destinatario</th>
                                        <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Finalidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-200 px-4 py-2">Empresas de paquetería</td>
                                        <td className="border border-gray-200 px-4 py-2">Realizar la entrega de sus productos</td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className="border border-gray-200 px-4 py-2">Proveedores de pago</td>
                                        <td className="border border-gray-200 px-4 py-2">Procesar el cobro de su compra</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-200 px-4 py-2">Autoridades competentes</td>
                                        <td className="border border-gray-200 px-4 py-2">Cuando sea requerido por ley</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Section>

                    <Section title="Derechos ARCO">
                        <p>
                            Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos
                            y las condiciones del uso que les damos (<strong>Acceso</strong>). Asimismo, es su derecho solicitar
                            la corrección de su información personal en caso de que esté desactualizada, sea inexacta o
                            incompleta (<strong>Rectificación</strong>); que la eliminemos de nuestros registros o bases de datos
                            cuando considere que la misma no está siendo utilizada adecuadamente (<strong>Cancelación</strong>);
                            así como oponerse al uso de sus datos personales para fines específicos (<strong>Oposición</strong>).
                            Estos derechos se conocen como derechos ARCO.
                        </p>

                        <div className="bg-main-color-light/30 rounded-xl p-6 mt-4">
                            <h4 className="font-semibold text-gray-800 mb-3">Para ejercer sus derechos ARCO:</h4>
                            <ol className="list-decimal pl-6 space-y-2">
                                <li>Envíe un correo a <a href="mailto:mineralzac@hotmail.com" className="text-main-color hover:underline font-medium">mineralzac@hotmail.com</a></li>
                                <li>Incluya: nombre completo, correo electrónico registrado, descripción clara de su solicitud</li>
                                <li>Adjunte copia de identificación oficial</li>
                                <li>Recibirá respuesta en un plazo máximo de 20 días hábiles</li>
                            </ol>
                        </div>
                    </Section>

                    <Section title="Uso de Cookies y Tecnologías de Rastreo">
                        <p>
                            Nuestro sitio web utiliza cookies y otras tecnologías de rastreo para mejorar
                            su experiencia de navegación y ofrecer un mejor servicio.
                        </p>

                        <div className="mt-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">Cookies esenciales</p>
                                    <p className="text-sm text-gray-600">Necesarias para el funcionamiento del sitio (carrito de compras, sesión)</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">Cookies analíticas</p>
                                    <p className="text-sm text-gray-600">Para entender cómo los usuarios navegan en nuestro sitio</p>
                                </div>
                            </div>
                        </div>

                        <p className="mt-4 text-sm text-gray-600">
                            Puede configurar su navegador para rechazar cookies, aunque esto podría afectar
                            algunas funcionalidades del sitio.
                        </p>
                    </Section>

                    <Section title="Medidas de Seguridad">
                        <p>
                            Hemos implementado medidas de seguridad administrativas, técnicas y físicas
                            para proteger sus datos personales contra daño, pérdida, alteración, destrucción
                            o uso no autorizado:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                            <li>Cifrado SSL en todas las comunicaciones</li>
                            <li>Acceso restringido a datos personales solo a personal autorizado</li>
                            <li>Almacenamiento seguro en servidores protegidos</li>
                            <li>Procesamiento de pagos a través de proveedores certificados PCI-DSS</li>
                        </ul>
                    </Section>

                    <Section title="Cambios al Aviso de Privacidad">
                        <p>
                            Nos reservamos el derecho de efectuar modificaciones o actualizaciones al presente
                            Aviso de Privacidad en cualquier momento. Dichas modificaciones estarán disponibles
                            en nuestro sitio web <a href="https://cuarzos.mx" className="text-main-color hover:underline">cuarzos.mx</a>.
                        </p>
                        <p>
                            Le recomendamos revisar periódicamente este aviso para estar informado sobre
                            cómo estamos protegiendo su información.
                        </p>
                    </Section>

                    <Section title="Marco Legal">
                        <p>
                            Este Aviso de Privacidad se elabora en cumplimiento de la Ley Federal de Protección
                            de Datos Personales en Posesión de los Particulares y su Reglamento, vigentes en
                            los Estados Unidos Mexicanos.
                        </p>
                    </Section>

                    <Section title="Consentimiento">
                        <div className="bg-main-color-light/30 rounded-xl p-6">
                            <p className="text-gray-800">
                                Al proporcionar sus datos personales y utilizar nuestros servicios, usted acepta
                                el tratamiento de sus datos conforme a lo establecido en este Aviso de Privacidad.
                            </p>
                        </div>
                    </Section>

                    {/* Links relacionados */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <p className="text-gray-600 mb-4">También te puede interesar:</p>
                        <div className="flex flex-wrap gap-4">
                            <LocalizedClientLink
                                href="/terms"
                                className="text-main-color hover:text-main-color-dark hover:underline"
                            >
                                Términos y Condiciones →
                            </LocalizedClientLink>
                            <LocalizedClientLink
                                href="/shipping"
                                className="text-main-color hover:text-main-color-dark hover:underline"
                            >
                                Políticas de Envío →
                            </LocalizedClientLink>
                            <LocalizedClientLink
                                href="/returns"
                                className="text-main-color hover:text-main-color-dark hover:underline"
                            >
                                Cambios y Devoluciones →
                            </LocalizedClientLink>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
