"use client"

import { cn } from "../lib/cn"

export interface ControlTextInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  layout?: "stacked" | "inline"
  monospace?: boolean
  className?: string
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

export function ControlTextInput({
  label,
  value,
  onChange,
  placeholder,
  layout = "stacked",
  monospace = false,
  className,
  onKeyDown,
}: ControlTextInputProps) {
  return (
    <div
      className={cn("panel-text", className)}
      data-panel-layout={layout}
    >
      <span className="panel-text-label">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        className="panel-text-input"
        data-panel-mono={monospace ? "true" : "false"}
        aria-label={label}
      />
    </div>
  )
}
