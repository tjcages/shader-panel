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

export type ShaderDevFieldDef<T extends Record<string, unknown>> =
  | ShaderDevSectionField
  | ShaderDevSliderField<T>
  | ShaderDevColorField<T>
  | ShaderDevToggleField<T>
  | ShaderDevSelectField<T>
  | ShaderDevVec2Field<T>

export type ShaderDevWriteResult = { ok: boolean; message: string }

export function isShaderDevSection(
  field: ShaderDevFieldDef<Record<string, unknown>>,
): field is ShaderDevSectionField {
  return field.type === "section"
}
