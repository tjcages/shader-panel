import type { PanelField } from "./types"

/** Parse `#rgb` / `#rrggbb` to a normalized `[r, g, b]` tuple in `[0, 1]`. */
export function hexToRgb01(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "").trim()
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized
  const n = Number.parseInt(full, 16)
  if (Number.isNaN(n)) return [0, 0, 0]
  const r = ((n >> 16) & 255) / 255
  const g = ((n >> 8) & 255) / 255
  const b = (n & 255) / 255
  return [r, g, b]
}

type FieldKey<T> = keyof T & string
type Mapping<T> = Partial<Record<FieldKey<T>, string>>

function uniformNameFor<T>(
  key: FieldKey<T>,
  mapping: Mapping<T>,
  prefix: string,
): string {
  return mapping[key] ?? `${prefix}${key}`
}

export type CreateWebGLAdapterOptions<T extends Record<string, unknown>> = {
  /** Field definitions — the adapter walks these to build the uniform record. */
  fields: PanelField<T>[]
  /**
   * Per-key uniform name overrides. Keys not listed fall back to
   * `prefix + key` (e.g. `speed` → `u_speed`).
   */
  mapping?: Mapping<T>
  /** Default prefix when no `mapping[key]` is provided. Default `"u_"`. */
  prefix?: string
  /** Hex → vec3 normalization. `rgb01` (default) matches typical GLSL `vec3` color uniforms. */
  colorAs?: "rgb01" | "rgb255"
  /** Toggle (boolean) encoding. Most GLSL prefers `int` (0/1); set this for raw bool. */
  toggleAs?: "int" | "bool"
}

/**
 * Build a `(config) => uniforms` function from a field schema.
 *
 * Drop-in for raw WebGL or `@paper-design/shaders` `ShaderMount.setUniforms(...)`.
 * No need to hand-roll `configToShaderUniforms` for each shader.
 *
 * ```ts
 * const toUniforms = createWebGLAdapter<MyConfig>({ fields: FIELDS })
 * mount.setUniforms(toUniforms(config))
 * ```
 */
export function createWebGLAdapter<T extends Record<string, unknown>>({
  fields,
  mapping = {} as Mapping<T>,
  prefix = "u_",
  colorAs = "rgb01",
  toggleAs = "int",
}: CreateWebGLAdapterOptions<T>) {
  return function configToUniforms(config: T): Record<string, unknown> {
    const out: Record<string, unknown> = {}
    for (const field of fields) {
      if (field.type === "section" || field.type === "action" || field.type === "presets") continue
      const key = field.key
      const name = uniformNameFor<T>(key, mapping, prefix)
      const value = config[key]

      if (field.type === "color") {
        const rgb01 = hexToRgb01(value as string)
        out[name] =
          colorAs === "rgb255" ? rgb01.map((c) => Math.round(c * 255)) : rgb01
        continue
      }

      if (field.type === "toggle") {
        out[name] = toggleAs === "int" ? (value ? 1 : 0) : Boolean(value)
        continue
      }

      // slider / select / vec2 — straight passthrough
      out[name] = value
    }
    return out
  }
}

export type CreateR3FAdapterOptions<T extends Record<string, unknown>> = {
  /** Live Three.js uniforms record. The adapter mutates `[name].value` in place. */
  uniforms: Record<string, { value: unknown }>
  fields: PanelField<T>[]
  mapping?: Mapping<T>
  prefix?: string
}

/**
 * Build an `apply(config)` function that mutates Three.js uniform slots in place
 * — no recompile, no uniforms-object recreation per render.
 *
 * Color slots are detected by the presence of a `.set` method on `value`
 * (matches `THREE.Color` and `THREE.Vector*`). Otherwise the value is replaced
 * directly. Call from a `useEffect([config])`.
 *
 * ```ts
 * const apply = useMemo(() => createR3FAdapter<MyConfig>({
 *   uniforms,
 *   fields: FIELDS,
 * }), [uniforms])
 * useEffect(() => apply(config), [config, apply])
 * ```
 */
export function createR3FAdapter<T extends Record<string, unknown>>({
  uniforms,
  fields,
  mapping = {} as Mapping<T>,
  prefix = "u_",
}: CreateR3FAdapterOptions<T>) {
  return function applyConfig(config: T): void {
    for (const field of fields) {
      if (field.type === "section" || field.type === "action" || field.type === "presets") continue
      const key = field.key
      const name = uniformNameFor<T>(key, mapping, prefix)
      const slot = uniforms[name]
      if (!slot) continue
      const value = config[key]

      if (field.type === "color") {
        const current = slot.value as { set?: (hex: string) => void } | null
        if (current && typeof current.set === "function") {
          current.set(value as string)
        } else {
          slot.value = value
        }
        continue
      }

      if (field.type === "vec2") {
        const tuple = value as readonly [number, number]
        const current = slot.value as
          | { set?: (x: number, y: number) => void }
          | null
        if (current && typeof current.set === "function") {
          current.set(tuple[0], tuple[1])
        } else {
          slot.value = [tuple[0], tuple[1]]
        }
        continue
      }

      // slider / select / toggle — direct write
      slot.value = value
    }
  }
}
