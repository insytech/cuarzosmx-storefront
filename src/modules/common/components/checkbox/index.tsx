import { Checkbox, Label } from "@medusajs/ui"
import React from "react"

type CheckboxProps = {
  checked?: boolean
  onChange?: () => void
  label: string
  name?: string
  'data-testid'?: string
}

const CheckboxWithLabel: React.FC<CheckboxProps> = ({
  checked = true,
  onChange,
  label,
  name,
  'data-testid': dataTestId
}) => {
  return (
    <div
      className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-main-color/30 transition-colors cursor-pointer"
      onClick={(e) => {
        // Prevenir que el click en el checkbox dispare dos veces
        if ((e.target as HTMLElement).closest('button')) return
        onChange?.()
      }}
    >
      <Checkbox
        className="text-base-regular flex items-center gap-x-2 data-[state=checked]:bg-main-color data-[state=checked]:border-main-color"
        id="checkbox"
        role="checkbox"
        type="button"
        checked={checked}
        aria-checked={checked}
        onClick={onChange}
        name={name}
        data-testid={dataTestId}
      />
      <Label
        htmlFor="checkbox"
        className="!transform-none !txt-medium text-gray-700 cursor-pointer"
        size="large"
      >
        {label}
      </Label>
    </div>
  )
}

export default CheckboxWithLabel
