"use client"

import { useEffect } from "react"

export const SHADER_DEV_TOGGLE_EVENT = "cf-shader-dev-toggle"
const SHADER_DEV_OPEN_KEY = "cf-accent-shader-dev-open"

export function readShaderDevOpenFlag(): boolean {
  try {
    return sessionStorage.getItem(SHADER_DEV_OPEN_KEY) === "true"
  } catch {
    return false
  }
}

export function writeShaderDevOpenFlag(open: boolean): void {
  try {
    sessionStorage.setItem(SHADER_DEV_OPEN_KEY, open ? "true" : "false")
  } catch {
    /* ignore */
  }
}

/**
 * Seed the open flag from an app-provided default the first time it's read this
 * session. If the user has already toggled the panel (flag present), their
 * choice wins. Returns the effective open state. Call synchronously before the
 * panel's first render to avoid an open/close flash.
 */
export function initShaderDevOpenFlag(defaultOpen: boolean): boolean {
  try {
    const raw = sessionStorage.getItem(SHADER_DEV_OPEN_KEY)
    if (raw === null) {
      sessionStorage.setItem(SHADER_DEV_OPEN_KEY, defaultOpen ? "true" : "false")
      return defaultOpen
    }
    return raw === "true"
  } catch {
    return defaultOpen
  }
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  ) {
    return true
  }
  return target.isContentEditable
}

function isKeyD(e: KeyboardEvent): boolean {
  return e.key === "d" || e.key === "D" || e.code === "KeyD"
}

/**
 * Toggle shader dev UI.
 * - ⌘⌥D / Ctrl+Alt+D (primary)
 * - ⌘⇧D / Ctrl+Shift+D (Chrome on Mac may steal this for "Bookmark all tabs")
 */
export function useShaderDevShortcut(onToggle: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return

      const mod = e.metaKey || e.ctrlKey
      if (!mod || !isKeyD(e)) return

      const primary = e.shiftKey && !e.altKey
      const fallback = e.altKey && !e.shiftKey
      if (!primary && !fallback) return

      e.preventDefault()
      e.stopImmediatePropagation()
      onToggle()
    }

    window.addEventListener("keydown", onKeyDown, true)
    return () => window.removeEventListener("keydown", onKeyDown, true)
  }, [enabled, onToggle])
}

/** Dispatch from layout bridge; persists open state for late-hydrating shader islands. */
export function dispatchShaderDevToggle(): void {
  writeShaderDevOpenFlag(!readShaderDevOpenFlag())
  window.dispatchEvent(new CustomEvent(SHADER_DEV_TOGGLE_EVENT))
}
