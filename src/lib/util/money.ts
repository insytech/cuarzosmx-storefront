import { isEmpty } from "./isEmpty"
import { noDivisionCurrencies } from "@lib/constants"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency_code,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount)
    : amount.toString()
}

/**
 * Formatea un monto a una cadena de moneda legible
 * Respeta las monedas que no requieren división por 100
 */
export const formatAmount = (
  amountInSubunits: number,
  currencyCode: string,
  locale = "es-MX"
): string => {
  // Check if this currency should NOT be divided by 100
  const shouldDivide = !noDivisionCurrencies.includes(currencyCode.toLowerCase())
  const amount = shouldDivide ? amountInSubunits / 100 : amountInSubunits

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
