import { Label } from "@medusajs/ui"
import React, { useEffect, useImperativeHandle, useState } from "react"

import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"

type InputProps = Omit<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  "placeholder"
> & {
  label: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  name: string
  topLabel?: string
  validationMessage?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, name, label, touched, required, topLabel, validationMessage, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [inputType, setInputType] = useState(type)

    useEffect(() => {
      if (type === "password" && showPassword) {
        setInputType("text")
      }

      if (type === "password" && !showPassword) {
        setInputType("password")
      }
    }, [type, showPassword])

    useImperativeHandle(ref, () => inputRef.current!)

    // Maneja mensajes de validación personalizados en español
    const handleInvalid = (e: React.InvalidEvent<HTMLInputElement>) => {
      const input = e.target

      // Campo requerido vacío
      if (input.validity.valueMissing) {
        input.setCustomValidity(`El campo ${label} es requerido`)
        return
      }

      // Patrón no coincide o tipo inválido
      if (input.validity.patternMismatch || input.validity.typeMismatch) {
        input.setCustomValidity(validationMessage || `Ingresa un ${label.toLowerCase()} válido`)
        return
      }

      // Otros errores de validación
      if (validationMessage) {
        input.setCustomValidity(validationMessage)
      }
    }

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      // Resetea el mensaje de validación cuando el usuario escribe
      e.currentTarget.setCustomValidity("")
    }

    return (
      <div className="flex flex-col w-full">
        {topLabel && (
          <Label className="mb-2 txt-compact-medium-plus">{topLabel}</Label>
        )}
        <div className="flex relative z-0 w-full txt-compact-medium">
          <input
            id={name}
            type={inputType}
            name={name}
            placeholder=" "
            required={required}
            onInvalid={handleInvalid}
            onInput={handleInput}
            className="pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-gray-50 border border-gray-200 rounded-lg appearance-none outline-none focus-visible:ring-2 focus-visible:ring-main-color/20 focus-visible:border-main-color hover:bg-gray-100 transition-colors"
            {...props}
            ref={inputRef}
          />
          <label
            htmlFor={name}
            className="flex items-center justify-center mx-3 px-1 absolute transition-transform duration-300 top-3 -z-1 origin-0 text-gray-500 cursor-text"
          >
            {label}
            {required && <span className="text-rose-500">*</span>}
          </label>
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="text-gray-500 px-4 outline-none focus-visible:text-gray-700 hover:text-gray-700 absolute right-0 top-3 transition-colors duration-150"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
