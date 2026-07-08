"use client"

import { cn } from "../lib/cn"

export interface ControlOptionListItem {
  id: string
  label: string
  description?: string
  disabled?: boolean
}

export interface ControlOptionListProps {
  items: ReadonlyArray<ControlOptionListItem>
  onSelect: (id: string) => void
  title?: string
  emptyLabel?: string
  className?: string
}

export function ControlOptionList({
  items,
  onSelect,
  title,
  emptyLabel = "No matches",
  className,
}: ControlOptionListProps) {
  if (items.length === 0) {
    return emptyLabel ? (
      <div className={cn("panel-option-empty", className)}>{emptyLabel}</div>
    ) : null
  }

  return (
    <div className={cn("panel-option-list-wrap", className)}>
      {title ? <div className="panel-option-list-title">{title}</div> : null}
      <div className="panel-option-list" role="listbox" aria-label={title ?? "Options"}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="option"
            className="panel-option-item"
            disabled={item.disabled}
            onClick={() => onSelect(item.id)}
          >
            <span className="panel-option-item-label">{item.label}</span>
            {item.description ? (
              <span className="panel-option-item-desc">{item.description}</span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  )
}
