"use client"

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { ControlColorInput } from "./ui/control-color-input"
import { ControlQuickActions } from "./ui/control-quick-actions"
import { ControlSection } from "./ui/control-section"
import { ControlSelect } from "./ui/control-select"
import { ControlSlider } from "./ui/control-slider"
import { ControlToggle } from "./ui/control-toggle"
import { ControlVec2 } from "./ui/control-vec2"
import {
  DEFAULT_SHADER_DEV_PROMPTS,
  type ShaderDevPrompt,
} from "./_default-prompts"
import { ShaderDevFloatingPanel } from "./_floating-panel"
import {
  clearPersistedShaderDevValues,
  persistShaderDevValues,
} from "./_persist"
import type { ShaderDevTheme } from "./_use-shader-dev-theme"
import type { ShaderDevFieldDef } from "./_types"
import { isShaderDevSection } from "./_types"

export type ShaderDevWriteResult = { ok: boolean; message: string }

export function ShaderDevPanel<T extends Record<string, unknown>>({
  id,
  title,
  titleSlot,
  open,
  onClose,
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
}: {
  /** Used as the localStorage key (`shader-dev:<id>`) when `persist` is true. */
  id?: string
  title: string
  /** Rendered next to the title — used by ShaderDevRoot for the multi-shader switcher. */
  titleSlot?: React.ReactNode
  open: boolean
  onClose: () => void
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

  // Detect "modified" by comparing serialized snapshots. Flat configs are
  // cheap and the rendered indicator only flips on real change.
  const valuesJson = useMemo(() => JSON.stringify(values), [values])
  const defaultsJson = useMemo(() => JSON.stringify(defaults), [defaults])
  const isModified = valuesJson !== defaultsJson

  // Write to localStorage whenever values change (debounce-free — these are
  // tiny blobs and the user is hand-tweaking).
  const persistKey = persist && id ? id : null
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

  const configJson = useMemo(() => JSON.stringify(values, null, 2), [values])

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

      const key = field.key

      if (field.type === "slider") {
        pushField(
          <ControlSlider
            label={field.label}
            value={values[key] as number}
            min={field.min}
            max={field.max}
            step={field.step}
            onChange={(v) => setKey(key, v as T[typeof key])}
          />,
          key,
        )
        continue
      }

      if (field.type === "toggle") {
        pushField(
          <ControlToggle
            label={field.label}
            value={values[key] as boolean}
            onChange={(v) => setKey(key, v as T[typeof key])}
          />,
          key,
        )
        continue
      }

      if (field.type === "select") {
        pushField(
          <ControlSelect
            label={field.label}
            value={values[key] as string | number}
            options={field.options}
            onChange={(v) => setKey(key, v as T[typeof key])}
          />,
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
  }, [fields, setKey, values])

  return (
    <ShaderDevFloatingPanel
      side="right"
      collapsed={!open}
      onToggle={onClose}
      title={title}
      titleSlot={titleSlot}
      defaultTheme={defaultTheme}
    >
      <div className="sd-fields">
        {prompts.length > 0 ? (
          <ControlQuickActions prompts={prompts} shaderName={title} />
        ) : null}

        {shortcutHint ? (
          <div className="sd-shortcut-hint">
            <kbd>⌘⇧`</kbd> (recommended) · <kbd>⌘⌥D</kbd> · <kbd>⌘⇧D</kbd> if
            your browser does not reserve it
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
