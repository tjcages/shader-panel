"use client"

import { useState } from "react"
import { cn } from "../lib/cn"

export interface ControlSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  /** Controlled open state — pair with `onOpenChange`. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  /** Called when the user clicks the ↻ icon in the section header. */
  onReset?: () => void
}

export function ControlSection({
  title,
  children,
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  className,
  onReset,
}: ControlSectionProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const controlled = openProp !== undefined
  const open = controlled ? openProp : uncontrolledOpen
  const setOpen = (next: boolean) => {
    if (controlled) onOpenChange?.(next)
    else setUncontrolledOpen(next)
  }
  const toggle = () => setOpen(!open)
  return (
    <div
      data-panel-open={open ? "true" : "false"}
      className={cn("panel-section", className)}
    >
      <div className="panel-section-header">
        <button
          type="button"
          className="panel-section-button"
          onClick={toggle}
          aria-expanded={open}
        >
          <span className="panel-section-title">{title}</span>
        </button>
        {onReset ? (
          <button
            type="button"
            className="panel-section-reset"
            onClick={onReset}
            aria-label={`Reset ${title} to defaults`}
            title={`Reset ${title}`}
          >
            <ResetIcon />
          </button>
        ) : null}
        <button
          type="button"
          className="panel-section-caret-btn"
          onClick={toggle}
          aria-label={open ? "Collapse section" : "Expand section"}
          tabIndex={-1}
        >
          <CaretIcon />
        </button>
      </div>
      <div className="panel-collapse" data-panel-open={open ? "true" : "false"}>
        <div className="panel-collapse-inner">
          <div className="panel-section-children">{children}</div>
        </div>
      </div>
    </div>
  )
}

function CaretIcon() {
  return (
    <svg
      className="panel-section-caret"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  )
}

function ResetIcon() {
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
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}
