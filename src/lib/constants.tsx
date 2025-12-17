import React from "react"
import { CreditCard } from "@medusajs/icons"

import Ideal from "@modules/common/icons/ideal"
import Bancontact from "@modules/common/icons/bancontact"
import PayPal from "@modules/common/icons/paypal"
import BankTransfer from "@modules/common/icons/bank-transfer"

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  pp_stripe_stripe: {
    title: "Credit card",
    icon: <CreditCard />,
  },
  "pp_stripe-ideal_stripe": {
    title: "iDeal",
    icon: <Ideal />,
  },
  "pp_stripe-bancontact_stripe": {
    title: "Bancontact",
    icon: <Bancontact />,
  },
  pp_paypal_paypal: {
    title: "PayPal",
    icon: <PayPal />,
  },
  pp_system_default: {
    title: "Transferencia bancaria",
    icon: <BankTransfer />,
  },
  pp_mercadopago_mercadopago: {
    title: "Pago con tarjeta",
    icon: <CreditCard />,
  },
  // Virtual payment method for Mercado Crédito (rendered separately)
  mercado_credito: {
    title: "Hasta 12 pagos sin tarjeta con Mercado Pago",
    icon: <img src="/icon-mp.png" alt="Mercado Pago" className="h-4 w-4" />,
  },
  // Add more payment providers here
}

// This only checks if it is native stripe for card payments, it ignores the other stripe-based providers
export const isStripe = (providerId?: string) => {
  return providerId?.startsWith("pp_stripe_")
}
export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}
export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}
export const isMercadoPago = (providerId?: string) => {
  return providerId?.startsWith("pp_mercadopago")
}
export const isMercadoCredito = (providerId?: string) => {
  return providerId === "mercado_credito"
}

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  "mxn",
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
]
