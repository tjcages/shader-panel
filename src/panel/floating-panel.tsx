"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "../lib/cn"
import { ControlThemeToggle } from "../controls/theme-toggle"
import { useInjectShaderDevStyles } from "../hooks/use-inject-styles"
import {
  ShaderDevThemeProvider,
  useShaderDevTheme,
  type ShaderDevTheme,
} from "../hooks/use-theme"

export function ShaderDevFloatingPanel({
  side,
  collapsed,
  onToggle,
  onOpen,
  title,
  titleSlot,
  children,
  className,
  defaultTheme,
  themeStorageKey,
  showThemeToggle = true,
  container,
  inline = false,
  peek = true,
}: {
  side: "left" | "right"
  collapsed: boolean
  /** Close (header ✕). */
  onToggle: () => void
  /** Open — used by the edge sensor / peek preview. Defaults to `onToggle`. */
  onOpen?: () => void
  title: string
  /** Rendered next to the title — used by ShaderDevRoot for the multi-shader switcher. */
  titleSlot?: React.ReactNode
  children: React.ReactNode
  className?: string
  defaultTheme?: ShaderDevTheme
  /** sessionStorage key for the header theme toggle. */
  themeStorageKey?: string
  /** Show the light/dark toggle in the panel header. Default true. */
  showThemeToggle?: boolean
  /** Portal target. Defaults to `document.body`. Ignored when `inline` is true. */
  container?: HTMLElement | null
  /** Render in-place (absolute positioning) instead of portaling to body. */
  inline?: boolean
  /** Edge-hover peek preview while collapsed. Default true; disabled when inline. */
  peek?: boolean
}) {
  const open = onOpen ?? onToggle
  useInjectShaderDevStyles()
  const theme = useShaderDevTheme(defaultTheme)
  const [mounted, setMounted] = useState(false)

  const showPeek = peek && !inline
  const [hoverSensor, setHoverSensor] = useState(false)
  const [hoverPanel, setHoverPanel] = useState(false)
  const peeking = showPeek && collapsed && (hoverSensor || hoverPanel)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!collapsed) {
      setHoverSensor(false)
      setHoverPanel(false)
    }
  }, [collapsed])

  if (!mounted) return null

  const panel = (
    <ShaderDevThemeProvider value={theme}>
      {showPeek && collapsed ? (
        <div
          className="sd-edge-sensor"
          data-sd-side={side}
          data-sd-inline={inline ? "true" : "false"}
          onMouseEnter={() => setHoverSensor(true)}
          onMouseLeave={() => setHoverSensor(false)}
          onClick={open}
          aria-hidden="true"
        />
      ) : null}
      <div
        data-shader-dev=""
        data-sd-theme={theme}
        data-sd-side={side}
        data-sd-collapsed={collapsed ? "true" : "false"}
        data-sd-peek={peeking ? "true" : "false"}
        data-sd-inline={inline ? "true" : "false"}
        className={cn("sd-floating", className)}
        onMouseEnter={() => setHoverPanel(true)}
        onMouseLeave={() => setHoverPanel(false)}
      >
        <div className="sd-panel">
          <div className="sd-panel-header">
            <div className="sd-panel-title-row">
              <span className="sd-panel-title">{title}</span>
              {titleSlot}
            </div>
            <div className="sd-panel-header-end">
              {showThemeToggle ? (
                <ControlThemeToggle storageKey={themeStorageKey} />
              ) : null}
              <button
                type="button"
                onClick={onToggle}
                aria-label="Close panel"
                className="sd-close-btn"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
          <div className="sd-panel-body">{children}</div>
        </div>
        {peeking ? (
          <button
            type="button"
            className="sd-peek-catch"
            onClick={open}
            aria-label="Open panel"
          />
        ) : null}
      </div>
    </ShaderDevThemeProvider>
  )

  if (inline) return panel

  const target =
    container ?? (typeof document !== "undefined" ? document.body : null)
  if (!target) return null

  return createPortal(panel, target)
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}
