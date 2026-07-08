"use client"

import { cn } from "../lib/cn"

export interface ControlSearchFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  placeholder?: string
  searching?: boolean
  error?: string
  searchLabel?: string
  className?: string
}

export function ControlSearchField({
  label,
  value,
  onChange,
  onSearch,
  placeholder,
  searching = false,
  error,
  searchLabel = "Search",
  className,
}: ControlSearchFieldProps) {
  return (
    <div className={cn("sd-search", className)}>
      <span className="sd-search-label">{label}</span>
      <div className="sd-search-row">
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              onSearch()
            }
          }}
          className="sd-search-input"
          aria-label={label}
        />
        <button
          type="button"
          className="sd-search-btn"
          onClick={onSearch}
          disabled={searching}
        >
          {searching ? "…" : searchLabel}
        </button>
      </div>
      {error ? <div className="sd-search-error">{error}</div> : null}
    </div>
  )
}
