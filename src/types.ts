export type PanelSide = "left" | "right"

export type PanelSectionField = {
  type: "section"
  title: string
}

export type PanelSliderField<T extends Record<string, unknown>> = {
  type: "slider"
  key: keyof T & string
  label: string
  min: number
  max: number
  step: number
  /** Optional one-line hint rendered as small muted text above the slider.
   *  Use sparingly — only when behaviour can't be conveyed in the label. */
  description?: string
}

export type PanelColorField<T extends Record<string, unknown>> = {
  type: "color"
  key: keyof T & string
  label: string
}

export type PanelToggleField<T extends Record<string, unknown>> = {
  type: "toggle"
  key: keyof T & string
  label: string
  /** Optional one-line hint rendered as small muted text above the toggle. */
  description?: string
}

export type PanelSelectOption = {
  value: string | number
  label: string
}

export type PanelSelectField<T extends Record<string, unknown>> = {
  type: "select"
  key: keyof T & string
  label: string
  options: ReadonlyArray<PanelSelectOption>
  /** Label above control (default) or on the same row. */
  layout?: "inline" | "stacked"
  description?: string
}

/**
 * Pair of coupled sliders that read/write a `[x, y]` tuple at `key`.
 * Use for direction vectors, scroll offsets, anchor positions, etc.
 */
export type PanelVec2Field<T extends Record<string, unknown>> = {
  type: "vec2"
  key: keyof T & string
  label: string
  min: number
  max: number
  step: number
  /** Optional per-axis labels. Default to "X" / "Y". */
  xLabel?: string
  yLabel?: string
}

/**
 * Image slot backed by a string URL (asset path, blob/object URL, or data URL).
 *
 * Renders a thumbnail preview; unless `readonly`, clicking (or dropping a file
 * onto) the preview picks a local file and writes an object URL to the config.
 *
 * Image values are NEVER persisted to localStorage — object URLs don't survive
 * a reload, so on refresh the field falls back to its default.
 */
export type PanelImageField<T extends Record<string, unknown>> = {
  type: "image"
  key: keyof T & string
  label: string
  /** Preview-only slot for generated outputs (e.g. a depth map) — no upload UI. */
  readonly?: boolean
  /** `accept` attribute for the file picker. Default `"image/*"`. */
  accept?: string
  /** Muted text shown when the value is an empty string. */
  emptyLabel?: string
  description?: string
}

/**
 * 2D waypoint path editor. The value is an ordered array of `[x, y]` points a
 * light (or anything) travels through. Click the pad to append a point, drag a
 * point to move it, double-click to remove it.
 *
 * `anchorKey` optionally names another config key holding the `[x, y]` home
 * position, drawn as the start of the path (waypoints chain off it). When set,
 * the home point is draggable on the path pad and writes back to that key.
 */
export type PanelPathField<T extends Record<string, unknown>> = {
  type: "path"
  key: keyof T & string
  label: string
  min: number
  max: number
  anchorKey?: keyof T & string
  description?: string
}

/**
 * One-off action button — does not read or write config. Wire handlers via
 * `actionHandlers` on `usePanel` / `Panel`.
 */
export type PanelActionField = {
  type: "action"
  /** Key into the `actionHandlers` map passed to the panel. */
  actionId: string
  label: string
  description?: string
  variant?: "default" | "primary"
  /** Optional predicate — hide the button when this returns false. */
  when?: (values: Record<string, unknown>) => boolean
}

/**
 * One-click preset that merges partial values or replaces the full config.
 * Use a function for presets that need the current state (e.g. reset-all).
 */
export type PanelPresetOption<T extends Record<string, unknown>> = {
  label: string
  /** Merge partial values or replace via function. Omit when using `actionId`. */
  values?: Partial<T> | ((current: T) => T)
  /** Call a handler from `actionHandlers` instead of merging values. */
  actionId?: string
}

export type PanelPresetsField<T extends Record<string, unknown>> = {
  type: "presets"
  /** Optional heading above the preset buttons. */
  label?: string
  presets: ReadonlyArray<PanelPresetOption<T>>
}

export type PanelField<T extends Record<string, unknown>> =
  | PanelSectionField
  | PanelSliderField<T>
  | PanelColorField<T>
  | PanelToggleField<T>
  | PanelSelectField<T>
  | PanelVec2Field<T>
  | PanelImageField<T>
  | PanelPathField<T>
  | PanelActionField
  | PanelPresetsField<T>

export type PanelWriteResult = { ok: boolean; message: string }

export function isPanelSection(
  field: PanelField<Record<string, unknown>>,
): field is PanelSectionField {
  return field.type === "section"
}
