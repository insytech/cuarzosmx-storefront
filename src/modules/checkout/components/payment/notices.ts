/**
 * Avisos del paso de pago cuando el backend recalcula el carrito
 * (odd/tasks/buen-fin-promociones.md T15, propuesta P2/P3).
 */
export const PAYMENT_NOTICE = {
  TOTAL_CHANGED: "El total de tu carrito cambió. Revísalo antes de pagar.",
  TRANSFER_RESTORED:
    "Tu total se actualizó; volvimos a seleccionar transferencia.",
} as const

export type PaymentNotice = (typeof PAYMENT_NOTICE)[keyof typeof PAYMENT_NOTICE]

/**
 * Respuestas de `POST /store/mercadopago-card-payment` que significan "el total del
 * carrito ya no es el que se mando" (no se cobro nada):
 * - 400 "El monto del pago (X) no coincide con el total del carrito (Y)..."
 * - 409 "El total de tu carrito cambió. No se realizó ningún cargo..."
 * El otro 409, "Este carrito ya fue pagado", NO entra: conserva su mensaje.
 */
export function isCardTotalChanged(status: number, message: string): boolean {
  if (status === 400) {
    return message.includes("no coincide con el total del carrito")
  }
  if (status === 409) {
    return message.includes("El total de tu carrito cambió")
  }
  return false
}
