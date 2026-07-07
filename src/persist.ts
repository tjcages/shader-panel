/**
 * localStorage persistence for shader dev panel values.
 *
 * Keyed by `shader-dev:<id>` so each registered shader gets its own slot.
 * Values are merged with defaults on load so adding a new field doesn't wipe
 * existing edits.
 */

const PERSIST_PREFIX = "shader-dev:"
const SECTIONS_SUFFIX = ":sections"

function storage(): Storage | null {
  if (typeof window === "undefined") return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

/**
 * Use as your `useState` initializer to hydrate from localStorage on mount:
 *
 * ```tsx
 * const [config, setConfig] = useState(() =>
 *   loadPersistedShaderDevValues("my-shader", DEFAULTS),
 * )
 * ```
 *
 * Unknown keys in the persisted blob are dropped; missing keys fall back to
 * defaults. Always returns a fresh object (no shared reference with defaults).
 */
export function loadPersistedShaderDevValues<T extends Record<string, unknown>>(
  id: string,
  defaults: T,
): T {
  const s = storage()
  if (!s) return { ...defaults }
  try {
    const raw = s.getItem(PERSIST_PREFIX + id)
    if (!raw) return { ...defaults }
    const parsed = JSON.parse(raw) as Partial<T>
    if (!parsed || typeof parsed !== "object") return { ...defaults }
    const next = { ...defaults }
    for (const key of Object.keys(defaults) as (keyof T)[]) {
      if (key in parsed && parsed[key] !== undefined) {
        next[key] = parsed[key] as T[typeof key]
      }
    }
    return next
  } catch {
    return { ...defaults }
  }
}

export function persistShaderDevValues<T extends Record<string, unknown>>(
  id: string,
  values: T,
): void {
  const s = storage()
  if (!s) return
  try {
    s.setItem(PERSIST_PREFIX + id, JSON.stringify(values))
  } catch {
    /* quota exceeded, private mode — silent */
  }
}

export function clearPersistedShaderDevValues(id: string): void {
  const s = storage()
  if (!s) return
  try {
    s.removeItem(PERSIST_PREFIX + id)
  } catch {
    /* ignore */
  }
}

export function hasPersistedShaderDevValues(id: string): boolean {
  const s = storage()
  if (!s) return false
  try {
    return s.getItem(PERSIST_PREFIX + id) !== null
  } catch {
    return false
  }
}

/** localStorage key for section expand/collapse UI state (`shader-dev:<id>:sections`). */
function sectionsStorageKey(id: string): string {
  return PERSIST_PREFIX + id + SECTIONS_SUFFIX
}

/**
 * Load which panel sections are open. Missing keys default to open (`true`).
 */
export function loadPersistedShaderDevSections(
  id: string,
): Record<string, boolean> {
  const s = storage()
  if (!s) return {}
  try {
    const raw = s.getItem(sectionsStorageKey(id))
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, unknown>
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {}
    }
    const out: Record<string, boolean> = {}
    for (const [title, value] of Object.entries(parsed)) {
      if (typeof value === "boolean") out[title] = value
    }
    return out
  } catch {
    return {}
  }
}

export function persistShaderDevSections(
  id: string,
  sections: Record<string, boolean>,
): void {
  const s = storage()
  if (!s) return
  try {
    if (Object.keys(sections).length === 0) {
      s.removeItem(sectionsStorageKey(id))
      return
    }
    s.setItem(sectionsStorageKey(id), JSON.stringify(sections))
  } catch {
    /* quota exceeded, private mode — silent */
  }
}

export function clearPersistedShaderDevSections(id: string): void {
  const s = storage()
  if (!s) return
  try {
    s.removeItem(sectionsStorageKey(id))
  } catch {
    /* ignore */
  }
}

export function hasPersistedShaderDevSections(id: string): boolean {
  const s = storage()
  if (!s) return false
  try {
    return s.getItem(sectionsStorageKey(id)) !== null
  } catch {
    return false
  }
}
