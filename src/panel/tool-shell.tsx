"use client"

import { useCallback, type ReactNode } from "react"
import { TOOL_PANEL_FULL, TOOL_PANEL_INSET } from "../constants"
import { useInjectShaderDevStyles } from "../hooks/use-inject-styles"
import { cn } from "../lib/cn"
import type { ShaderDevPanelSide } from "../types"

export type ToolShellProps = {
  /** Full-bleed viewport content (canvas, scene, etc.). */
  children: ReactNode
  /** Optional top bar — receives dynamic padding when panels open. */
  topBar?: ReactNode
  /** Left panel slot — typically `<ToolPanel side="left">` or `<ShaderDevPanel side="left">`. */
  leftPanel?: ReactNode
  /** Right panel slot. */
  rightPanel?: ReactNode
  leftOpen?: boolean
  rightOpen?: boolean
  onLeftOpenChange?: (open: boolean) => void
  onRightOpenChange?: (open: boolean) => void
  uiVisible?: boolean
  onUiVisibleChange?: (visible: boolean) => void
  /** Show chevron toggle buttons at the bottom of each side. Default true. */
  showPanelToggles?: boolean
  /** Show the center eye toggle to hide/show all UI. Default true. */
  showEyeToggle?: boolean
  className?: string
}

/**
 * Generic playground layout — full-bleed viewport with left/right tool panels,
 * optional top bar, panel toggles, and eye toggle. The overlay uses
 * `pointer-events: none` so the viewport stays interactive underneath.
 */
export function ToolShell({
  children,
  topBar,
  leftPanel,
  rightPanel,
  leftOpen = true,
  rightOpen = true,
  onLeftOpenChange,
  onRightOpenChange,
  uiVisible = true,
  onUiVisibleChange,
  showPanelToggles = true,
  showEyeToggle = true,
  className,
}: ToolShellProps) {
  useInjectShaderDevStyles()

  const toggleLeft = useCallback(() => {
    onLeftOpenChange?.(!leftOpen)
  }, [leftOpen, onLeftOpenChange])

  const toggleRight = useCallback(() => {
    onRightOpenChange?.(!rightOpen)
  }, [rightOpen, onRightOpenChange])

  const toggleUi = useCallback(() => {
    onUiVisibleChange?.(!uiVisible)
  }, [uiVisible, onUiVisibleChange])

  return (
    <div className={cn("sd-tool-shell", className)}>
      <div className="sd-tool-viewport">{children}</div>

      <div
        className="sd-tool-overlay"
        data-sd-ui-visible={uiVisible ? "true" : "false"}
      >
        {topBar ? (
          <div
            className="sd-tool-topbar"
            style={{
              paddingLeft: leftOpen ? TOOL_PANEL_FULL + 8 : 20,
              paddingRight: rightOpen ? TOOL_PANEL_FULL + 8 : 20,
            }}
          >
            {topBar}
          </div>
        ) : null}

        <div className="sd-tool-panels">{leftPanel}{rightPanel}</div>

        {showPanelToggles && leftPanel && onLeftOpenChange ? (
          <PanelToggleButton
            side="left"
            open={leftOpen}
            onToggle={toggleLeft}
          />
        ) : null}

        {showPanelToggles && rightPanel && onRightOpenChange ? (
          <PanelToggleButton
            side="right"
            open={rightOpen}
            onToggle={toggleRight}
          />
        ) : null}

        {showEyeToggle && onUiVisibleChange ? (
          <EyeToggle visible={uiVisible} onToggle={toggleUi} />
        ) : null}
      </div>
    </div>
  )
}

export type PanelToggleButtonProps = {
  side: ShaderDevPanelSide
  open: boolean
  onToggle: () => void
}

export function PanelToggleButton({
  side,
  open,
  onToggle,
}: PanelToggleButtonProps) {
  const isLeft = side === "left"
  return (
    <button
      type="button"
      onClick={onToggle}
      className="sd-panel-toggle"
      data-sd-side={side}
      style={{
        [side]: open ? TOOL_PANEL_FULL + 4 : TOOL_PANEL_INSET,
      }}
      aria-label={open ? `Collapse ${side} panel` : `Expand ${side} panel`}
    >
      <ChevronIcon
        direction={isLeft ? (open ? "left" : "right") : open ? "right" : "left"}
      />
    </button>
  )
}

export type EyeToggleProps = {
  visible: boolean
  onToggle: () => void
}

export function EyeToggle({ visible, onToggle }: EyeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="sd-eye-toggle"
      data-sd-visible={visible ? "true" : "false"}
      title={visible ? "Hide UI" : "Show UI"}
      aria-label={visible ? "Hide UI" : "Show UI"}
    >
      {visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
    </button>
  )
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      className="sd-panel-toggle-icon"
      data-sd-direction={direction}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  )
}

function EyeOpenIcon() {
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeClosedIcon() {
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
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M1 1l22 22" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </svg>
  )
}
