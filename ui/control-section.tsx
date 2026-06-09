"use client"

import { useState } from "react"
import { cn } from "../lib/cn"

export interface ControlSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
  /** Called when the user clicks the ↻ icon in the section header. */
  onReset?: () => void
}

export function ControlSection({
  title,
  children,
  defaultOpen = true,
  className,
  onReset,
}: ControlSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const toggle = () => setOpen(!open)
  return (
    <div
      data-sd-open={open ? "true" : "false"}
      className={cn("sd-section", className)}
    >
      <div className="sd-section-header">
        <button
          type="button"
          className="sd-section-button"
          onClick={toggle}
          aria-expanded={open}
        >
          <span className="sd-section-title">{title}</span>
        </button>
        {onReset ? (
          <button
            type="button"
            className="sd-section-reset"
            onClick={onReset}
            aria-label={`Reset ${title} to defaults`}
            title={`Reset ${title}`}
          >
            <ResetIcon />
          </button>
        ) : null}
        <button
          type="button"
          className="sd-section-caret-btn"
          onClick={toggle}
          aria-label={open ? "Collapse section" : "Expand section"}
          tabIndex={-1}
        >
          <CaretIcon />
        </button>
      </div>
      <div className="sd-collapse" data-sd-open={open ? "true" : "false"}>
        <div className="sd-collapse-inner">
          <div className="sd-section-children">{children}</div>
        </div>
      </div>
    </div>
  )
}

function CaretIcon() {
  return (
    <svg
      className="sd-section-caret"
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
