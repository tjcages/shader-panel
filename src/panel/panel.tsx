"use client"

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { ControlAction } from "../controls/action"
import { ControlAnimation } from "../controls/animation-controls"
import { ControlColorInput } from "../controls/color-input"
import { ControlExport } from "../controls/export-controls"
import { ControlImageInput } from "../controls/image-input"
import { ControlPath, type PathPoint } from "../controls/path-input"
import { ControlQuickActions } from "../controls/quick-actions"
import { ControlSection } from "../controls/section"
import { ControlSelect } from "../controls/select"
import { ControlSlider } from "../controls/slider"
import { ControlToggle } from "../controls/toggle"
import { ControlVec2 } from "../controls/vec2"
import {
  DEFAULT_SHADER_DEV_PROMPTS,
  type ShaderDevPrompt,
} from "../prompts"
import { ShaderDevFloatingPanel } from "./floating-panel"
import {
  clearPersistedShaderDevValues,
  hasPersistedShaderDevValues,
  loadPersistedShaderDevValues,
  persistShaderDevValues,
} from "../persist"
import type { ShaderDevTheme } from "../hooks/use-theme"
import type { ShaderDevFieldDef } from "../types"
import { isShaderDevSection } from "../types"

export type ShaderDevWriteResult = { ok: boolean; message: string }

