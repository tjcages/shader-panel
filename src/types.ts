export type ShaderDevPanelSide = "left" | "right"

export type ShaderDevSectionField = {
  type: "section"
  title: string
}

export type ShaderDevSliderField<T extends Record<string, unknown>> = {
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

export type ShaderDevColorField<T extends Record<string, unknown>> = {
  type: "color"
  key: keyof T & string
  label: string
}

export type ShaderDevToggleField<T extends Record<string, unknown>> = {
  type: "toggle"
  key: keyof T & string
  label: string
  /** Optional one-line hint rendered as small muted text above the toggle. */
  description?: string
}

export type ShaderDevSelectOption = {
  value: string | number
  label: string
}

export type ShaderDevSelectField<T extends Record<string, unknown>> = {
  type: "select"
  key: keyof T & string
  label: string
  options: ReadonlyArray<ShaderDevSelectOption>
  /** Label above control (default) or on the same row. */
  layout?: "inline" | "stacked"
  description?: string
}

/**
 * Pair of coupled sliders that read/write a `[x, y]` tuple at `key`.
 * Use for direction vectors, scroll offsets, anchor positions, etc.
 */
export type ShaderDevVec2Field<T extends Record<string, unknown>> = {
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
export type ShaderDevImageField<T extends Record<string, unknown>> = {
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
export type ShaderDevPathField<T extends Record<string, unknown>> = {
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
 * `actionHandlers` on `useShaderDev` / `ShaderDevPanel`.
 */
export type ShaderDevActionField = {
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
export type ShaderDevPresetOption<T extends Record<string, unknown>> = {
  label: string
  /** Merge partial values or replace via function. Omit when using `actionId`. */
  values?: Partial<T> | ((current: T) => T)
  /** Call a handler from `actionHandlers` instead of merging values. */
  actionId?: string
}

export type ShaderDevPresetsField<T extends Record<string, unknown>> = {
  type: "presets"
  /** Optional heading above the preset buttons. */
  label?: string
  presets: ReadonlyArray<ShaderDevPresetOption<T>>
}

export type ShaderDevFieldDef<T extends Record<string, unknown>> =
  | ShaderDevSectionField
  | ShaderDevSliderField<T>
  | ShaderDevColorField<T>
  | ShaderDevToggleField<T>
  | ShaderDevSelectField<T>
  | ShaderDevVec2Field<T>
  | ShaderDevImageField<T>
  | ShaderDevPathField<T>
  | ShaderDevActionField
  | ShaderDevPresetsField<T>

export type ShaderDevWriteResult = { ok: boolean; message: string }

export function isShaderDevSection(
  field: ShaderDevFieldDef<Record<string, unknown>>,
): field is ShaderDevSectionField {
  return field.type === "section"
}
