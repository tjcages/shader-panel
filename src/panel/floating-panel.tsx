"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "../lib/cn"
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
}) {
  const open = onOpen ?? onToggle
  useInjectShaderDevStyles()
  const theme = useShaderDevTheme(defaultTheme)
  const [mounted, setMounted] = useState(false)

  // Peek preview: while collapsed, hovering the viewport edge (or the peeking
  // sliver itself) slides a scaled-down preview in. Clicking opens for real.
  const [hoverSensor, setHoverSensor] = useState(false)
  const [hoverPanel, setHoverPanel] = useState(false)
  const peeking = collapsed && (hoverSensor || hoverPanel)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Clear hover state whenever the panel opens so a later collapse doesn't
  // resurface a stale peek.
  useEffect(() => {
    if (!collapsed) {
      setHoverSensor(false)
      setHoverPanel(false)
    }
  }, [collapsed])

  if (!mounted) return null

  return createPortal(
    <ShaderDevThemeProvider value={theme}>
      {collapsed ? (
        <div
          className="sd-edge-sensor"
          data-sd-side={side}
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
            <button
              type="button"
              onClick={onToggle}
              aria-label="Close shader dev panel"
              className="sd-close-btn"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="sd-panel-body">{children}</div>
        </div>
        {peeking ? (
          <button
            type="button"
            className="sd-peek-catch"
            onClick={open}
            aria-label="Open shader dev panel"
          />
        ) : null}
      </div>
    </ShaderDevThemeProvider>,
    document.body,
  )
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
