"use client"

import { useEffect } from "react"
import { SHADER_DEV_CSS, SHADER_DEV_STYLE_ID } from "../styles"

let injected = false

/**
 * Inject the shader-dev stylesheet into `<head>` exactly once.
 * Idempotent across mounts, HMR, and multiple panel instances.
 */
export function useInjectShaderDevStyles(): void {
  useEffect(() => {
    if (injected) return
    if (typeof document === "undefined") return
    if (document.getElementById(SHADER_DEV_STYLE_ID)) {
      injected = true
      return
    }
    const style = document.createElement("style")
    style.id = SHADER_DEV_STYLE_ID
    style.textContent = SHADER_DEV_CSS
    document.head.appendChild(style)
    injected = true
  }, [])
}
