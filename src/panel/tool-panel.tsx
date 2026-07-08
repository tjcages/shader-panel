"use client"

import { ShaderDevFloatingPanel } from "./floating-panel"
import type { ShaderDevTheme } from "../hooks/use-theme"
import type { ShaderDevPanelSide } from "../types"

export type ToolPanelProps = {
  side: ShaderDevPanelSide
  title: string
  open: boolean
  onClose: () => void
  /** Open the panel — used by peek preview. Defaults to toggling closed→open via onClose inverse. */
  onOpen?: () => void
  titleSlot?: React.ReactNode
  children: React.ReactNode
  className?: string
  defaultTheme?: ShaderDevTheme
  themeStorageKey?: string
  showThemeToggle?: boolean
  /** Portal target. Ignored when `inline` is true (default in ToolShell). */
  container?: HTMLElement | null
  /** Render in-place with absolute positioning. Default `true`. */
  inline?: boolean
  peek?: boolean
}

/**
 * Floating panel shell for custom tool content (non-schema panels).
 * Use for domain-specific editors like POI lists, scene trees, etc.
 */
export function ToolPanel({
  side,
  title,
  open,
  onClose,
  onOpen,
  titleSlot,
  children,
  className,
  defaultTheme,
  themeStorageKey,
  showThemeToggle = false,
  container,
  inline = true,
  peek,
}: ToolPanelProps) {
  return (
    <ShaderDevFloatingPanel
      side={side}
      collapsed={!open}
      onToggle={onClose}
      onOpen={onOpen}
      title={title}
      titleSlot={titleSlot}
      className={className}
      defaultTheme={defaultTheme}
      themeStorageKey={themeStorageKey}
      showThemeToggle={showThemeToggle}
      container={container}
      inline={inline}
      peek={peek}
    >
      {children}
    </ShaderDevFloatingPanel>
  )
}

/** Alias for ToolPanel — same component, shader-panel naming convention. */
export const ShaderDevToolPanel = ToolPanel
