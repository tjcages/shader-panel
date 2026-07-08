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
    <div className={cn("panel-readout", className)}>
      <span className="panel-readout-label">{label}</span>
      <span className="panel-readout-value">{value?.trim() || emptyValue}</span>
    </div>
  )
}
