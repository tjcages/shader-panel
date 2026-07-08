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
    <div className={cn("panel-search", className)}>
      <span className="panel-search-label">{label}</span>
      <div className="panel-search-row">
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
          className="panel-search-input"
          aria-label={label}
        />
        <button
          type="button"
          className="panel-search-btn"
          onClick={onSearch}
          disabled={searching}
        >
          {searching ? "…" : searchLabel}
        </button>
      </div>
      {error ? <div className="panel-search-error">{error}</div> : null}
    </div>
  )
}
