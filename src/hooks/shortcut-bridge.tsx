"use client"

import { useCallback } from "react"
import {
  dispatchPanelToggle,
  usePanelShortcut,
} from "./use-shortcut"

/**
 * Mount once in the site layout (dev only). Registers the keyboard shortcut even
 * before any AccentShader island has hydrated (client:visible).
 */
export function PanelShortcutBridge() {
  const onToggle = useCallback(() => {
    dispatchPanelToggle()
  }, [])

  usePanelShortcut(onToggle, true)
  return null
}
