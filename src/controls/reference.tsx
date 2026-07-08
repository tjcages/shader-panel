"use client"

import { useState } from "react"
import { ControlOptionList } from "./option-list"
import { ControlReadout } from "./readout"
import type { PanelCollectionItem, PanelReferenceField } from "../types"

export interface ControlReferenceProps {
  field: PanelReferenceField<Record<string, unknown>>
  value: string | string[] | undefined
  onChange: (next: string | string[]) => void
  /** Panel top-level state — the referenced collection is resolved from here. */
  rootValues: Record<string, unknown>
  setRootValues: (next: Record<string, unknown>) => void
  className?: string
}

/**
 * Point at an item in a sibling collection. Shows the current target's label
 * (or `placeholder`); clicking opens a picker — the option list of the
 * referenced collection's items. Picking sets the id, or toggles it in the
 * array when `multiple`.
 */
export function ControlReference({
  field,
  value,
  onChange,
  rootValues,
  className,
}: ControlReferenceProps) {
  const [open, setOpen] = useState(false)

  const target = (rootValues[field.collection] as
    | PanelCollectionItem[]
    | undefined) ?? []

  const labelOf = (item: PanelCollectionItem): string =>
    field.optionLabel ? field.optionLabel(item) : item.id

  const selectedIds: string[] = field.multiple
    ? Array.isArray(value)
      ? value
      : []
    : typeof value === "string" && value
      ? [value]
      : []

  const currentLabel = selectedIds
    .map((id) => {
      const item = target.find((it) => it.id === id)
      return item ? labelOf(item) : id
    })
    .join(", ")

  const pick = (id: string) => {
    if (field.multiple) {
      const set = new Set(selectedIds)
      if (set.has(id)) set.delete(id)
      else set.add(id)
      onChange(Array.from(set))
    } else {
      onChange(id)
      setOpen(false)
    }
  }

  return (
    <div className={`panel-reference${className ? ` ${className}` : ""}`}>
      <button
        type="button"
        className="panel-reference-trigger"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <ControlReadout
          label={field.label}
          value={currentLabel}
          emptyValue={field.placeholder ?? "None"}
        />
      </button>

      <div
        className="panel-collapse"
        data-panel-open={open ? "true" : "false"}
        aria-hidden={!open}
      >
        <div className="panel-collapse-inner">
          <div className="panel-reference-picker">
            <ControlOptionList
              items={target.map((item) => ({
                id: item.id,
                label: labelOf(item),
                description: selectedIds.includes(item.id)
                  ? "Selected"
                  : undefined,
              }))}
              onSelect={pick}
              emptyLabel="No items to link"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
