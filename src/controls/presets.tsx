"use client"

import { cn } from "../lib/cn"

export type ControlPresetOption<T extends Record<string, unknown>> = {
  label: string
  values?: Partial<T> | ((current: T) => T)
  actionId?: string
}

export interface ControlPresetsProps<T extends Record<string, unknown>> {
  presets: ReadonlyArray<ControlPresetOption<T>>
  values: T
  onChange: (next: T) => void
  label?: string
  className?: string
  actionHandlers?: Record<string, () => void>
}

export function ControlPresets<T extends Record<string, unknown>>({
  presets,
  values,
  onChange,
  label = "Preset",
  className,
  actionHandlers,
}: ControlPresetsProps<T>) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const picked = e.target.value
    e.target.selectedIndex = 0
    if (!picked) return

    const preset = presets.find((p) => p.label === picked)
    if (!preset) return

    if (preset.actionId) {
      actionHandlers?.[preset.actionId]?.()
      return
    }

    if (preset.values) {
      const next =
        typeof preset.values === "function"
          ? preset.values(values)
          : { ...values, ...preset.values }
      onChange(next)
    }
  }

  return (
    <div className={cn("panel-presets", className)}>
      <label className="panel-presets-label">{label}</label>
      <select
        className="panel-preset-select"
        defaultValue=""
        onChange={handleChange}
        aria-label={label}
      >
        <option value="" disabled>
          Select preset…
        </option>
        {presets.map((preset) => (
          <option key={preset.label} value={preset.label}>
            {preset.label}
          </option>
        ))}
      </select>
    </div>
  )
}
