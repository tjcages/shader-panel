"use client"

import { useCallback, useRef, useState } from "react"
import { cn } from "../lib/cn"

export type PathPoint = readonly [number, number]

export interface ControlPathProps {
  label: string
  /** Ordered waypoints in [min,max] space. */
  value: ReadonlyArray<PathPoint>
  onChange: (v: PathPoint[]) => void
  min: number
  max: number
  /** Fixed "home" point drawn as the non-editable start of the path. */
  anchor?: PathPoint
  emptyLabel?: string
  className?: string
}

const VB = 100 // svg viewBox units

/**
 * 2D waypoint editor. Click empty space to append a point, drag to move,
 * double-click to remove. When `anchor` is set it's drawn as the start of the
 * path and the waypoints chain off it (a dashed segment closes back to the
 * anchor to hint the forward loop).
 */
export function ControlPath({
  label,
  value,
  onChange,
  min,
  max,
  anchor,
  emptyLabel,
  className,
}: ControlPathProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<number | null>(null)
  const movedRef = useRef(false)
  const [selected, setSelected] = useState<number | null>(null)

  const span = max - min || 1
  // value/pad space conversions. Pad y is flipped so +y points up.
  const toPad = useCallback(
    (p: PathPoint): [number, number] => [
      ((p[0] - min) / span) * VB,
      ((max - p[1]) / span) * VB,
    ],
    [min, max, span],
  )
  const fromEvent = useCallback(
    (e: { clientX: number; clientY: number }): PathPoint => {
      const svg = svgRef.current
      if (!svg) return [0, 0]
      const r = svg.getBoundingClientRect()
      const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
      const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
      return [
        +(min + px * span).toFixed(3),
        +(max - py * span).toFixed(3),
      ]
    },
    [min, max, span],
  )

  const setPoint = (i: number, p: PathPoint) => {
    const next = value.map((pt, idx) => (idx === i ? p : pt))
    onChange(next as PathPoint[])
  }

  const addPoint = (p: PathPoint) => {
    onChange([...value, p] as PathPoint[])
    setSelected(value.length)
  }

  const removePoint = (i: number) => {
    onChange(value.filter((_, idx) => idx !== i) as PathPoint[])
    setSelected(null)
  }

  const onPointerDownPoint = (e: React.PointerEvent, i: number) => {
    e.stopPropagation()
    dragRef.current = i
    movedRef.current = false
    setSelected(i)
    svgRef.current?.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragRef.current === null) return
    movedRef.current = true
    setPoint(dragRef.current, fromEvent(e))
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (dragRef.current !== null) {
      svgRef.current?.releasePointerCapture(e.pointerId)
      dragRef.current = null
    }
  }

  // Points that make up the drawn polyline: [anchor?, ...waypoints].
  const chain: PathPoint[] = anchor ? [anchor, ...value] : [...value]
  const chainPad = chain.map(toPad)
  const polyline = chainPad.map(([x, y]) => `${x},${y}`).join(" ")
  // Dashed closing segment back to the start (forward-loop hint).
  const closeFrom = chainPad[chainPad.length - 1]
  const closeTo = chainPad[0]

  return (
    <div className={cn("sd-path", className)}>
      <div className="sd-path-head">
        <span className="sd-path-label">{label}</span>
        <div className="sd-path-head-actions">
          <span className="sd-path-count">
            {value.length === 0
              ? (emptyLabel ?? "click to add")
              : `${value.length} pt${value.length === 1 ? "" : "s"}`}
          </span>
          {value.length > 0 ? (
            <button
              type="button"
              className="sd-path-clear"
              onClick={() => {
                onChange([])
                setSelected(null)
              }}
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>
      <svg
        ref={svgRef}
        className="sd-path-pad"
        viewBox={`0 0 ${VB} ${VB}`}
        preserveAspectRatio="none"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerDown={(e) => {
          // Click on empty pad appends a point.
          if (dragRef.current !== null) return
          addPoint(fromEvent(e))
        }}
      >
        {/* grid */}
        <line x1="50" y1="0" x2="50" y2={VB} className="sd-path-grid" />
        <line x1="0" y1="50" x2={VB} y2="50" className="sd-path-grid" />
        <rect
          x="0.5"
          y="0.5"
          width={VB - 1}
          height={VB - 1}
          className="sd-path-frame"
        />

        {chain.length > 1 ? (
          <polyline points={polyline} className="sd-path-line" />
        ) : null}
        {chain.length > 1 ? (
          <line
            x1={closeFrom[0]}
            y1={closeFrom[1]}
            x2={closeTo[0]}
            y2={closeTo[1]}
            className="sd-path-line-close"
          />
        ) : null}

        {anchor
          ? (() => {
              const [ax, ay] = toPad(anchor)
              return (
                <g className="sd-path-anchor" pointerEvents="none">
                  <circle cx={ax} cy={ay} r="3.4" />
                  <circle cx={ax} cy={ay} r="1.1" className="sd-path-anchor-dot" />
                </g>
              )
            })()
          : null}

        {value.map((p, i) => {
          const [x, y] = toPad(p)
          return (
            <g
              key={i}
              className={cn(
                "sd-path-point",
                selected === i && "is-selected",
              )}
              onPointerDown={(e) => onPointerDownPoint(e, i)}
              onDoubleClick={(e) => {
                e.stopPropagation()
                removePoint(i)
              }}
            >
              <circle cx={x} cy={y} r="4.2" className="sd-path-point-hit" />
              <circle cx={x} cy={y} r="3" className="sd-path-point-ring" />
              <text x={x} y={y} className="sd-path-point-num" dy="0.35em">
                {i + 1}
              </text>
            </g>
          )
        })}
      </svg>
      {selected !== null && value[selected] ? (
        <div className="sd-path-selected">
          <span>
            Point {selected + 1}: {value[selected][0].toFixed(2)},{" "}
            {value[selected][1].toFixed(2)}
          </span>
          <button
            type="button"
            className="sd-path-remove"
            onClick={() => removePoint(selected)}
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="sd-path-hint">
          Click to add · drag to move · double-click to remove
        </div>
      )}
    </div>
  )
}
