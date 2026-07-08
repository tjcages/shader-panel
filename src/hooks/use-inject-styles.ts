"use client"

import { useEffect } from "react"
import { PANEL_CSS, PANEL_STYLE_ID } from "../styles"

let injected = false

/**
 * Inject the shader-dev stylesheet into `<head>` exactly once.
 * Idempotent across mounts, HMR, and multiple panel instances.
 */
export function useInjectPanelStyles(): void {
  useEffect(() => {
    if (injected) return
    if (typeof document === "undefined") return
    if (document.getElementById(PANEL_STYLE_ID)) {
      injected = true
      return
    }
    const style = document.createElement("style")
    style.id = PANEL_STYLE_ID
    style.textContent = PANEL_CSS
    document.head.appendChild(style)
    injected = true
  }, [])
}
