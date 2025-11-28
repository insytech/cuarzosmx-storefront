"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

type FinancingInfo = {
    hasFinancing: boolean
    hasFinancingCost?: boolean // Whether we have actual financing cost info
    originalAmount: number
    totalFinancedAmount: number
    financingCost: number
    installments: number
    installmentAmount: number
    paymentType?: string
} | null

type FinancingContextType = {
    financingInfo: FinancingInfo
    setFinancingInfo: (info: FinancingInfo) => void
    clearFinancingInfo: () => void
}

const FinancingContext = createContext<FinancingContextType | undefined>(undefined)

const FINANCING_STORAGE_KEY = "checkout_financing_info"

export function FinancingProvider({ children }: { children: ReactNode }) {
    const [financingInfo, setFinancingInfoState] = useState<FinancingInfo>(null)

    // Load from sessionStorage on mount
    useEffect(() => {
        try {
            const stored = sessionStorage.getItem(FINANCING_STORAGE_KEY)
            if (stored) {
                setFinancingInfoState(JSON.parse(stored))
            }
        } catch (e) {
            console.error("Error loading financing info:", e)
        }
    }, [])

    const setFinancingInfo = (info: FinancingInfo) => {
        console.log("FinancingContext - setFinancingInfo called with:", info)
        setFinancingInfoState(info)
        if (info) {
            try {
                sessionStorage.setItem(FINANCING_STORAGE_KEY, JSON.stringify(info))
                console.log("FinancingContext - saved to sessionStorage")
            } catch (e) {
                console.error("Error saving financing info:", e)
            }
        } else {
            sessionStorage.removeItem(FINANCING_STORAGE_KEY)
        }
    }

    const clearFinancingInfo = () => {
        setFinancingInfoState(null)
        sessionStorage.removeItem(FINANCING_STORAGE_KEY)
    }

    return (
        <FinancingContext.Provider value={{ financingInfo, setFinancingInfo, clearFinancingInfo }}>
            {children}
        </FinancingContext.Provider>
    )
}

export function useFinancing() {
    const context = useContext(FinancingContext)
    if (context === undefined) {
        throw new Error("useFinancing must be used within a FinancingProvider")
    }
    return context
}
