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
      className={cn("panel-toggle", className)}
      data-panel-on={value ? "true" : "false"}
    >
      <span className="panel-toggle-label">{label}</span>
      <span className="panel-toggle-track">
        <span className="panel-toggle-thumb" />
      </span>
    </button>
  )
}