export function ShaderDevPanel<T extends Record<string, unknown>>({
  id,
  title,
  titleSlot,
  open,
  onClose,
  onOpen,
  values,
  defaults,
  fields,
  onChange,
  onWriteConfig,
  writeLabel = "Write config file",
  shortcutHint = false,
  prompts = DEFAULT_SHADER_DEV_PROMPTS,
  persist = true,
  defaultTheme,
  actionHandlers,
}: {
  /** Used as the localStorage key (`shader-dev:<id>`) when `persist` is true. */
  id?: string
  title: string
  /** Rendered next to the title — used by ShaderDevRoot for the multi-shader switcher. */
  titleSlot?: React.ReactNode
  open: boolean
  onClose: () => void
  /** Open the panel — used by the edge-hover peek preview. */
  onOpen?: () => void
  values: T
  defaults: T
  fields: ShaderDevFieldDef<T>[]
  onChange: (next: T) => void
  onWriteConfig?: (values: T) => Promise<ShaderDevWriteResult>
  writeLabel?: string
  shortcutHint?: boolean
  /** AI-prompt rail at the top of the panel. Pass `[]` to hide. */
  prompts?: ReadonlyArray<ShaderDevPrompt>
  /** Persist values to `localStorage["shader-dev:<id>"]`. Requires `id`. Default true. */
  persist?: boolean
  defaultTheme?: ShaderDevTheme
  /** Handlers for `type: "action"` fields, keyed by `actionId`. */
  actionHandlers?: Record<string, () => void>
}) {
  const [writing, setWriting] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [pasteOpen, setPasteOpen] = useState(false)
  const [pasteText, setPasteText] = useState("")
  const [pasteError, setPasteError] = useState<string | null>(null)
  const pasteTextareaRef = useRef<HTMLTextAreaElement | null>(null)

  // Focus + scroll-into-view when the paste sheet opens. Wait until the open
  // transition has progressed (~half the 280ms duration) so the textarea has
  // measurable height — browsers skip focus on zero-rendered-size elements.
  useEffect(() => {
    if (!pasteOpen) return
    const id = window.setTimeout(() => {
      const el = pasteTextareaRef.current
      if (!el) return
      el.focus({ preventScroll: true })
      el.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }, 150)
    return () => window.clearTimeout(id)
  }, [pasteOpen])

  // Image values (object URLs) are excluded from persistence, modified
  // detection, and Copy JSON — an object URL is dead after reload, and a
  // data URL would blow the localStorage quota.
  const imageKeys = useMemo(() => {
    const keys = new Set<string>()
    for (const f of fields) {
      if (!isShaderDevSection(f) && f.type === "image") keys.add(f.key)
    }
    return keys
  }, [fields])

  const stripImages = useCallback(
    (obj: Record<string, unknown>): Record<string, unknown> => {
      if (imageKeys.size === 0) return obj
      const out = { ...obj }
      for (const k of imageKeys) delete out[k]
      return out
    },
    [imageKeys],
  )

  // Detect "modified" by comparing serialized snapshots. Flat configs are
  // cheap and the rendered indicator only flips on real change.
  const valuesJson = useMemo(
    () => JSON.stringify(stripImages(values)),
    [values, stripImages],
  )
  const defaultsJson = useMemo(
    () => JSON.stringify(stripImages(defaults)),
    [defaults, stripImages],
  )
  const isModified = valuesJson !== defaultsJson

  const persistKey = persist && id ? id : null

  // Auto-hydrate from localStorage on first mount for this id — push saved
  // values back through onChange. This makes persistence "just work" without
  // the consumer wiring `loadPersistedShaderDevValues` into its useState
  // initializer (that path still works and avoids the one-frame flash).
  const liveRef = useRef({ onChange, defaults, values, valuesJson, stripImages })
  liveRef.current = { onChange, defaults, values, valuesJson, stripImages }
  const hydratedIdRef = useRef<string | null>(null)
  useEffect(() => {
    if (!persistKey) return
    if (hydratedIdRef.current === persistKey) return
    hydratedIdRef.current = persistKey
    if (!hasPersistedShaderDevValues(persistKey)) return
    const live = liveRef.current
    const saved = loadPersistedShaderDevValues(persistKey, live.defaults)
    // Image keys are never persisted — keep whatever the app currently holds
    // (a consumer may have set an object URL before hydration ran).
    for (const k of imageKeys) {
      if (k in live.values) {
        ;(saved as Record<string, unknown>)[k] = live.values[k]
      }
    }
    if (JSON.stringify(live.stripImages(saved)) !== live.valuesJson) {
      live.onChange(saved as T)
    }
  }, [persistKey, imageKeys])

  // Write to localStorage whenever values change (debounce-free — these are
  // tiny blobs and the user is hand-tweaking).
  const skipNextPersistRef = useRef(true)
  useEffect(() => {
    if (!persistKey) return
    if (skipNextPersistRef.current) {
      skipNextPersistRef.current = false
      return
    }
    if (isModified) {
      persistShaderDevValues(persistKey, JSON.parse(valuesJson) as T)
    } else {
      clearPersistedShaderDevValues(persistKey)
    }
  }, [persistKey, valuesJson, isModified])

  const setKey = useCallback(
    <K extends keyof T>(key: K, val: T[K]) => {
      onChange({ ...values, [key]: val })
    },
    [onChange, values],
  )

  const resetAll = useCallback(() => {
    onChange({ ...defaults })
    if (persistKey) clearPersistedShaderDevValues(persistKey)
    setStatus(null)
  }, [defaults, onChange, persistKey])

  const handleApplyPaste = useCallback(() => {
    try {
      const parsed = JSON.parse(pasteText) as Partial<T>
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Expected a JSON object")
      }
      const next = { ...values }
      let applied = 0
      for (const key of Object.keys(defaults) as (keyof T)[]) {
        if (key in parsed && (parsed as Record<string, unknown>)[key as string] !== undefined) {
          next[key] = (parsed as Record<string, unknown>)[key as string] as T[typeof key]
          applied += 1
        }
      }
      if (applied === 0) {
        throw new Error("No known keys found")
      }
      onChange(next)
      setPasteOpen(false)
      setPasteText("")
      setPasteError(null)
      setStatus(`Applied ${applied} key${applied === 1 ? "" : "s"}`)
      setTimeout(() => setStatus(null), 2000)
    } catch (err) {
      setPasteError(err instanceof Error ? err.message : "Invalid JSON")
    }
  }, [defaults, onChange, pasteText, values])

  const configJson = useMemo(
    () => JSON.stringify(stripImages(values), null, 2),
    [values, stripImages],
  )

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(configJson)
    setStatus("Copied JSON to clipboard")
    setTimeout(() => setStatus(null), 2000)
  }, [configJson])

  const handleWrite = useCallback(async () => {
    if (!onWriteConfig) return
    setWriting(true)
    setStatus(null)
    try {
      const result = await onWriteConfig(values)
      setStatus(result.message)
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Write failed")
    } finally {
      setWriting(false)
    }
  }, [onWriteConfig, values])

  const resetKeys = useCallback(
    (keys: ReadonlyArray<keyof T & string>) => {
      const next = { ...values }
      for (const k of keys) {
        next[k] = defaults[k]
      }
      onChange(next)
    },
    [defaults, onChange, values],
  )

  const sections = useMemo(() => {
    const out: {
      title: string
      children: ReactNode[]
      keys: (keyof T & string)[]
    }[] = []
    let current: {
      title: string
      children: ReactNode[]
      keys: (keyof T & string)[]
    } | null = null

    const pushField = (
      node: ReactNode,
      key: keyof T & string,
    ) => {
      if (!current) {
        current = { title: "Parameters", children: [], keys: [] }
        out.push(current)
      }
      current.children.push(<div key={key}>{node}</div>)
      current.keys.push(key)
    }

    for (const field of fields) {
      if (isShaderDevSection(field)) {
        current = { title: field.title, children: [], keys: [] }
        out.push(current)
        continue
      }

      if (field.type === "action") {
        if (field.when && !field.when(values)) continue
        const handler = actionHandlers?.[field.actionId]
        pushField(
          <ControlAction
            label={field.label}
            description={field.description}
            variant={field.variant}
            disabled={!handler}
            onClick={() => handler?.()}
          />,
          field.actionId,
        )
        continue
      }

      const key = field.key

      if (field.type === "slider") {
        pushField(
          <>
            {field.description && (
              <div className="sd-field-description">{field.description}</div>
            )}
            <ControlSlider
              label={field.label}
              value={values[key] as number}
              min={field.min}
              max={field.max}
              step={field.step}
              onChange={(v) => setKey(key, v as T[typeof key])}
            />
          </>,
          key,
        )
        continue
      }

      if (field.type === "toggle") {
        pushField(
          <>
            {field.description && (
              <div className="sd-field-description">{field.description}</div>
            )}
            <ControlToggle
              label={field.label}
              value={values[key] as boolean}
              onChange={(v) => setKey(key, v as T[typeof key])}
            />
          </>,
          key,
        )
        continue
      }

      if (field.type === "select") {
        pushField(
          <>
            {field.description && (
              <div className="sd-field-description">{field.description}</div>
            )}
            <ControlSelect
              label={field.label}
              value={values[key] as string | number}
              options={field.options}
              layout={field.layout}
              onChange={(v) => setKey(key, v as T[typeof key])}
            />
          </>,
          key,
        )
        continue
      }

      if (field.type === "vec2") {
        pushField(
          <ControlVec2
            label={field.label}
            value={values[key] as readonly [number, number]}
            min={field.min}
            max={field.max}
            step={field.step}
            xLabel={field.xLabel}
            yLabel={field.yLabel}
            onChange={(v) => setKey(key, v as T[typeof key])}
          />,
          key,
        )
        continue
      }

      if (field.type === "image") {
        pushField(
          <>
            {field.description && (
              <div className="sd-field-description">{field.description}</div>
            )}
            <ControlImageInput
              label={field.label}
              value={(values[key] as string) ?? ""}
              readonly={field.readonly}
              accept={field.accept}
              emptyLabel={field.emptyLabel}
              onChange={
                field.readonly
                  ? undefined
                  : (v) => setKey(key, v as T[typeof key])
              }
            />
          </>,
          key,
        )
        continue
      }

      if (field.type === "path") {
        const anchor = field.anchorKey
          ? (values[field.anchorKey] as PathPoint | undefined)
          : undefined
        pushField(
          <>
            {field.description && (
              <div className="sd-field-description">{field.description}</div>
            )}
            <ControlPath
              label={field.label}
              value={(values[key] as ReadonlyArray<PathPoint>) ?? []}
              min={field.min}
              max={field.max}
              anchor={anchor}
              onChange={(v) => setKey(key, v as T[typeof key])}
            />
          </>,
          key,
        )
        continue
      }

      // type === "color"
      pushField(
        <ControlColorInput
          label={field.label}
          value={values[key] as string}
          onChange={(v) => setKey(key, v as T[typeof key])}
        />,
        key,
      )
    }

    return out
  }, [actionHandlers, fields, setKey, values])

  return (
    <ShaderDevFloatingPanel
      side="right"
      collapsed={!open}
      onToggle={onClose}
      onOpen={onOpen}
      title={title}
      titleSlot={titleSlot}
      defaultTheme={defaultTheme}
    >
      <div className="sd-fields">
        <ControlAnimation />

        {prompts.length > 0 ? (
          <ControlQuickActions prompts={prompts} shaderName={title} />
        ) : null}

        {shortcutHint ? (
          <div className="sd-shortcut-hint">
            <kbd>⌘⌥D</kbd> to toggle · <kbd>⌘⇧`</kbd> / <kbd>⌘⇧D</kbd> also work
          </div>
        ) : null}

        {sections.map((section) => (
          <ControlSection
            key={section.title}
            title={section.title}
            onReset={
              section.keys.length > 0
                ? () => resetKeys(section.keys)
                : undefined
            }
          >
            {section.children}
          </ControlSection>
        ))}

        <div className="sd-actions">
          {/* Image / video export sits at the top of the actions block, above
              the reset / copy / paste JSON controls. */}
          <ControlExport name={title} />

          <button type="button" onClick={resetAll} className="sd-action-btn">
            Reset to defaults
          </button>
          <button type="button" onClick={handleCopy} className="sd-action-btn">
            Copy JSON
          </button>
          <button
            type="button"
            onClick={() => {
              setPasteOpen((v) => !v)
              setPasteError(null)
            }}
            className="sd-action-btn"
            aria-expanded={pasteOpen}
          >
            {pasteOpen ? "Cancel paste" : "Paste JSON"}
          </button>

          <div
            className="sd-collapse"
            data-sd-open={persistKey && isModified ? "true" : "false"}
            aria-hidden={!(persistKey && isModified)}
          >
            <div className="sd-collapse-inner">
              <div className="sd-saved-indicator" aria-live="polite">
                <span className="sd-saved-dot" /> Edits saved locally
              </div>
            </div>
          </div>

          <div
            className="sd-collapse"
            data-sd-open={pasteOpen ? "true" : "false"}
            aria-hidden={!pasteOpen}
          >
            <div className="sd-collapse-inner">
              <div className="sd-paste">
                <textarea
                  ref={pasteTextareaRef}
                  className="sd-paste-textarea"
                  value={pasteText}
                  onChange={(e) => {
                    setPasteText(e.target.value)
                    if (pasteError) setPasteError(null)
                  }}
                  placeholder='{ "speed": 1.0, "bgColor": "#ff0000" }'
                  spellCheck={false}
                  rows={5}
                />
                {pasteError ? (
                  <div className="sd-paste-error">{pasteError}</div>
                ) : null}
                <button
                  type="button"
                  onClick={handleApplyPaste}
                  disabled={pasteText.trim().length === 0}
                  className="sd-action-btn"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          {onWriteConfig ? (
            <button
              type="button"
              disabled={writing}
              onClick={() => void handleWrite()}
              className="sd-action-btn"
            >
              {writing ? "Writing…" : writeLabel}
            </button>
          ) : null}
          {status ? <div className="sd-status">{status}</div> : null}
        </div>
      </div>
    </ShaderDevFloatingPanel>
  )
}
