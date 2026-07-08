"use client"

import { cn } from "../lib/cn"

export interface ControlReadoutProps {
  label: string
  value?: string
  emptyValue?: string
  className?: string
}

export function ControlReadout({
  label,
  value,
  emptyValue = "None",
  className,
}: ControlReadoutProps) {
  return (
    <div className={cn("sd-readout", className)}>
      <span className="sd-readout-label">{label}</span>
      <span className="sd-readout-value">{value?.trim() || emptyValue}</span>
    </div>
  )
}
