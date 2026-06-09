"use client"

import { createElement, type FunctionComponent } from "react"
import { createRoot, type Root } from "react-dom/client"
import { ShaderDevRoot } from "./root"
import type { ShaderDevTheme } from "../hooks/use-theme"

type RootProps = { defaultTheme?: ShaderDevTheme; emptyMessage?: string }
const Root = ShaderDevRoot as FunctionComponent<RootProps>

/**
 * Lazily mount a single ShaderDevRoot into <body> so `useShaderDev` works with
 * zero JSX setup. Ref-counted across all hook callers; the actual panel is
 * still guarded to a single instance inside ShaderDevRoot, so an explicit
 * <ShaderDevRoot/> in the tree coexists without duplicating the panel.
 */

let root: Root | null = null
let container: HTMLElement | null = null
let refCount = 0
let mountedTheme: ShaderDevTheme | undefined

export function mountShaderDevOverlay(defaultTheme?: ShaderDevTheme): void {
  if (typeof document === "undefined") return
  refCount += 1
  if (root) return
  mountedTheme = defaultTheme
  container = document.createElement("div")
  container.setAttribute("data-shader-dev-overlay", "")
  document.body.appendChild(container)
  root = createRoot(container)
  root.render(createElement(Root, { defaultTheme: mountedTheme }))
}

export function unmountShaderDevOverlay(): void {
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
