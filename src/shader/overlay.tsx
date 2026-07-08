"use client"

/**
 * R3F overlay adapter for `@tjcages/panels/shader` (OFF-138).
 *
 * `<PanelOverlay>` is rendered INSIDE an R3F `<Canvas>`. It creates a DOM node,
 * portals `children` into a single overlay layer positioned over the canvas,
 * and on each `useFrame` projects the anchor's world position through the
 * camera → screen px → node transform. This is the technique drei's `<Html>`
 * uses, implemented standalone (no drei dependency).
 *
 * `createR3FBinding(...)` exposes the same primitives as a `RendererBinding` so
 * the renderer-agnostic `createOverlayProjector` (core) can be reused; the
 * component uses an equivalent projection inline to avoid re-parenting nodes.
 *
 * This is the ONLY overlay file allowed to import `three` / `@react-three/fiber`
 * — the core `src/overlay/` module stays renderer-agnostic.
 */

import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useMemo, useRef, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { Vector3, type Camera, type Object3D } from "three"

import type { ProjectedPoint, RendererBinding, Vec3 } from "../overlay/types"

/** The overlay-layer element, created lazily per container and reused. */
function ensureOverlayLayer(container: HTMLElement): HTMLElement {
  const existing = container.querySelector<HTMLElement>(
    ":scope > .panel-overlay-layer",
  )
  if (existing) return existing
  const layer = document.createElement("div")
  layer.className = "panel-overlay-layer"
  layer.style.position = "absolute"
  layer.style.inset = "0"
  layer.style.pointerEvents = "none"
  layer.style.overflow = "visible"
  container.appendChild(layer)
  return layer
}

/** Project a world vector through a camera onto the canvas rect (screen px). */
function projectWorld(
  world: Vector3,
  camera: Camera,
  rect: { width: number; height: number },
): ProjectedPoint | null {
  const ndc = world.project(camera)
  // z > 1 in NDC → behind the camera (or past the far plane): cull.
  const visible = ndc.z <= 1
  return {
    x: (ndc.x * 0.5 + 0.5) * rect.width,
    y: (ndc.y * -0.5 + 0.5) * rect.height,
    visible,
  }
}

function isObject3D(v: unknown): v is Object3D {
  return (
    typeof v === "object" &&
    v !== null &&
    (v as { isObject3D?: boolean }).isObject3D === true
  )
}

/**
 * Build a `RendererBinding` for an R3F scene. `project` reads the current
 * camera + canvas size on each call; `onFrame` registers via a passed-in
 * subscribe fn (in R3F this is driven by `useFrame` — see `PanelOverlay`).
 *
 * Exposed so consumers can reuse the core `createOverlayProjector` directly
 * with an R3F scene. `PanelOverlay` handles the common case for you.
 */
export function createR3FBinding(opts: {
  camera: Camera
  /** The canvas element (for its client rect). */
  canvas: HTMLCanvasElement
  /**
   * Per-frame subscribe. Return an unsubscribe fn. Typically wired to an
   * external `useFrame` tick; the core only needs it to be called each frame.
   */
  onFrame: RendererBinding["onFrame"]
}): RendererBinding {
  const scratch = new Vector3()
  return {
    project: (world: Vec3) => {
      const rect = opts.canvas.getBoundingClientRect()
      scratch.set(world[0], world[1], world[2])
      return projectWorld(scratch, opts.camera, rect)
    },
    onFrame: opts.onFrame,
  }
}

export type PanelOverlayProps = {
  /** A live scene object (tracks its world matrix) or a static world position. */
  anchor: Object3D | Vec3
  /** Hide the overlay without unmounting. Default `true` (shown). */
  visible?: boolean
  /** Overlay content — portaled into the layer over the canvas. */
  children?: ReactNode
}

/**
 * Pin a DOM overlay to a scene anchor. Render INSIDE an R3F `<Canvas>`:
 *
 * ```tsx
 * <PanelOverlay anchor={objectRef.current} visible={poi.visible}>
 *   <Pin label={poi.name} />
 * </PanelOverlay>
 * ```
 */
export function PanelOverlay({
  anchor,
  visible = true,
  children,
}: PanelOverlayProps): ReactNode {
  const gl = useThree((s) => s.gl)
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)

  const nodeRef = useRef<HTMLDivElement | null>(null)
  const lastVisibleRef = useRef(false)
  const scratch = useRef(new Vector3())

  // The overlay layer lives over the canvas's positioned parent. If the canvas
  // has no positioned parent, fall back to the parent as-is (the layer is
  // absolute; the consumer is expected to position the canvas wrapper).
  const layer = useMemo<HTMLElement | null>(() => {
    if (typeof document === "undefined") return null
    const canvas = gl.domElement
    const container = canvas.parentElement ?? document.body
    return ensureOverlayLayer(container)
  }, [gl])

  // Create the portal node once.
  const node = useMemo<HTMLDivElement | null>(() => {
    if (typeof document === "undefined") return null
    const el = document.createElement("div")
    el.className = "panel-overlay-item"
    el.style.position = "absolute"
    el.style.top = "0"
    el.style.left = "0"
    el.style.willChange = "transform"
    el.style.visibility = "hidden"
    return el
  }, [])

  useEffect(() => {
    if (!layer || !node) return
    layer.appendChild(node)
    nodeRef.current = node
    return () => {
      if (node.parentNode === layer) layer.removeChild(node)
      nodeRef.current = null
    }
  }, [layer, node])

  useFrame(() => {
    const el = nodeRef.current
    if (!el) return

    if (!visible) {
      if (lastVisibleRef.current) {
        el.style.visibility = "hidden"
        lastVisibleRef.current = false
      }
      return
    }

    const world = scratch.current
    if (isObject3D(anchor)) {
      // World position of the object (accounts for parent transforms).
      anchor.getWorldPosition(world)
    } else {
      world.set(anchor[0], anchor[1], anchor[2])
    }

    const canvas = gl.domElement
    const rect = canvas.getBoundingClientRect()
    // project() mutates in place, so operate on the scratch vector.
    const projected = projectWorld(world, camera, {
      width: rect.width || size.width,
      height: rect.height || size.height,
    })

    if (!projected || !projected.visible) {
      if (lastVisibleRef.current) {
        el.style.visibility = "hidden"
        lastVisibleRef.current = false
      }
      return
    }

    const x = Math.round(projected.x)
    const y = Math.round(projected.y)
    el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
    if (!lastVisibleRef.current) {
      el.style.visibility = "visible"
      lastVisibleRef.current = true
    }
  })

  if (!node) return null
  return createPortal(children, node)
}
