"use client"

import { cn } from "../lib/cn"

export interface ControlTextareaProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  className?: string
}

export function ControlTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  className,
}: ControlTextareaProps) {
  return (
    <div className={cn("sd-textarea", className)}>
      <span className="sd-textarea-label">{label}</span>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="sd-textarea-input"
        aria-label={label}
      />
    </div>
  )
}
