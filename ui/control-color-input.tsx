"use client"

import { useRef } from "react"
import { cn } from "../lib/cn"

export interface ControlColorInputProps {
  label: string
  value: string
  onChange: (v: string) => void
  className?: string
}

export function ControlColorInput({
  label,
  value,
  onChange,
  className,
}: ControlColorInputProps) {
  const hiddenRef = useRef<HTMLInputElement>(null)
  return (
    <div className={cn("sd-color", className)}>
      <span className="sd-color-label">{label}</span>
      <div className="sd-color-right">
        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => onChange(e.target.value)}
          className="sd-color-text"
        />
        <button
          type="button"
          onClick={() => hiddenRef.current?.click()}
          className="sd-color-swatch"
          style={{ background: value }}
          aria-label={`Pick color for ${label}`}
        />
        <input
          ref={hiddenRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sd-color-native"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
