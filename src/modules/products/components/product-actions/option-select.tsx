"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import Image from "next/image"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (optionId: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
  /** Map of option value -> thumbnail URL */
  variantThumbnails?: Record<string, string | null>
  /** Map of option value -> discount percentage (e.g. "20") */
  variantSaleDiscounts?: Record<string, string>
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
  variantThumbnails,
  variantSaleDiscounts,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)
  const hasThumbnails = variantThumbnails && Object.values(variantThumbnails).some(Boolean)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm font-medium text-gray-700">{title}</span>
      <div
        className={clx("flex flex-wrap gap-3", {
          "gap-4": hasThumbnails,
        })}
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          const thumbnail = variantThumbnails?.[v]
          const isSelected = v === current
          const saleDiscount = variantSaleDiscounts?.[v]

          // If we have thumbnails, render card-style buttons
          if (hasThumbnails) {
            return (
              <button
                onClick={() => updateOption(option.id, v)}
                key={v}
                className={clx(
                  "relative flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all duration-200 min-w-[90px]",
                  {
                    "border-main-color bg-main-color-light ring-2 ring-main-color ring-offset-1": isSelected,
                    "border-gray-200 bg-white hover:border-main-color hover:bg-gray-50": !isSelected,
                    "opacity-50 cursor-not-allowed": disabled,
                  }
                )}
                disabled={disabled}
                data-testid="option-button"
              >
                {saleDiscount && (
                  <span className="absolute -top-2 -right-2 z-10 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm leading-none">
                    -{saleDiscount}%
                  </span>
                )}
                {thumbnail ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={thumbnail}
                      alt={v}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <span className={clx(
                  "text-xs font-medium text-center leading-tight max-w-[80px]",
                  {
                    "text-main-color-dark": isSelected,
                    "text-gray-700": !isSelected,
                  }
                )}>
                  {v}
                </span>
              </button>
            )
          }

          // Default: text-only buttons (original style)
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "relative border text-sm font-medium h-11 min-w-[80px] px-4 rounded-lg transition-all duration-200",
                {
                  "border-main-color bg-main-color-light text-main-color-dark ring-2 ring-main-color ring-offset-1": isSelected,
                  "border-gray-300 bg-white text-gray-700 hover:border-main-color hover:bg-gray-50": !isSelected,
                  "opacity-50 cursor-not-allowed": disabled,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {saleDiscount && (
                <span className="absolute -top-2 -right-2 z-10 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm leading-none">
                  -{saleDiscount}%
                </span>
              )}
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
