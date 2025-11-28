"use client"

import { useEffect, useState } from "react"
import { Text } from "@medusajs/ui"

type FinancingData = {
  total_financed_amount: number
  installment_amount: number
  financing_cost: number
  installments: number
  original_amount: number
}

const FINANCING_STORAGE_KEY = "order_financing_data"

export default function FinancingDetails() {
  const [financingData, setFinancingData] = useState<FinancingData | null>(null)

  useEffect(() => {
    // Load financing data from sessionStorage
    try {
      const stored = sessionStorage.getItem(FINANCING_STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        setFinancingData(data)
        console.log("Financing data loaded for order confirmation:", data)
        
        // Clear it after loading (one-time use)
        sessionStorage.removeItem(FINANCING_STORAGE_KEY)
      }
    } catch (e) {
      console.error("Error loading financing data:", e)
    }
  }, [])

  if (!financingData || financingData.financing_cost <= 0) {
    return null
  }

  return (
    <div className="mt-4 pt-4 border-t border-dashed border-orange-200 bg-orange-50 rounded-lg p-4">
      <Text className="text-sm font-semibold text-orange-800 mb-3">
        Detalles de financiamiento
      </Text>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Text className="text-sm text-gray-600">
            Precio del producto
          </Text>
          <Text className="text-sm text-gray-700">
            MX${financingData.original_amount.toFixed(2)}
          </Text>
        </div>
        
        <div className="flex justify-between items-center">
          <Text className="text-sm text-orange-600">
            Costo de financiamiento
          </Text>
          <Text className="text-sm text-orange-600">
            + MX${financingData.financing_cost.toFixed(2)}
          </Text>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-orange-200">
          <Text className="text-sm font-semibold text-orange-800">
            Total a pagar ({financingData.installments} cuotas)
          </Text>
          <Text className="text-lg font-bold text-orange-600">
            MX${financingData.total_financed_amount.toFixed(2)}
          </Text>
        </div>
        
        <div className="text-center mt-2">
          <Text className="text-xs text-orange-500">
            {financingData.installments} cuotas de MX${financingData.installment_amount.toFixed(2)}
          </Text>
        </div>
      </div>
    </div>
  )
}
