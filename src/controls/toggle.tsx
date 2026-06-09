"use client"

import { cn } from "../lib/cn"

export interface ControlToggleProps {
  label: string
  value: boolean
  onChange: (v: boolean) => void
  className?: string
}

export function ControlToggle({
  label,
  value,
  onChange,
  className,
}: ControlToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={() => onChange(!value)}
      className={cn("sd-toggle", className)}
      data-sd-on={value ? "true" : "false"}
    >
      <span className="sd-toggle-label">{label}</span>
      <span className="sd-toggle-track">
        <span className="sd-toggle-thumb" />
      </span>
    </button>
  )
}
