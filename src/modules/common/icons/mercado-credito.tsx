import React from "react"

import { IconProps } from "types/icon"

const MercadoCredito: React.FC<IconProps> = ({
    size = "24",
    color = "currentColor",
    ...attributes
}) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...attributes}
        >
            {/* Mercado Pago style icon - simplified */}
            <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#00BCFF"
                strokeWidth="2"
                fill="none"
            />
            <path
                d="M8 12L11 15L16 9"
                stroke="#00BCFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default MercadoCredito
