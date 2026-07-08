"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "../lib/cn"

function decimalsForStep(s: number): number {
  const str = s.toString()
  const dot = str.indexOf(".")
  return dot === -1 ? 0 : str.length - dot - 1
}

type SliderState = "idle" | "hover" | "drag"

export interface ControlSliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  className?: string
}

export function ControlSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  className,
}: ControlSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const overscrollRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<SliderState>("idle")

  const percentage = ((value - min) / (max - min)) * 100
  const decimals = decimalsForStep(step)
  const displayValue = value.toFixed(decimals)

  // Reflect prop changes into CSS variables. CSS handles whether to animate
  // (data-panel-state="drag" disables the width transition, everything else gets
  // a 220ms ease-out).
  useEffect(() => {
    const fill = fillRef.current
    const handle = handleRef.current
    if (fill) fill.style.setProperty("--panel-fill-pct", `${percentage}%`)
    if (handle) handle.style.setProperty("--panel-handle-left", `${percentage}%`)
  }, [percentage])

  const positionToValue = useCallback(
    (clientX: number) => {
      const el = trackRef.current
      if (!el) return value
      const rect = el.getBoundingClientRect()
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const raw = min + pct * (max - min)
      const stepped = Math.round(raw / step) * step
      return Math.max(
        min,
        Math.min(max, Number.parseFloat(stepped.toFixed(decimals))),
      )
    },
    [min, max, step, value, decimals],
  )

  const onChangeRef = useRef(onChange)
  const positionToValueRef = useRef(positionToValue)
  onChangeRef.current = onChange
  positionToValueRef.current = positionToValue

  const setOverscroll = useCallback((scale: number, origin: string) => {
    const el = overscrollRef.current
    if (!el) return
    el.style.setProperty("--panel-os-scale", String(scale))
    el.style.setProperty("--panel-os-origin", origin)
  }, [])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      setState("drag")
      onChangeRef.current(positionToValueRef.current(e.clientX))

      const overscrollEl = overscrollRef.current
      // Disable spring-back transition while actively dragging.
      if (overscrollEl) overscrollEl.dataset.sdRelease = "false"

      const onMove = (ev: PointerEvent) => {
        ev.preventDefault()
        const el = trackRef.current
        if (el) {
          const rect = el.getBoundingClientRect()
          const rawPct = (ev.clientX - rect.left) / rect.width
          if (rawPct < 0) {
            const d = Math.abs(rawPct)
            const v = (1 - 1 / (d * 3 + 1)) * 0.02
            setOverscroll(1 + v, "100% 50%")
          } else if (rawPct > 1) {
            const d = rawPct - 1
            const v = (1 - 1 / (d * 3 + 1)) * 0.02
            setOverscroll(1 + v, "0% 50%")
          } else {
            setOverscroll(1, "50% 50%")
          }
        }
        onChangeRef.current(positionToValueRef.current(ev.clientX))
      }

      const onUp = () => {
        // Spring back to neutral via CSS transition with bounce bezier.
        if (overscrollEl) {
          overscrollEl.dataset.sdRelease = "true"
          setOverscroll(1, "50% 50%")
          const clear = () => {
            overscrollEl.dataset.sdRelease = "false"
            overscrollEl.removeEventListener("transitionend", clear)
          }
          overscrollEl.addEventListener("transitionend", clear)
        }
        setState((prev) => (prev === "drag" ? "hover" : prev))
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
      }

      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onUp)
    },
    [setOverscroll],
  )

  const discreteSteps = (max - min) / step
  const hashCount = discreteSteps <= 10 ? discreteSteps - 1 : 9
  const hashMarks = Array.from({ length: hashCount }, (_, i) => {
    const pct =
      discreteSteps <= 10
        ? (((i + 1) * step) / (max - min)) * 100
        : (i + 1) * 10
    return (
      <div key={`h${pct}`} className="panel-slider-hash" style={{ left: `${pct}%` }} />
    )
  })

  return (
    <div data-panel-state={state} className={cn("panel-slider", className)}>
      <div ref={overscrollRef} className="panel-slider-overscroll">
        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-label={label}
          className="panel-slider-track"
          onPointerDown={handlePointerDown}
          onPointerEnter={() => setState((s) => (s === "drag" ? s : "hover"))}
          onPointerLeave={() => setState((s) => (s === "drag" ? s : "idle"))}
        >
          <div className="panel-slider-hash-row">{hashMarks}</div>
          <div
            ref={fillRef}
            className="panel-slider-fill"
            style={
              { "--panel-fill-pct": `${percentage}%` } as React.CSSProperties
            }
          />
          <div
            ref={handleRef}
            className="panel-slider-handle"
            style={
              { "--panel-handle-left": `${percentage}%` } as React.CSSProperties
            }
          />
          <span className="panel-slider-label">{label}</span>
          <span className="panel-slider-value">{displayValue}</span>
        </div>
      </div>
    </div>
  )
}
