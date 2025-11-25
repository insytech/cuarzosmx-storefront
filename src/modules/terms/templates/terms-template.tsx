"use client"

import { Heading } from "@medusajs/ui"

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

export default function TermsTemplate() {
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
                            TÉRMINOS Y CONDICIONES
                        </Heading>
                        <p className="text-white/80 text-lg max-w-2xl mx-auto">
                            Condiciones de uso de la página web Cuarzos MX
                        </p>
                        <div className="w-24 h-1 bg-white/50 mx-auto rounded-full mt-6" />
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="w-full py-16 md:py-20 bg-white">
                <div className="content-container max-w-4xl mx-auto px-4 lg:px-8">
                    {/* Introducción */}
                    <Section title="Introducción">
                        <p>
                            Las condiciones de uso de la página web, regulan los términos de
                            acceso y uso de <strong>CUARZOS MX</strong>.
                        </p>
                        <p>
                            El usuario así como la Empresa, se denominarán conjuntamente como
                            las partes. El mero acceso o utilización de este portal, de todos
                            o parte de sus contenidos y servicios se traduce en la plena
                            aceptación de las presentes condiciones de uso. La puesta a
                            disposición y el uso del portal se entiende sometida al estricto
                            cumplimiento de los términos recogidos en las presentes
                            condiciones de uso del portal.
                        </p>
                    </Section>

                    {/* Información */}
                    <Section title="Información">
                        <p>
                            Los usuarios tienen acceso a través del portal a diferente tipo de
                            información. El portal se reserva la facultad de cambiar, en
                            cualquier momento, sin previo aviso, la presentación y
                            configuración de la información ofrecida desde el portal.
                        </p>
                        <p>
                            El usuario reconoce y acepta que en cualquier momento el portal
                            pueda interrumpir, desactivar y/o cancelar cualquier información.
                            El portal realizará su mejor esfuerzo para intentar garantizar la
                            disponibilidad y accesibilidad a la web. Sin embargo,
                            ocasionalmente, por razones de mantenimiento, actualización,
                            cambio de ubicación, etc., podrá suponer la interrupción del
                            acceso al portal.
                        </p>
                    </Section>

                    {/* Responsabilidad del Portal sobre contenidos */}
                    <Section title="Responsabilidad del Portal sobre contenidos">
                        <p>
                            La aplicación no interviene en la creación de aquellos contenidos
                            y/o servicios prestados o suministrados por terceras partes en y/o
                            a través de la aplicación, del mismo modo que tampoco controla su
                            licitud. En cualquier caso, no ofrece ninguna garantía sobre los
                            mismos.
                        </p>
                        <p>
                            El usuario reconoce que la aplicación no es ni será
                            responsabilidad de los contenidos y/o servicios prestados o
                            suministrados por terceras partes en y/o a través de la
                            aplicación. El usuario acepta que la aplicación no asumirá
                            responsabilidad por cualquier daño o perjuicio producido como
                            consecuencia de la utilización de esta información o servicios de
                            terceros.
                        </p>
                        <p>
                            Exceptuando los casos donde la Ley imponga expresamente lo
                            contrario, y exclusivamente con la medida y extensión en que lo
                            imponga, la aplicación no garantiza ni asume responsabilidad
                            alguna respecto a los posibles daños y perjuicios causados por el
                            uso y utilización de la información, datos y servicios de la
                            aplicación.
                        </p>
                        <p>
                            En todo caso, la aplicación excluye cualquier responsabilidad por
                            los daños y perjuicios que puedan deberse a la información y/o
                            servicios prestados o suministrados por terceros diferentes de la
                            Empresa. Toda responsabilidad será del tercero ya sea proveedor,
                            colaborador u otro.
                        </p>
                        <p>
                            La aplicación controla la licitud de aquellos contenidos o
                            servicios prestados a través de la plataforma por terceras partes.
                            En caso de que el usuario como consecuencia de la utilización de
                            la aplicación sufra algún daño o perjuicio podrá comunicarlo y se
                            tomarán las medidas oportunas para solventarlo.
                        </p>
                    </Section>

                    {/* Obligaciones del Usuario */}
                    <Section title="Obligaciones del Usuario">
                        <p>
                            El usuario tiene que respetar en todo momento los términos y
                            condiciones establecidos en el presente aviso legal. De forma
                            expresa, el usuario manifiesta que utilizará el portal de forma
                            diligente y asumiendo cualquier responsabilidad que pudiera
                            derivarse del incumplimiento de las normas.
                        </p>
                        <p>
                            El usuario se obliga, en aquellos casos que se le soliciten datos
                            o información, a no falsear su identidad haciéndose pasar por
                            cualquier otra persona. El usuario acepta que el Portal se
                            utilizará con fines estrictamente personales, privados y
                            particulares.
                        </p>
                        <p>
                            El usuario no podrá utilizar el portal para actividades ilícitas o
                            contrarias a la moral y el orden público así como para finalidades
                            prohibidas o que vulneren o lesionen derechos de terceros.
                            Asimismo, queda prohibida la difusión, almacenamiento y/o gestión
                            de datos o contenidos que infrinjan en los derechos de terceros o
                            cualesquiera normativas reguladoras de derechos de propiedad
                            intelectual o industrial.
                        </p>
                        <p>
                            De la misma manera, el usuario no podrá utilizar el portal para
                            transmitir, almacenar, divulgar, promover o distribuir datos o
                            contenidos que sean portadores de virus o cualquier otro código
                            informático, archivos o programas diseñados para interrumpir,
                            destruir o perjudicar la función de cualquier programa o equipo
                            informático o de telecomunicaciones.
                        </p>
                        <p>
                            El usuario se obliga a indemnizar y a mantener indemnes al portal
                            por cualquier daño, perjuicio, sanción, multa, pena o
                            indemnización que tenga que hacer frente el portal.
                        </p>
                        <p className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                            <strong>Importante:</strong> El usuario acepta que por la
                            naturaleza de los productos estos pueden tener variaciones leves
                            en los tonos, las vetas y medidas, de tal manera que no se puede
                            garantizar que el producto sea idéntico a las imágenes.
                        </p>
                    </Section>

                    {/* Criterios para realizar pedidos */}
                    <Section title="Criterios para realizar pedidos">
                        <p>Únicamente se podrán comprar productos:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                Que se encuentren disponibles para su venta y cuyos detalles
                                aparezcan en Cuarzos MX;
                            </li>
                            <li>Con entrega en México; y</li>
                            <li>
                                Destinados para uso personal, ya sea el suyo propio o el de los
                                receptores para los que compre los productos.
                            </li>
                        </ul>
                        <p>
                            Cuarzos MX se reserva el derecho a rechazar cualquier pedido a su
                            elección exclusiva (por ejemplo, cuando considere que el pedido en
                            cuestión tiene por objeto ser posteriormente vendido por medios
                            distintos de los canales de distribución autorizados por Cuarzos
                            MX).
                        </p>
                        <p>
                            Los detalles de los productos disponibles para su compra
                            (incluyendo su correspondiente precio) se encuentran especificados
                            en Cuarzos MX. Nuestra empresa adoptará todas las medidas
                            necesarias y razonables para garantizar que todos los detalles,
                            las descripciones y los precios de los productos que aparecen en
                            Cuarzos MX sean correctos.
                        </p>
                        <p>
                            Si bien trataremos por todos los medios a nuestro alcance mantener
                            la tienda Cuarzos MX lo más actualizada posible, la información
                            especificada en un momento dado podría no siempre reflejar la
                            situación exacta cuando Ud. realice un pedido.
                        </p>
                    </Section>

                    {/* Realización de Pedidos de Compra */}
                    <Section title="Realización de Pedidos de Compra">
                        <ol className="list-decimal pl-6 space-y-3">
                            <li>
                                Una vez que haya seleccionado los productos que desee adquirir,
                                dichos productos serán incluidos en el carrito de compra.
                            </li>
                            <li>
                                Al finalizar su selección de productos, hará clic en el botón
                                &quot;carrito de compra&quot; para ver el resumen del pedido en
                                la que podrá identificar y corregir posibles errores.
                            </li>
                            <li>
                                Al final de la página de carrito de compra, deberá hacer clic en
                                el botón &quot;finalizar pedido&quot; para proseguir a ingresar
                                sus datos personales.
                            </li>
                            <li>
                                Una vez llenos sus datos personales, deberá hacer clic en el
                                botón &quot;continuar a forma de envío&quot;.
                            </li>
                            <li>
                                Ya que seleccionó la forma de envío, continúa dando clic en
                                &quot;continuar a forma de pago&quot;.
                            </li>
                            <li>
                                Una vez que haya terminado de llenar los datos de su tarjeta
                                bancaria, deberá hacer clic en el botón &quot;finalizar la
                                orden&quot;.
                            </li>
                            <li>
                                Una vez que haya hecho clic en el botón &quot;finalizar la
                                orden&quot;, obtendremos una autorización de la compañía
                                comercializadora de su tarjeta de crédito o débito por el
                                importe indicado. En este momento del proceso, no detraeremos
                                fondos de su tarjeta, aunque el saldo disponible en su tarjeta
                                quedará reducido con la autorización. Este proceso es el
                                procedimiento habitual que siguen los bancos. Si su tarjeta de
                                crédito no es autorizada, el pedido no se tramitará.
                            </li>
                            <li>
                                Cuarzos MX le enviará un e-mail aceptando su pedido de productos
                                y confirmándole que los productos que ha solicitado le serán
                                enviados (&quot;Confirmación de Envío&quot;).
                            </li>
                            <li>
                                Si el pago se realiza por depósito o transferencia se solicitará
                                que el cliente mande su comprobante de pago juntamente con el
                                número de pedido por medio de WhatsApp para que puedas confirmar
                                su pedido.
                            </li>
                        </ol>

                        <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                            <p className="font-semibold text-red-800 mb-2">
                                Cuarzos MX podrá rechazar la tramitación de cualquier pedido en
                                los siguientes casos:
                            </p>
                            <ul className="list-disc pl-6 space-y-1 text-red-700">
                                <li>
                                    Cuando el producto solicitado haya dejado de fabricarse o no
                                    se encuentre disponible;
                                </li>
                                <li>
                                    Cuando la entidad comercializadora de su tarjeta de crédito o
                                    débito no autorice el pago del precio de compra;
                                </li>
                                <li>
                                    Cuando no cumpla los criterios para la realización de pedidos
                                    especificados.
                                </li>
                            </ul>
                        </div>
                    </Section>

                    {/* Condiciones de Entrega */}
                    <Section title="Condiciones de Entrega">
                        <p>
                            Los pedidos realizados en Cuarzos MX son enviados al día siguiente
                            siempre y cuando sea día hábil, de realizar el pedido en fin de
                            semana o en día festivo el envío se realizará al próximo día
                            laboral más cercano.
                        </p>
                    </Section>

                    {/* Condiciones de Pago */}
                    <Section title="Condiciones de Pago">
                        <p>
                            Podrá pagar con su tarjeta bancaria (tarjeta de crédito o débito).
                            El pago mediante tarjeta de crédito es completamente seguro. La
                            totalidad de la transacción se realiza de forma cifrada a través
                            de un servidor de validación bancaria utilizándose el protocolo de
                            encriptación SSL (Secure Socket Layer), así pues, el número de tu
                            tarjeta de crédito y la fecha de caducidad quedan instantáneamente
                            encriptados en tu ordenador antes de ser enviados al protocolo
                            SSL.
                        </p>
                        <p>
                            Nadie podrá hacer uso de tus datos sin tu autorización, puesto que
                            la información es ilegible. Para una mayor seguridad, estos datos
                            no quedan almacenados en nuestro servidor, por lo cual deberás
                            comunicarnos toda la información con cada nuevo pedido.
                        </p>

                        <div className="bg-main-color-light/30 p-6 rounded-xl mt-4">
                            <p className="font-semibold text-gray-800 mb-3">
                                Métodos de pago aceptados:
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <span className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium">
                                    💳 Visa
                                </span>
                                <span className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium">
                                    💳 MasterCard
                                </span>
                                <span className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium">
                                    💳 American Express
                                </span>
                                <span className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium">
                                    🏦 Depósito
                                </span>
                                <span className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium">
                                    🏦 Transferencia
                                </span>
                                <span className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium">
                                    💰 PayPal
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-3">
                                Todas las transacciones con tarjeta serán procesadas a través de
                                OpenPay.
                            </p>
                        </div>

                        <p className="mt-4">
                            El cliente declara que tiene plena capacidad para realizar la
                            compra, siendo mayor de edad y estando en posesión de una tarjeta
                            de crédito o débito válida y emitida por un banco que resulte
                            aceptable para la empresa. El Cliente garantiza y se responsabiliza
                            de que todos los datos facilitados sobre su tarjeta sean válidos.
                        </p>
                    </Section>

                    {/* Cambios y Devoluciones */}
                    <Section title="Cambios y Devoluciones">
                        <p>
                            Las condiciones para cambios y devoluciones de pedidos que a
                            continuación se indican serán de aplicación sin perjuicio de los
                            derechos que legalmente le asistan.
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-4">
                            <h3 className="font-bold text-blue-800 text-lg mb-3">
                                Productos Dañados o Defectuosos y Entregas Incorrectas
                            </h3>
                            <p className="text-blue-900">
                                Podrá cambiar sus productos, u obtener un reembolso íntegro si
                                dichos productos del pedido se encuentran{" "}
                                <strong>dañados o presentan defectos</strong> una vez recibidos,
                                o si los productos que recibe{" "}
                                <strong>no son los que solicitó originalmente</strong>.
                            </p>
                            <p className="text-blue-900 mt-2">
                                Ten en cuenta que la tienda online podrá aceptar la devolución o
                                cambio del producto a través de nuestro Servicio de Atención al
                                Cliente siempre y cuando se comuniquen en un periodo{" "}
                                <strong>no mayor a 24hrs</strong> después de haber recibido su
                                paquete.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            {/* Cambios */}
                            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                <h4 className="font-bold text-green-800 text-lg mb-3 flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                    Cambios
                                </h4>
                                <p className="text-green-900">
                                    Cuando solicites un cambio por productos dañados o defectuosos
                                    o un pedido incorrecto, le enviaremos los artículos de
                                    sustitución de manera <strong>gratuita</strong>.
                                </p>
                                <p className="text-green-900 mt-2">
                                    El cambio se realizará siempre y cuando nos haya devuelto
                                    previamente los productos del pedido en perfecto estado, o en
                                    el caso de productos dañados o defectuosos se requiere que se
                                    envíen fotografías de estos.
                                </p>
                            </div>

                            {/* Devoluciones */}
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                                <h4 className="font-bold text-amber-800 text-lg mb-3 flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                        />
                                    </svg>
                                    Devoluciones
                                </h4>
                                <p className="text-amber-900">
                                    Si deseas devolver productos dañados o defectuosos, o
                                    recibiste un pedido incorrecto, te reembolsaremos:
                                </p>
                                <ul className="list-disc pl-6 mt-2 text-amber-900">
                                    <li>El precio total de compra</li>
                                    <li>Costos de envío</li>
                                </ul>
                                <p className="text-amber-900 mt-2 text-sm">
                                    La devolución de tu dinero se efectúa en el mismo método de
                                    pago que utilizaste. El tiempo estimado para tu reembolso es
                                    de <strong>30 días</strong>.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h4 className="font-bold text-gray-800 text-lg mb-3">
                                Cómo devolver o cambiar los productos
                            </h4>
                            <p className="mb-3">
                                Para devolver y cambiar los productos defectuosos o un pedido
                                incorrecto necesitará realizar el siguiente procedimiento:
                            </p>
                            <ol className="list-decimal pl-6 space-y-2">
                                <li>
                                    Enviar un correo a{" "}
                                    <a
                                        href="mailto:mineralzac@hotmail.com"
                                        className="text-main-color hover:underline font-medium"
                                    >
                                        mineralzac@hotmail.com
                                    </a>{" "}
                                    explicando las razones de la devolución o cambio.
                                </li>
                                <li>En caso de productos dañados, enviar fotos de los mismos.</li>
                                <li>
                                    Una copia de su e-mail de confirmación de pedido indicando su
                                    número de pedido.
                                </li>
                            </ol>
                            <p className="mt-3">
                                Después de la revisión y confirmación, nuestro servicio de
                                atención a clientes le indicará la empresa por la que realizará
                                la devolución, y le proporcionará una guía para realizar el
                                envío de devolución.
                            </p>

                            <div className="bg-gray-100 p-4 rounded-lg mt-4 text-sm">
                                <p className="font-semibold mb-2">
                                    Tiempos estimados para cambios:
                                </p>
                                <ul className="space-y-1 text-gray-700">
                                    <li>• Recepción de envío de devolución: hasta 5 días</li>
                                    <li>• Procesamiento de elementos devueltos: 5 días laborables</li>
                                    <li>• Envío de nuevos productos: hasta 5 días laborales</li>
                                </ul>
                            </div>
                        </div>
                    </Section>

                    {/* Cómo contactar con nosotros */}
                    <Section title="Cómo contactar con nosotros">
                        <p>Para más información contacta con atención al cliente:</p>
                        <div className="bg-main-color-light/30 rounded-xl p-6 mt-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-main-color rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">E-mail</p>
                                    <a
                                        href="mailto:mineralzac@hotmail.com"
                                        className="text-main-color font-medium hover:underline"
                                    >
                                        mineralzac@hotmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">WhatsApp</p>
                                    <a
                                        href="https://wa.me/524921076242"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 font-medium hover:underline"
                                    >
                                        +52 492 107 6242
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Dirección postal para devoluciones
                                    </p>
                                    <p className="text-gray-800">
                                        Mario Alberto Trujillo Dueñas
                                        <br />
                                        Calle Genaro Codina 764
                                        <br />
                                        Col. Centro
                                        <br />
                                        C.P. 98000
                                        <br />
                                        Zacatecas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* Disposiciones Generales */}
                    <Section title="Disposiciones Generales">
                        <p>Cuarzos MX se reserva el derecho a:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                            <li>
                                Modificar o cancelar, de manera temporal o permanentemente, el
                                servicio prestado a través de Cuarzos MX (o cualquier parte de
                                éste) con o sin preaviso. Cuarzos MX no será responsable frente
                                a Ud. o frente a otros terceros por tal modificación o
                                cancelación.
                            </li>
                            <li>
                                Si, pese a modificarse los Términos y Condiciones y/o las
                                Condiciones de Entrega, Ud. continúa utilizando el servicio
                                prestado a través de Cuarzos MX (o cualquier parte de éste) tras
                                dicha modificación, se considerará que ha dado su conformidad a
                                dicho cambio.
                            </li>
                        </ul>
                        <p className="mt-4">
                            Ud. será el responsable de verificar las Condiciones regularmente
                            con el fin de determinar si se ha producido algún cambio. Si no
                            está de acuerdo con alguna modificación de los Términos y
                            Condiciones, deberá dejar de utilizar con carácter inmediato el
                            servicio de Cuarzos MX.
                        </p>
                        <p className="mt-4">
                            En caso de que Cuarzos MX modifique estas condiciones, su pedido
                            quedará sujeto a las Condiciones vigentes en la fecha y hora en
                            que Ud. realizó su pedido. Podrá solicitar copia de la versión
                            vigente de las Condiciones vía e-mail a la dirección:{" "}
                            <a
                                href="mailto:mineralzac@hotmail.com"
                                className="text-main-color hover:underline"
                            >
                                mineralzac@hotmail.com
                            </a>
                        </p>
                        <p className="mt-4">
                            En caso de que alguna parte de los Términos y Condiciones sea
                            declarada ilegal o inaplicable, la disposición afectada se
                            considerará eliminada, permaneciendo plenamente vigentes las
                            restantes disposiciones de los mencionados Términos y Condiciones.
                        </p>
                    </Section>

                    {/* Back to top */}
                    <div className="text-center mt-12 pt-8 border-t border-gray-200">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                window.scrollTo({ top: 0, behavior: "smooth" })
                            }}
                            className="inline-flex items-center gap-2 text-main-color hover:text-main-color-dark transition-colors duration-200"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                                />
                            </svg>
                            Volver arriba
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
