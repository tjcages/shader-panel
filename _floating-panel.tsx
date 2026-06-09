"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "./lib/cn"
import { useInjectShaderDevStyles } from "./_use-inject-styles"
import {
  ShaderDevThemeProvider,
  useShaderDevTheme,
  type ShaderDevTheme,
} from "./_use-shader-dev-theme"

export function ShaderDevFloatingPanel({
  side,
  collapsed,
  onToggle,
  title,
  titleSlot,
  children,
  className,
  defaultTheme,
}: {
  side: "left" | "right"
  collapsed: boolean
  onToggle: () => void
  title: string
  /** Rendered next to the title — used by ShaderDevRoot for the multi-shader switcher. */
  titleSlot?: React.ReactNode
  children: React.ReactNode
  className?: string
  defaultTheme?: ShaderDevTheme
}) {
  useInjectShaderDevStyles()
  const theme = useShaderDevTheme(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <ShaderDevThemeProvider value={theme}>
      <div
        data-shader-dev=""
        data-sd-theme={theme}
        data-sd-side={side}
        data-sd-collapsed={collapsed ? "true" : "false"}
        className={cn("sd-floating", className)}
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
