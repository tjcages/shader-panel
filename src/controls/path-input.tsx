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
  /** Home point drawn as the start of the path. Draggable when `onAnchorChange` is set. */
  anchor?: PathPoint
  onAnchorChange?: (v: PathPoint) => void
  emptyLabel?: string
  className?: string
}

const VB = 100 // svg viewBox units
/** `dragRef` sentinel — anchor/home point (not a waypoint index). */
const ANCHOR_DRAG = -1
/** Pad-space radius for grabbing dots (viewBox units). */
const HIT_RADIUS_PAD = 8
/** Min distance in value space before a new waypoint is accepted. */
const MIN_ADD_DISTANCE = 0.06

/**
 * 2D waypoint editor. Click empty pad to append a point, drag dots to move,
 * double-click to remove. The home/anchor point is always draggable when
 * `onAnchorChange` is set — it never spawns a duplicate waypoint.
 */
export function ControlPath({
  label,
  value,
  onChange,
  min,
  max,
  anchor,
  onAnchorChange,
  emptyLabel,
  className,
}: ControlPathProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<number | null>(null)
  const movedRef = useRef(false)
  const pendingAddRef = useRef<PathPoint | null>(null)
  const [selected, setSelected] = useState<number | "anchor" | null>(null)

  const span = max - min || 1
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

  const distance = (a: PathPoint, b: PathPoint): number =>
    Math.hypot(a[0] - b[0], a[1] - b[1])

  const tooCloseToAnchor = useCallback(
    (p: PathPoint): boolean => {
      if (!anchor || !onAnchorChange) return false
      return distance(p, anchor) < MIN_ADD_DISTANCE
    },
    [anchor, onAnchorChange],
  )

  const setPoint = (i: number, p: PathPoint) => {
    const next = value.map((pt, idx) => (idx === i ? p : pt))
    onChange(next as PathPoint[])
  }

  const addPoint = (p: PathPoint) => {
    if (tooCloseToAnchor(p)) return
    for (const pt of value) {
      if (distance(p, pt) < MIN_ADD_DISTANCE) return
    }
    onChange([...value, p] as PathPoint[])
    setSelected(value.length)
  }

  const removePoint = (i: number) => {
    onChange(value.filter((_, idx) => idx !== i) as PathPoint[])
    setSelected(null)
  }

  const beginPointer = (e: React.PointerEvent) => {
    pendingAddRef.current = null
    movedRef.current = false
    svgRef.current?.setPointerCapture(e.pointerId)
  }

  const onPointerDownPoint = (e: React.PointerEvent, i: number) => {
    e.stopPropagation()
    beginPointer(e)
    dragRef.current = i
    setSelected(i)
  }

  const onPointerDownAnchor = (e: React.PointerEvent) => {
    if (!onAnchorChange) return
    e.stopPropagation()
    beginPointer(e)
    dragRef.current = ANCHOR_DRAG
    setSelected("anchor")
  }

  const onPointerDownBackground = (e: React.PointerEvent) => {
    e.stopPropagation()
    beginPointer(e)
    dragRef.current = null
    pendingAddRef.current = fromEvent(e)
    setSelected(null)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragRef.current === null && pendingAddRef.current === null) return
    movedRef.current = true
    const next = fromEvent(e)
    if (dragRef.current === ANCHOR_DRAG) {
      onAnchorChange?.(next)
      return
    }
    if (dragRef.current !== null) {
      setPoint(dragRef.current, next)
    }
  }

  const onPointerUp = (e: React.PointerEvent) => {
    svgRef.current?.releasePointerCapture(e.pointerId)

    if (dragRef.current !== null) {
      dragRef.current = null
      movedRef.current = false
      pendingAddRef.current = null
      return
    }

    if (pendingAddRef.current !== null && !movedRef.current) {
      addPoint(pendingAddRef.current)
    }

    dragRef.current = null
    movedRef.current = false
    pendingAddRef.current = null
  }

  const chain: PathPoint[] = anchor ? [anchor, ...value] : [...value]
  const chainPad = chain.map(toPad)
  const polyline = chainPad.map(([x, y]) => `${x},${y}`).join(" ")
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
        onPointerCancel={onPointerUp}
      >
        {/* Background — only receives clicks that miss dots (they render above). */}
        <rect
          x="0"
          y="0"
          width={VB}
          height={VB}
          className="sd-path-bg"
          onPointerDown={onPointerDownBackground}
        />

        <line
          x1="50"
          y1="0"
          x2="50"
          y2={VB}
          className="sd-path-grid"
          pointerEvents="none"
        />
        <line
          x1="0"
          y1="50"
          x2={VB}
          y2="50"
          className="sd-path-grid"
          pointerEvents="none"
        />
        <rect
          x="0.5"
          y="0.5"
          width={VB - 1}
          height={VB - 1}
          className="sd-path-frame"
          pointerEvents="none"
        />

        {chain.length > 1 ? (
          <polyline
            points={polyline}
            className="sd-path-line"
            pointerEvents="none"
          />
        ) : null}
        {chain.length > 1 ? (
          <line
            x1={closeFrom[0]}
            y1={closeFrom[1]}
            x2={closeTo[0]}
            y2={closeTo[1]}
            className="sd-path-line-close"
            pointerEvents="none"
          />
        ) : null}

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
              <circle
                cx={x}
                cy={y}
                r={HIT_RADIUS_PAD}
                className="sd-path-point-hit"
              />
              <circle
                cx={x}
                cy={y}
                r="3"
                className="sd-path-point-ring"
                pointerEvents="none"
              />
              <text
                x={x}
                y={y}
                className="sd-path-point-num"
                dy="0.35em"
                pointerEvents="none"
              >
                {i + 1}
              </text>
            </g>
          )
        })}

        {anchor
          ? (() => {
              const [ax, ay] = toPad(anchor)
              const anchorDraggable = Boolean(onAnchorChange)
              return (
                <g
                  className={cn(
                    "sd-path-anchor",
                    anchorDraggable && "is-draggable",
                    selected === "anchor" && "is-selected",
                  )}
                  style={{ pointerEvents: anchorDraggable ? "auto" : "none" }}
                  onPointerDown={
                    anchorDraggable ? onPointerDownAnchor : undefined
                  }
                >
                  {anchorDraggable ? (
                    <circle
                      cx={ax}
                      cy={ay}
                      r={HIT_RADIUS_PAD}
                      className="sd-path-point-hit"
                    />
                  ) : null}
                  <circle
                    cx={ax}
                    cy={ay}
                    r="3.4"
                    pointerEvents="none"
                  />
                  <circle
                    cx={ax}
                    cy={ay}
                    r="1.1"
                    className="sd-path-anchor-dot"
                    pointerEvents="none"
                  />
                </g>
              )
            })()
          : null}
      </svg>
      {selected === "anchor" && anchor ? (
        <div className="sd-path-selected">
          <span>
            Home: {anchor[0].toFixed(2)}, {anchor[1].toFixed(2)}
          </span>
        </div>
      ) : selected !== null && typeof selected === "number" && value[selected] ? (
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
          Click empty space to add · drag home or waypoints to move ·
          double-click to remove
        </div>
      )}
    </div>
  )
}
