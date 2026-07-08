"use client"

import { useState } from "react"
import { cn } from "../lib/cn"

export interface ControlDisclosureProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  /** De-emphasize while another row is in a focused mode (e.g. linking). */
  dimmed?: boolean
  /** Emphasize the active row during an inline flow. */
  highlighted?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export function ControlDisclosure({
  title,
  children,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  className,
  dimmed = false,
  highlighted = false,
  onMouseEnter,
  onMouseLeave,
}: ControlDisclosureProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const controlled = openProp !== undefined
  const open = controlled ? openProp : uncontrolledOpen

  const setOpen = (next: boolean) => {
    if (controlled) onOpenChange?.(next)
    else setUncontrolledOpen(next)
  }

  return (
    <div
      className={cn("sd-disclosure", className)}
      data-sd-open={open ? "true" : "false"}
      data-sd-dimmed={dimmed ? "true" : "false"}
      data-sd-highlight={highlighted ? "true" : "false"}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        type="button"
        className="sd-disclosure-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="sd-disclosure-label">{title}</span>
        <CaretIcon />
      </button>
      <div
        className="sd-collapse"
        data-sd-open={open ? "true" : "false"}
        aria-hidden={!open}
      >
        <div className="sd-collapse-inner">
          <div className="sd-disclosure-body">{children}</div>
        </div>
      </div>
    </div>
  )
}

function CaretIcon() {
  return (
    <svg
      className="sd-disclosure-caret"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 9l-7 7-7-7" />
    </svg>
  )
}
