"use client"

import { cn } from "../lib/cn"
import type { ShaderDevSelectOption } from "../types"

export interface ControlSelectProps {
  label: string
  value: string | number
  options: ReadonlyArray<ShaderDevSelectOption>
  onChange: (v: string | number) => void
  className?: string
}

export function ControlSelect({
  label,
  value,
  options,
  onChange,
  className,
}: ControlSelectProps) {
  // Preserve number vs string typing by looking up the option that was picked.
  const handle = (next: string) => {
    const match = options.find((o) => String(o.value) === next)
    if (!match) return
    onChange(match.value)
  }

  return (
    <div className={cn("sd-select", className)}>
      <span className="sd-select-label">{label}</span>
      <select
        className="sd-select-input"
        value={String(value)}
        onChange={(e) => handle(e.target.value)}
        aria-label={label}
      >
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
