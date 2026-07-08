"use client"

import { createElement, type FunctionComponent } from "react"
import { createRoot, type Root } from "react-dom/client"
import { PanelRoot } from "./root"
import { initPanelOpenFlag } from "../hooks/use-shortcut"
import type { PanelTheme } from "../hooks/use-theme"

type RootProps = { defaultTheme?: PanelTheme; emptyMessage?: string }
const Root = PanelRoot as FunctionComponent<RootProps>

/**
 * Lazily mount a single PanelRoot into <body> so `usePanel` works with
 * zero JSX setup. Ref-counted across all hook callers; the actual panel is
 * still guarded to a single instance inside PanelRoot, so an explicit
 * <PanelRoot/> in the tree coexists without duplicating the panel.
 */

let root: Root | null = null
let container: HTMLElement | null = null
let refCount = 0
let mountedTheme: PanelTheme | undefined

export function mountPanelOverlay(
  defaultTheme?: PanelTheme,
  defaultOpen?: boolean,
): void {
  if (typeof document === "undefined") return
  refCount += 1
  if (root) return
  // Seed the open flag before the first render so a `defaultOpen` panel starts
  // open with no closed→open flash (the overlay is its own React root).
  if (defaultOpen !== undefined) initPanelOpenFlag(defaultOpen, "right")
  initPanelOpenFlag(false, "left")
  mountedTheme = defaultTheme
  container = document.createElement("div")
  container.setAttribute("data-shader-dev-overlay", "")
  document.body.appendChild(container)
  root = createRoot(container)
  root.render(createElement(Root, { defaultTheme: mountedTheme }))
}

export function unmountPanelOverlay(): void {
  if (typeof document === "undefined") return
  refCount = Math.max(0, refCount - 1)
  if (refCount > 0) return
  // Defer the unmount: React forbids unmounting a root while rendering, which
  // can happen if this fires inside a parent's commit phase.
  const toUnmount = root
  const toRemove = container
  root = null
  container = null
  queueMicrotask(() => {
    toUnmount?.unmount()
    toRemove?.remove()
  })
}
