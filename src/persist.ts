/**
 * localStorage persistence for shader dev panel values.
 *
 * Keyed by `panels:<id>` so each registered shader gets its own slot. Reads
 * fall back to the legacy `shader-dev:<id>` key so upgrades don't lose state.
 * Values are merged with defaults on load so adding a new field doesn't wipe
 * existing edits.
 */

const PERSIST_PREFIX = "panels:"
const LEGACY_PERSIST_PREFIX = "shader-dev:"
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
 * Read a value from the new `panels:` key, falling back to the legacy
 * `shader-dev:` key so existing users' saved state hydrates after upgrade.
 * Writes always go to the new key; legacy keys are never deleted.
 */
function readWithLegacy(s: Storage, key: string, legacyKey: string): string | null {
  const current = s.getItem(key)
  if (current !== null) return current
  return s.getItem(legacyKey)
}

/**
 * Use as your `useState` initializer to hydrate from localStorage on mount:
 *
 * ```tsx
 * const [config, setConfig] = useState(() =>
 *   loadPersistedPanelValues("my-shader", DEFAULTS),
 * )
 * ```
 *
 * Unknown keys in the persisted blob are dropped; missing keys fall back to
 * defaults. Always returns a fresh object (no shared reference with defaults).
 */
export function loadPersistedPanelValues<T extends Record<string, unknown>>(
  id: string,
  defaults: T,
): T {
  const s = storage()
  if (!s) return { ...defaults }
  try {
    const raw = readWithLegacy(s, PERSIST_PREFIX + id, LEGACY_PERSIST_PREFIX + id)
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

export function persistPanelValues<T extends Record<string, unknown>>(
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

export function clearPersistedPanelValues(id: string): void {
  const s = storage()
  if (!s) return
  try {
    s.removeItem(PERSIST_PREFIX + id)
  } catch {
    /* ignore */
  }
}

export function hasPersistedPanelValues(id: string): boolean {
  const s = storage()
  if (!s) return false
  try {
    return readWithLegacy(s, PERSIST_PREFIX + id, LEGACY_PERSIST_PREFIX + id) !== null
  } catch {
    return false
  }
}

/** localStorage key for section expand/collapse UI state (`panels:<id>:sections`). */
function sectionsStorageKey(id: string): string {
  return PERSIST_PREFIX + id + SECTIONS_SUFFIX
}

/** Legacy section-state key (`shader-dev:<id>:sections`) for read fallback. */
function legacySectionsStorageKey(id: string): string {
  return LEGACY_PERSIST_PREFIX + id + SECTIONS_SUFFIX
}

/**
 * Load which panel sections are open. Missing keys default to open (`true`).
 */
export function loadPersistedPanelSections(
  id: string,
): Record<string, boolean> {
  const s = storage()
  if (!s) return {}
  try {
    const raw = readWithLegacy(
      s,
      sectionsStorageKey(id),
      legacySectionsStorageKey(id),
    )
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

export function persistPanelSections(
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

export function clearPersistedPanelSections(id: string): void {
  const s = storage()
  if (!s) return
  try {
    s.removeItem(sectionsStorageKey(id))
  } catch {
    /* ignore */
  }
}

export function hasPersistedPanelSections(id: string): boolean {
  const s = storage()
  if (!s) return false
  try {
    return (
      readWithLegacy(
        s,
        sectionsStorageKey(id),
        legacySectionsStorageKey(id),
      ) !== null
    )
  } catch {
    return false
  }
}
