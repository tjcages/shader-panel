"use client"

import { useCallback } from "react"
import { cn } from "../lib/cn"
import { ControlSlider } from "./slider"

export interface ControlVec2Props {
  label: string
  value: readonly [number, number]
  min: number
  max: number
  step: number
  xLabel?: string
  yLabel?: string
  onChange: (v: [number, number]) => void
  className?: string
}

export function ControlVec2({
  label,
  value,
  min,
  max,
  step,
  xLabel = "X",
  yLabel = "Y",
  onChange,
  className,
}: ControlVec2Props) {
  const setX = useCallback(
    (x: number) => onChange([x, value[1]]),
    [onChange, value],
  )
  const setY = useCallback(
    (y: number) => onChange([value[0], y]),
    [onChange, value],
  )

  return (
    <div className={cn("panel-vec2", className)}>
      <span className="panel-vec2-label">{label}</span>
      <div className="panel-vec2-row">
        <ControlSlider
          label={xLabel}
          value={value[0]}
          min={min}
          max={max}
          step={step}
          onChange={setX}
        />
        <ControlSlider
          label={yLabel}
          value={value[1]}
          min={min}
          max={max}
          step={step}
          onChange={setY}
        />
      </div>
    </div>
  )
}
