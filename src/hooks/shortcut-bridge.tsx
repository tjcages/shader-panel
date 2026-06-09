"use client"

import { useCallback } from "react"
import {
  dispatchShaderDevToggle,
  useShaderDevShortcut,
} from "./use-shortcut"

/**
 * Mount once in the site layout (dev only). Registers the keyboard shortcut even
 * before any AccentShader island has hydrated (client:visible).
 */
export function ShaderDevShortcutBridge() {
  const onToggle = useCallback(() => {
    dispatchShaderDevToggle()
  }, [])

  useShaderDevShortcut(onToggle, true)
  return null
}
