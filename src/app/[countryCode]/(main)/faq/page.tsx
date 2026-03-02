import { Metadata } from "next"
import FAQTemplate from "@modules/faq/templates/faq-template"
import FAQSchema from "@modules/common/components/faq-schema"

export const metadata: Metadata = {
    title: "Preguntas Frecuentes | CuarzosMX",
    description: "Encuentra respuestas a las preguntas más comunes sobre pedidos, envíos, mayoreo y devoluciones en CuarzosMX.",
}

const faqSchemaItems = [
    {
        question: "¿Cómo puedo hacer un pedido?",
        answer: "Los pedidos pueden ser realizados directo por la página web o por WhatsApp.",
    },
    {
        question: "¿Cómo hacer pedidos por WhatsApp?",
        answer: "Para hacer tu pedido por WhatsApp escríbenos en alguno de estos números: +52 492 127 7919, +52 492 105 4682, +52 492 246 6698, +52 492 129 4044. Nuestra atención es de lunes a sábado de 10am a 6pm y domingo de 10am a 3pm.",
    },
    {
        question: "¿Tienen descuentos por mayoreo?",
        answer: "Por mayoreo manejamos un descuento de 20% a partir de 12 piezas. Pueden ser de productos diferentes. El descuento no aplica a productos por kilo ni a productos que ya cuenten con un descuento o promoción activa.",
    },
    {
        question: "¿Cuentan con servicio de envíos?",
        answer: "Contamos con el servicio de envío por paquetería a todo el país por un costo adicional a su compra. El costo varía dependiendo del destino.",
    },
    {
        question: "¿Cuánto tardará en llegar mi pedido?",
        answer: "Los envíos son realizados al día siguiente de tu compra, siempre y cuando sea día hábil. Los pedidos se tardan de 1 a 5 días hábiles para llegar.",
    },
    {
        question: "¿De dónde son enviados los pedidos?",
        answer: "Los pedidos realizados por la página web o por WhatsApp serán enviados desde nuestra tienda Matriz de Zacatecas.",
    },
    {
        question: "¿Cómo sé si mi pedido aplica para un cambio o devolución?",
        answer: "Podrá cambiar sus productos u obtener un reembolso íntegro si los productos se encuentran dañados o presentan defectos, o si no son los que solicitó originalmente. El cliente deberá comunicarse en un periodo no mayor a 24hrs después de haber recibido su paquete.",
    },
    {
        question: "¿Cuál es el proceso para hacer una devolución?",
        answer: "Enviar un correo a mineralzac@hotmail.com explicando las razones de la devolución o cambio. En caso de productos dañados, enviar fotos. Incluir una copia de su e-mail de confirmación con su número de pedido.",
    },
    {
        question: "¿Cuentan con catálogos de productos?",
        answer: "El catálogo de productos está disponible en nuestra página web. Para cuarzos decorativos, especímenes de colección o cuarzos a granel solicítanos por WhatsApp más información de precios y disponibilidad.",
    },
]

export default function FAQPage() {
    return (
        <>
            <FAQSchema items={faqSchemaItems} />
            <FAQTemplate />
        </>
    )
}
