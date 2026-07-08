"use client"

import { createContext, useContext, useEffect, useState } from "react"

export type PanelTheme = "light" | "dark"

export const PANEL_THEME_STORAGE_KEY = "shader-dev-theme"

declare global {
  interface Window {
    __themeOverride?: string
  }
}

/** Apply light/dark to the document root and persist the user's choice. */
export function applyPanelTheme(
  mode: PanelTheme,
  storageKey: string = PANEL_THEME_STORAGE_KEY,
): void {
  if (typeof document === "undefined") return
  window.__themeOverride = mode
  document.documentElement.classList.toggle("dark", mode === "dark")
  try {
    sessionStorage.setItem(storageKey, mode)
  } catch {
    /* ignore quota / private mode */
  }
}

function detectSystemPreference(): PanelTheme {
  if (typeof window === "undefined") return "dark"
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark"
}

/**
 * Resolution priority (highest wins):
 *   1. `html.dark` class on document root
 *   2. `defaultTheme` argument (per-mount opinion — pass this from the page)
 *   3. OS `prefers-color-scheme`
 */
export function usePanelTheme(
  defaultTheme?: PanelTheme,
): PanelTheme {
  const [systemPreference, setSystemPreference] =
    useState<PanelTheme>(detectSystemPreference)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)")
    const onChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? "light" : "dark")
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const [htmlDark, setHtmlDark] = useState(false)
  useEffect(() => {
    const root = document.documentElement
    const sync = () => setHtmlDark(root.classList.contains("dark"))
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  if (htmlDark) return "dark"
  if (defaultTheme) return defaultTheme
  return systemPreference
}

/**
 * Theme context — provided by FloatingPanel, consumed by the inner
 * Control primitives. Mostly informational now (CSS handles the visual swap
 * via the `[data-panel-theme]` attribute), but kept so custom controls can react.
 */
const PanelThemeContext = createContext<PanelTheme>("dark")

export const PanelThemeProvider = PanelThemeContext.Provider

export function usePanelThemeContext(): PanelTheme {
  return useContext(PanelThemeContext)
}
