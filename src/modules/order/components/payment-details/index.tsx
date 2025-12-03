import { Container, Heading, Text } from "@medusajs/ui"

import { isStripe, isManual, paymentInfoMap } from "@lib/constants"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0].payments?.[0]

  return (
    <div>
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6 text-gray-800">
        Pago
      </Heading>
      <div>
        {payment && (
          <>
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-gray-800 mb-1 font-semibold">
                  Método de pago
                </Text>
                <Text
                  className="txt-medium text-gray-600"
                  data-testid="payment-method"
                >
                  {paymentInfoMap[payment.provider_id].title}
                </Text>
              </div>
              <div className="flex flex-col w-2/3">
                <Text className="txt-medium-plus text-gray-800 mb-1 font-semibold">
                  Detalles del pago
                </Text>
                <div className="flex gap-2 txt-medium text-gray-600 items-center">
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[payment.provider_id].icon}
                  </Container>
                  <Text data-testid="payment-amount">
                    {isManual(payment.provider_id) ? (
                      <span className="text-orange-600 font-medium">Transferencia pendiente</span>
                    ) : isStripe(payment.provider_id) && payment.data?.card_last4 ? (
                      `**** **** **** ${payment.data.card_last4}`
                    ) : (
                      `${convertToLocale({
                        amount: payment.amount,
                        currency_code: order.currency_code,
                      })} pagado el ${new Date(
                        payment.created_at ?? ""
                      ).toLocaleDateString('es-MX')}`
                    )}
                  </Text>
                </div>
              </div>
            </div>

            {isManual(payment.provider_id) && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Text className="text-sm font-semibold text-blue-800 mb-2">
                  Información para realizar la transferencia
                </Text>
                <Text className="text-sm text-blue-700 mb-3">
                  Para obtener los datos bancarios, contáctanos por:
                </Text>
                <div className="space-y-2">
                  <Text className="text-sm text-blue-700">
                    📧 <strong>Email:</strong>{" "}
                    <a
                      href="mailto:ventas@cuarzos.mx"
                      className="text-blue-600 hover:underline"
                    >
                      ventas@cuarzos.mx
                    </a>
                  </Text>
                  <Text className="text-sm text-blue-700">
                    📱 <strong>WhatsApp:</strong>{" "}
                    <a
                      href="https://wa.me/52551234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      +52 55 1234 5678
                    </a>
                  </Text>
                </div>
                <Text className="text-xs text-blue-600 mt-3">
                  Una vez realizada la transferencia, envía tu comprobante con el número de pedido.
                </Text>
              </div>
            )}
          </>
        )}
      </div>

      <Divider className="mt-8" />
    </div>
  )
}

export default PaymentDetails
