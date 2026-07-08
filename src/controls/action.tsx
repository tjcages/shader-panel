"use client"

import { cn } from "../lib/cn"

export interface ControlActionProps {
  label: string
  description?: string
  onClick: () => void
  disabled?: boolean
  variant?: "default" | "primary" | "destructive"
  className?: string
}

/**
 * Panel action button — triggers a one-off handler (open editor, re-run
 * pipeline, etc.) without writing to shader config.
 */
export function ControlAction({
  label,
  description,
  onClick,
  disabled = false,
  variant = "default",
  className,
}: ControlActionProps) {
  return (
    <div className={cn("sd-action-field", className)}>
      {description ? (
        <div className="sd-field-description">{description}</div>
      ) : null}
      <button
        type="button"
        className={cn(
          "sd-action-btn",
          variant === "primary" && "sd-action-btn-primary",
          variant === "destructive" && "sd-action-btn-destructive",
        )}
        disabled={disabled}
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  )
}
